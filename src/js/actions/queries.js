/* Types */
export const QUERY = "QUERY";

/* Actions */
export const query = (adapter, def) => ({ type: QUERY, adapter, def });
