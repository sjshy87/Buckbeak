/* Types */
export const ADD_BASELAYER = "ADD_BASELAYER";
export const ADD_OVERLAY = "ADD_OVERLAY";
export const REMOVE_BASELAYER = "REMOVE_BASELAYER";
export const REMOVE_OVERLAY = "REMOVE_OVERLAY";

/* Actions */
export const addBaselayer = layer => ({ type: ADD_BASELAYER, layer });
export const addOverlayer = layer => ({ type: ADD_OVERLAY, layer });
export const removeBaselayer = layer => ({ type: REMOVE_BASELAYER, layer });
export const removeOverlay = layer => ({ type: REMOVE_OVERLAY, layer });
