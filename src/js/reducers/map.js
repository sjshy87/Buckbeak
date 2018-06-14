import {
  ADD_BASELAYER,
  ADD_OVERLAY,
  REMOVE_BASELAYER,
  REMOVE_OVERLAY
} from "../actions/map";

const initialState = {
  baseLayers: [],
  overlays: []
};
export default function map(state = initialState, action) {
  /* TODO: Implement above actions */
  switch (action.type) {
    case ADD_BASELAYER:
      return state;
    case ADD_OVERLAY:
      return state;
    case REMOVE_BASELAYER:
      return state;
    case REMOVE_OVERLAY:
      return state;
    default:
      return state;
  }
}
