import { COLLAPSE_PANEL, EXPAND_PANEL, TOGGLE_PANEL } from "../actions/panels";
const initialState = {
  right: true,
  left: true,
  bottom: false
};
export default function panel(state = initialState, action) {
  console.log("STATE", state);
  switch (action.type) {
    case COLLAPSE_PANEL:
      return { ...state, [action.panel]: false };
    case EXPAND_PANEL:
      return { ...state, [action.panel]: true };
    case TOGGLE_PANEL:
      return { ...state, [action.panel]: !state[action.panel] };
    default:
      return state;
  }
}
