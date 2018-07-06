import uuid from "uuid/v4";
import Worker from "../../workers/collections.shared.js";
import { Subject, Observable } from "rxjs";
import { concat } from "rxjs/observable/concat";
import { of } from "rxjs/observable/of";
import { ofType } from "redux-observable";
import {
  takeUntil,
  filter,
  map,
  mergeMap,
  switchMap,
  buffer,
  mergeAll,
  tap
} from "rxjs/operators";
import {
  createCollection,
  updateCollection
} from "../collection/CollectionActions";
import {
  CREATE_QUERY,
  RESUME_QUERY,
  PAUSE_QUERY,
  CANCEL_QUERY
} from "./QueryActions";

const initialState = {};

export const sharedWorkerProxyEpic = (action$, state$) => {
  const worker = new Worker();
  const port = worker.port;
  worker.onerror = e => console.error(e);

  //This observable takes all responses from the shared worker,
  //assues they are actions, and passes them back to redux
  //If an error occurs, this will die
  const observable = new Observable(observer => {
    port.onmessage = function(e) {
      //console.log("Got message from worker", e.data.length / 1000000 + "MB");
      observer.next(JSON.parse(e.data));
    };
    port.onerror = function(e) {
      //TODO: We should put out some message that can be used to restart the worker,
      //or at least log it.
      console.error(
        "An error occured in the shared worker, we should probably do something smart",
        e
      );
      observer.error(e.data);
    };
  });

  //Here, we take all whitelisted actions, and pass them to the worker
  action$
    .pipe(ofType(CREATE_QUERY, RESUME_QUERY, PAUSE_QUERY, CANCEL_QUERY))
    .subscribe(action => port.postMessage(JSON.stringify(action)));

  //Finally, we start the port and return the observable. The observable is returned
  //because it is the stream of output actions from the worker
  port.start();
  return observable;
};

export const queryEpic = (action$, state$) =>
  action$.pipe(
    ofType(CREATE_QUERY),
    mergeMap(action => {
      const id = action.id;
      const source = new Subject(); //Our local subscription  to the source
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
      console.log("Subscribing", action);
      action.query.observable.subscribe(source);
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
    })
  );

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_QUERY:
      console.log("CREATE QUERY", action);
      return {
        ...state,
        [action.id]: {
          paused: false,
          source: action.source,
          query: action.query
        }
      };
    case RESUME_QUERY:
      return { ...state, [action.id]: { ...state[action.id], paused: false } };
    case PAUSE_QUERY:
      return { ...state, [action.id]: { ...state[action.id], paused: true } };
    case CANCEL_QUERY:
      const { [action.id]: toRemove, ...newState } = state;
      return newState;
    default:
      return state;
  }
}
