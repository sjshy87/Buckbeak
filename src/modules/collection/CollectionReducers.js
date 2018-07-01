import _ from "lodash";
import {
  CREATE_COLLECTION,
  DELETE_COLLECTION,
  UPDATE_COLLECTION
} from "./CollectionActions";

const initialState = {};

function insertPropertyAtTime(array, p) {
  //If the array is non-empty, try to return a new array with p inserted in the correct location
  if (array.length > 0) {
    //Iterate backwards through the array. When you find a time
    //older than the property being inserted, insert there
    for (let i = array.length - 1; i >= 0; i--) {
      let property = array[i];
      //We found point *before* insertion.
      if (property.time <= p.time) {
        //If the values are the same, no change. Return the current array
        if (property.time === p.time && property.value === p.value)
          return array;
        //Otherwise, copy the array, then insert after the current property
        const newValues = array.slice();
        newValues.splice(i + 1, 0, p);
        return newValues;
      }
    }
  }
  //If we get here, the new value is before all other values.
  return [p, ...array];
}

export default function(state = initialState, action) {
  const id = action.id;
  let collection;
  switch (action.type) {
    case CREATE_COLLECTION:
      collection = state[id];
      if (collection) {
        console.log("Cannot create collection (already exists)", id);
        return state;
      } else {
        collection = {
          id,
          name: action.name,
          queries: action.queries,
          data: {}
        };
        return { ...state, [id]: collection };
      }
    case DELETE_COLLECTION:
      const { [id]: deleted, ...newState } = state;
      if (deleted) return newState;
      else {
        console.log("Cannot delete collection (does not exist)", id);
        return state;
      }
    case UPDATE_COLLECTION:
      collection = state[id];
      if (collection) {
        //Copy the collection
        collection = { ...collection };
        action.data.forEach(update => {
          //Copy any entity that is updated, and update it
          let entity = collection[update.id]
            ? { ...collection[update.id] }
            : {
                id: update.id,
                label: update.label,
                start: update.time,
                position: [],
                properties: {}
              };
          entity.end = update.time;

          if (update.position) {
            entity.position = insertPropertyAtTime(
              entity.position,
              update.position
            );
          }
          if (update.properties) {
            entity.properties = _.reduce(
              update.properties,
              (properties, v, k) => {
                properties[k] = insertPropertyAtTime(properties[k] || [], v);
                return properties;
              },
              { ...entity.properties }
            );
          }
          collection[entity.id] = entity;
        });
        return { ...state, [id]: collection };
      } else {
        console.log("Cannot update collection (does not exist)", id);
        return state;
      }
    default:
  }
  return state;
}
