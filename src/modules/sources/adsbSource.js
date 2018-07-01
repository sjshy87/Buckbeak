import { WebsocketSource } from "./websocketSource";
import _ from "lodash";
import moment from "moment";

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
   * @return {Observable} An Observable of results
   */
  query(def) {
    return {
      query: def,
      observable: this.messages.map(updates => {
        return updates.map(d => {
          const time = moment.unix(d.posTime);
          const position = [time, d.Long, d.Lat];
          const properties = _.reduce(
            d,
            (update, value, k) => {
              if (k === "PosTime") return update;
              const type = _.isNumber(value) ? "numeric" : "string";
              update[k] = { time, value, type };
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
    };
  }
}
