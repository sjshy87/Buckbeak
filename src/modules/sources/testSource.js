import { Source } from "./source";
import { map, interval } from "rxjs/operators";
import { Observable } from "rxjs";
import _ from "lodash";

/**
 * Connects to a websocket providing JSON data from ADSBExchange
 * @class {TestSource}
 */
export class TestSource extends Source {
  /**
   * Constructor for ADSBSource. It takes the same parameters as WebsocketSource
   */
  constructor(def = {}) {
    super("Test");
  }

  /**
   * An RXJS Observable
   * typedef {Object} Observable
   */

  /**
   * @typedef {Object} Query
   * @property {Object} query The definition of the query
   * @property {Observable} observable An observable of the query results
   */

  /**
   * @param {Object} [def] A query definition.
   * @return {Query}  A query object
   */
  query() {
    return Observable.interval(1000).map(v => {
      const data = [];
      for (let i = 0; i < 1000; i++) {
        let time = Date.now();
        let lat = [time, Math.random() * 180 - 90];
        let lng = [time, Math.random() * 360 - 180];
        let alt = [time, Math.random() * 50000];
        let position = [time, [lng.value, lat.value]];
        let properties = {};
        data[i] = {
          id: i,
          label: i,
          time,
          position,
          properties: { lat, lng, alt }
        };
      }
      return data;
    });
  }
}
