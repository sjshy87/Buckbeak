import { WebsocketSource } from "./websocketSource";
import { map, interval } from "rxjs/operators";
import { Observable } from "rxjs";
import _ from "lodash";

/**
 * Connects to a websocket providing JSON data from ADSBExchange
 * @class {ADSBSource}
 */
export class ADSBSource extends WebsocketSource {
  /**
   * Constructor for ADSBSource. It takes the same parameters as WebsocketSource
   */
  constructor(def = {}) {
    super("ADSB", { url: "wss://localhost:3001", ...def });
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
    return this.messages.pipe(
      map(updates => {
        return updates.map(d => {
          const time = d.PosTime * 1000;
          const position = { time, value: [d.Long, d.Lat] };
          const properties = _.reduce(
            d,
            (update, value, k) => {
              if (k === "PosTime") return update;
              //const type = _.isNumber(value) ? "numeric" : "string";
              //update[k] = { time, value, type };
              update[k] = { time, value };
              return update;
            },
            {}
          );

          return {
            id: d.Icao,
            label: d.Icao,
            time,
            position,
            properties
          };
        });
      })
    );
  }
}
