/**
 *
 * @class {WebsocketSource}
 */
export class Source {
  constructor(name) {
    this.name = name;
  }
  query() {
    throw Error("You must implement a 'query' method");
  }
  health() {
    throw Error("You must implement a 'health' method");
  }
}
