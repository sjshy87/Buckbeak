import {
  CREATE_COLLECTION,
  DELETE_COLLECTION,
  UPDATE_COLLECTION
} from "./CollectionActions";
const initialState = {
  collections: []
};
export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_COLLECTION:
      return state;
    case DELETE_COLLECTION:
      return state;
    case UPDATE_COLLECTION:
      return state;
    default:
      return state;
  }
}
