import uuid from "uuid/v4";
import {
  CREATE_COLLECTION,
  DELETE_COLLECTION,
  UPDATE_COLLECTION
} from "./CollectionActions";

const initialState = {
  collections: {}
};

export default function(state = initialState, action) {
  let id = action.id || uuid();
  switch (action.type) {
    case CREATE_COLLECTION:
      if (state.collections[id]) return state;
      let collection = { name: action.name, data: [] };
      return { state, collections: { ...state.collections, [id]: collection } };
    case DELETE_COLLECTION:
      //Interesting use of spread operator. Basically takes the provided id, and puts it into its own variable.
      //Then it takes everything else and puts it into a new object.
      const { [id]: blah, ...collections } = state.collections;
      return { ...state, collections };
    case UPDATE_COLLECTION:
      console.log("TODO: Update", action);
      return state;
    default:
      return state;
  }
}
