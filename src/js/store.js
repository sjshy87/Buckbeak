import { createEpicMiddleware } from "redux-observable";
import { createStore, applyMiddleware } from "redux";
import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";
import collection from "../modules/collection/CollectionReducers";
import map from "../modules/map/MapReducers";
import panel from "../modules/panel/PanelReducers";
import query, { sharedWorkerProxyEpic } from "../modules/query/QueryReducers";
//import query, { queryEpic, sharedWorkerProxyEpic } from "../modules/query/QueryReducers";

export const rootEpic = combineEpics(sharedWorkerProxyEpic); //, queryEpic);

const rootReducer = combineReducers({
  collection,
  map,
  panel,
  query
});

const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(rootReducer, applyMiddleware(epicMiddleware));

export default store;
