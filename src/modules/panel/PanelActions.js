/* Types */
export const COLLAPSE_PANEL = "COLLAPSE_PANEL,";
export const EXPAND_PANEL = "EXPAND_PANEL";
export const TOGGLE_PANEL = "TOGGLE_PANEL";
export const REMOVE_OVERLAY = "REMOVE_OVERLAY";

/* Actions */
export const collapsePanel = panel => ({ type: COLLAPSE_PANEL, panel });
export const expandPanel = panel => ({ type: EXPAND_PANEL, panel });
export const togglePanel = panel => ({ type: TOGGLE_PANEL, panel });
