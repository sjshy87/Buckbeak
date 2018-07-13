import _ from "lodash";
import {
  CREATE_COLLECTION,
  DELETE_COLLECTION,
  UPDATE_COLLECTION,
  AGEOFF_COLLECTION,
  DELETE_FROM_COLLECTION
} from "./CollectionActions";

const initialState = { collections: {} };

function insertProperty(array, p) {
  //If the array is non-empty, try to return a new array with p inserted in the correct location
  if (array.length > 0) {
    //Iterate backwards through the array. When you find a time
    //older than the property being inserted, insert there
    for (let i = array.length - 1; i >= 0; i--) {
      let property = array[i];
      //We found point *before* insertion.
      if (property.time <= p.time) {
        //If the values are the same, no change. Return the current array
        if (property.value === p.value) return array;
        //Otherwise, copy the array, then insert after the current property
        array.splice(i + 1, 0, p);
        return array;
      }
    }
  }
  //If we get here, the new value is before all other values.
  if (array.length === 0 || p.value !== array[0].value) array.push(p);
  return array;
}
function applyUpdates(entity, updates) {
  let updatedProperties = {};
  let position;
  return updates.reduce((entity, update) => {
    entity.start = update.time < entity.start ? update.time : entity.start;
    entity.end = update.time > entity.end ? update.time : entity.end;
    if (update.position) {
      position = position || [...entity.position];
      entity.position = insertProperty(position, update.position);
    }
    if (update.properties) {
      updatedProperties = _.reduce(
        update.properties,
        (updatedProperties, v, k) => {
          let values = updatedProperties[k]
            ? updatedProperties[k]
            : entity.properties[k]
              ? [...entity.properties[k]]
              : [];
          updatedProperties[k] = insertProperty(values, update.properties[k]);
          return updatedProperties;
        },
        updatedProperties
      );
    }
    entity.properties = { ...entity.properties, ...updatedProperties };

    return entity;
  }, entity);
}

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
          data: {}
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
        let data = _.reduce(
          action.data,
          (data, updates, id) => {
            let entity = data[id]
              ? { ...data[id] }
              : {
                  id: id,
                  start: updates[0].time,
                  end: updates[0].time,
                  position: [],
                  properties: {}
                };
            data[id] = applyUpdates(entity, updates);
            return data;
          },
          { ...collection.data }
        );
        collection = { ...collection, data };
        return {
          ...state,
          collections: { ...state.collections, [id]: collection }
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
