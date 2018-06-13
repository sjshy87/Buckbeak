import {
  COLLAPSE_PANEL,
  EXPAND_PANEL,
  TOGGLE_PANEL
} from "../constants/action-types";
export const collapsePanel = panel => ({ type: COLLAPSE_PANEL, panel });
export const expandPanel = panel => ({ type: EXPAND_PANEL, panel });
export const togglePanel = panel => ({ type: TOGGLE_PANEL, panel });
