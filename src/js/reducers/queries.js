import { QUERY } from "../actions/queries";
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
