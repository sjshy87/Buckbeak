import uuid from "uuid/v4";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import { concat } from "rxjs/observable/concat";
import { ofType } from "redux-observable";
import {
  createCollection,
  updateCollection
} from "../collection/CollectionActions";
import { takeUntil, filter, map, mergeMap, switchMap } from "rxjs/operators";
import {
  CREATE_QUERY,
  RESUME_QUERY,
  PAUSE_QUERY,
  CANCEL_QUERY
} from "./QueryActions";

const initialState = {};

export const queryEpic = (action$, state$) =>
  action$.pipe(
    ofType(CREATE_QUERY),
    mergeMap(action => {
      const id = action.id;
      const source = new Subject(); //Our local subscription  to the source
      const buffer = new Subject(); //Our buffer of data during pause

      //Watch for CANCEL_QUERY actions related to this query
      const isComplete = action$.pipe(
        ofType(CANCEL_QUERY),
        filter(action => action.id === id)
      );

      //Look for PAUSE_QUERY and RESUME_QUERY actions related to this query
      //If it is a PAUSE_QUERY, emit true (pause). Otherwise, emit false (unpaused)
      //We concat a 'false' first because we want to immediately emit events
      const pauseQuery = concat(
        Observable.of(false),
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
      source
        .buffer(pauseQuery)
        .mergeAll()
        .subscribe(buffer);

      const collectionId = uuid();
      return concat(
        Observable.of(createCollection(collectionId, "Something")),
        pauseQuery.pipe(
          switchMap(paused => (paused ? buffer : source)),
          map(data => updateCollection(collectionId, data)),
          takeUntil(isComplete)
        )
      );
    })
  );

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_QUERY:
      return { ...state, [action.id]: { paused: false, ...action.query } };
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
