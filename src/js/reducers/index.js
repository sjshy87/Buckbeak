import {
  COLLAPSE_PANEL,
  EXPAND_PANEL,
  TOGGLE_PANEL
} from "../constants/action-types";
const initialState = {
  panels: {
    right: true,
    left: true,
    bottom: false
  },
  collections: [],
  adapters: []
};
const rootReducer = (state = initialState, action) => {
  console.log(state);
  switch (action.type) {
    case COLLAPSE_PANEL:
      return { ...state, panels: { ...state.panels, [action.panel]: false } };
    case EXPAND_PANEL:
      return { ...state, panels: { ...state.panels, [action.panel]: true } };
    case TOGGLE_PANEL:
      return {
        ...state,
        panels: { ...state.panels, [action.panel]: !state.panels[action.panel] }
      };
    default:
      return state;
  }
};
export default rootReducer;
