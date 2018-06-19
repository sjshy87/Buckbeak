import { createStore } from "redux";
import { combineReducers } from "redux";
import collection from "../modules/collection/CollectionReducers";
import map from "../modules/map/MapReducers";
import panel from "../modules/panel/PanelReducers";
import query from "../modules/query/QueryReducers";

const rootReducer = combineReducers({
  collection,
  map,
  panel,
  query
});

const store = createStore(rootReducer);

export default store;
