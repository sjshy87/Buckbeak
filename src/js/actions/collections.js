/* Types */
export const CREATE_COLLECTION = "CREATE_COLLECTION";
export const DELETE_COLLECTION = "DELETE_COLLECTION";
export const UPDATE_COLLECTION = "UPDATE_COLLECTION";

/* Actions */
export const createCollection = def => ({ type: CREATE_COLLECTION, def });
export const deleteCollection = collection => ({
  type: DELETE_COLLECTION,
  collection
});
export const updateCollection = (collection, actions) => ({
  type: CREATE_COLLECTION,
  collection,
  actions
});
