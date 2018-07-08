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
import { queryPaused, queryCancelled } from "../modules/query/QueryOperators";

const sources = {
  ADSB: new ADSBSource(),
  Test: new TestSource()
};

function mergeUpdates() {
  return function mergeUpdatesImplementation(source) {
    return source.pipe(bufferTime(5000), mergeAll());
  };
}
function mapToCollection(action$) {
  return function mapToCollectionImplementation(src) {
    return src.mergeMap(action => {
      const adapter = sources[action.source].query(action.query);
      const id = action.id;
      const source = new ReplaySubject(1); //We use a replay subject so that, on unpause, we immediately emit the current value
      const buffered = new Subject(); //Our buffer of data during pause

      const isComplete = action$.pipe(queryCancelled(id));

      const pauseQuery = action$.pipe(queryPaused(id, false));

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
