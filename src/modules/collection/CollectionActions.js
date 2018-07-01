/* Types */
export const CREATE_COLLECTION = "CREATE_COLLECTION";
export const DELETE_COLLECTION = "DELETE_COLLECTION";
export const UPDATE_COLLECTION = "UPDATE_COLLECTION";

/* Actions */
export const createCollection = (id, name, queries) => ({
  type: CREATE_COLLECTION,
  id,
  name,
  queries
});
export const deleteCollection = id => ({
  type: DELETE_COLLECTION,
  id
});
export const updateCollection = (id, data) => ({
  type: UPDATE_COLLECTION,
  id,
  data
});
