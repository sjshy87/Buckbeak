import _ from "lodash";
import {
  CREATE_COLLECTION,
  DELETE_COLLECTION,
  UPDATE_COLLECTION,
  DELETE_FROM_COLLECTION
} from "./CollectionActions";

const initialState = { collections: {} };

export default function(state = initialState, action) {
  const id = action.id;
  let collection;
  switch (action.type) {
    case CREATE_COLLECTION:
      collection = state.collections[id];
      if (collection) {
        console.error("Cannot create collection (already exists)", id);
        return state;
      } else {
        collection = {
          id,
          name: action.name,
          queries: action.queries,
          data: []
        };
        console.log({
          ...state,
          collections: { ...state.collections, [id]: collection }
        });
        return {
          ...state,
          collections: { ...state.collections, [id]: collection }
        };
      }
    case DELETE_COLLECTION:
      const { [id]: deleted, ...collections } = state.collections;
      if (deleted) return { ...state, collections };
      else {
        console.error("Cannot delete collection (does not exist)", id);
        return state;
      }
    case UPDATE_COLLECTION:
      collection = state.collections[id];
      if (collection) {
        console.log("Sample", action.data[0]);
        return {
          ...state,
          collections: { ...state.collections, [id]: action.data }
        };
      } else {
        console.error("Cannot update collection (does not exist)", id);
        return state;
      }
    case DELETE_FROM_COLLECTION:
      //TODO: Reimplement
      collection = _.omit(state.collection[action.id], action.ids);
      return {
        ...state,
        collections: { ...state.collections, [action.id]: collection }
      };
    default:
  }
  return state;
}
