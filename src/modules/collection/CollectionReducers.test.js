import reducer from "./CollectionReducers";
import * as actions from "./CollectionActions";

describe("collection reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual({});
  });
  it("should handle CREATE_COLLECTION", () => {
    expect(
      reducer([], actions.createCollection("cid", "name", ["qid"]))
    ).toEqual({ cid: { id: "cid", data: {}, name: "name", queries: ["qid"] } });
  });
});
