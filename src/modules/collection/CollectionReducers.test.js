import reducer from "./CollectionReducers";
import * as actions from "./CollectionActions";

describe("collection reducer", () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual({ collections: {} });
  });
  it("should handle CREATE_COLLECTION", () => {
    expect(
      reducer(undefined, actions.createCollection("cid", "name", ["qid"]))
    ).toEqual({
      collections: {
        cid: { id: "cid", data: [], name: "name", queries: ["qid"] }
      }
    });
  });
});
