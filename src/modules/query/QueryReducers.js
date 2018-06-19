import { QUERY } from "./QueryActions";
const initialState = {
  adapters: []
};
export default function(state = initialState, action) {
  switch (action.type) {
    case QUERY:
      return state;
    default:
      return state;
  }
}
