import { combineReducers } from "redux";
import collections from "./collections";
import map from "./map";
import panels from "./panels";
import queries from "./queries";

export default combineReducers({
  collections,
  map,
  panels,
  queries
});
