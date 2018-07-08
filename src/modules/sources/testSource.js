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
   * Constructor for Test source.
   */
  constructor(def = {}) {
    super("Test");
  }

  /**
   * Take the query definition, completely ignore it, and return a stream of random
   * locations for 1000 entities every second.
   * @param {Object} def An object representing the query to execute
   * @return {Object} An RXJS Observable stream of *batches* of results.
   */
  query(def) {
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
