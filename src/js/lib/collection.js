import { Subject } from "rxjs";
import uuid from "uuid/v4";

class Adapter extends Subject {
  constructor(observable) {
    super();
    this.id = uuid();
  }
  adapt() {
    throw new Error("You must implement the adapt method");
  }
}
class FakeAdapter extends Adapter {
  constructor(def) {
    super(def);
  }
  init(def) {}
}
export class Collection extends Subject {
  constructor(name, adapters) {
    this.id = uuid();
    this.name = name;
    this.data = {};
    this.adapters = adapters || [];
    for (adapter of this.adapters) {
      adapter.subscribe().scan((data, packets) => {
        this.handlePackets(packets);
        return this.data;
      }, this.data);
    }
  }
  handlePackets(packets) {
    console.log("Collection got", packets);
    this.next(this.data);
  }
  close() {
    this.complete();
  }
}
