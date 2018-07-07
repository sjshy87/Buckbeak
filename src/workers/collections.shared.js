import uuid from "uuid/v4";
import {
  CREATE_QUERY,
  RESUME_QUERY,
  PAUSE_QUERY,
  CANCEL_QUERY
} from "../modules/query/QueryActions";
import {
  createCollection,
  updateCollection
} from "../modules/collection/CollectionActions";
import { ADSBSource } from "../modules/sources/adsbSource";
import { TestSource } from "../modules/sources/testSource";
import { Subject, ReplaySubject } from "rxjs";
import { concat } from "rxjs/observable/concat";
import { of } from "rxjs/observable/of";
import { empty } from "rxjs/observable/empty";
import { ofType } from "redux-observable";
import {
  tap,
  scan,
  bufferTime,
  bufferToggle,
  takeUntil,
  filter,
  map,
  mergeMap,
  switchMap,
  buffer,
  mergeAll,
  pipe
} from "rxjs/operators";

const sources = {
  ADSB: new ADSBSource(),
  Test: new TestSource()
};

const TIME = 0;
const VALUE = 1;

function insertProperty(array, p) {
  //If the array is non-empty, try to return a new array with p inserted in the correct location
  if (array.length > 0) {
    //Iterate backwards through the array. When you find a time
    //older than the property being inserted, insert there
    for (let i = array.length - 1; i >= 0; i--) {
      let property = array[i];
      //We found point *before* insertion.
      if (property[TIME] <= p[TIME]) {
        //If the values are the same, no change. Return the current array
        if (property[VALUE] === p[VALUE]) return array;
        //Otherwise, copy the array, then insert after the current property
        array.splice(i + 1, 0, p);
        return array;
      }
    }
  }
  //If we get here, the new value is before all other values.
  if (array[0] === undefined || p[VALUE] !== array[0][VALUE]) array.push(p);
  return array;
}

function mergeUpdates() {
  return function mergeUpdatesImplementation(source) {
    return source.pipe(bufferTime(5000), mergeAll());
    /*
    return source.pipe(
      scan((collection, updates) => {
        return updates.reduce((collection, update) => {
          let entity = collection[update.id] || {
            id: update.id,
            label: update.label,
            start: update.time,
            position: [],
            properties: {}
          };
          entity.end = update.time;
          if (update.position) {
            entity.position = insertProperty(entity.position, update.position);
          }
          if (update.properties) {
            entity.properties = _.reduce(
              update.properties,
              (properties, v, k) => {
                properties[k] = insertProperty(properties[k] || [], v);
                return properties;
              },
              entity.properties
            );
          }

          collection[update.id] = entity;
          return collection;
        }, collection);
      }, {}),
      map(collection => Object.values(collection)),
      throttleTime(5000)
    );
    */
  };
}
function mapToCollection(action$) {
  return function mapToCollectionImplementation(src) {
    return src.mergeMap(action => {
      const adapter = sources[action.source].query(action.query);
      const id = action.id;
      const source = new ReplaySubject(1); //We use a replay subject so that, on unpause, we immediately emit the current value
      const buffered = new Subject(); //Our buffer of data during pause

      //Watch for CANCEL_QUERY actions related to this query
      const isComplete = action$.pipe(
        ofType(CANCEL_QUERY),
        filter(action => action.id === id)
      );

      //Look for PAUSE_QUERY and RESUME_QUERY actions related to this query
      //If it is a PAUSE_QUERY, emit true (pause). Otherwise, emit false (unpaused)
      //We concat a 'false' first because we want to immediately emit events
      const pauseQuery = concat(
        of(false),
        action$.pipe(
          ofType(RESUME_QUERY, PAUSE_QUERY),
          filter(action => action.id === id),
          map(action => action.type === PAUSE_QUERY)
        )
      );

      //We separate the query's observable from the source because we assume it 'cold',
      //and we don't want to restart it on subscription
      adapter.pipe(mergeUpdates()).subscribe(source);
      source.pipe(buffer(pauseQuery), mergeAll()).subscribe(buffered);

      const collectionId = uuid();
      return concat(
        of(createCollection(collectionId, "Something")),
        pauseQuery.pipe(
          switchMap(paused => (paused ? buffered : source)),
          map(data => updateCollection(collectionId, data)),
          takeUntil(isComplete)
        )
      );
    });
  };
}

self.onconnect = function(e) {
  let port = e.ports[0];
  let action$ = new Subject();
  port.onmessage = function(e) {
    action$.next(JSON.parse(e.data));
  };

  action$
    .pipe(ofType(CREATE_QUERY), mapToCollection(action$))
    .subscribe(updates => port.postMessage(JSON.stringify(updates)));
};
