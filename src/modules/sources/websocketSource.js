import { QueueingSubject } from "queueing-subject";
import websocketConnect from "rxjs-websockets";
import { Source } from "./source";
import { map, retryWhen, share, delay } from "rxjs/operators";

const defaultFactory = (url, protocols) => new WebSocket(url, protocols);

/**
 *
 * @class {WebsocketSource}
 */
export class WebsocketSource extends Source {
  constructor(name, { url, factory = defaultFactory, retryInterval = 1000 }) {
    super(name);
    this._input = new QueueingSubject().pipe(
      map(message => JSON.stringify(message))
    );

    const { messages, connectionStatus } = websocketConnect(
      url,
      this._input,
      undefined,
      factory
    );

    this.messages = messages.pipe(
      map(message => JSON.parse(message)),
      retryWhen(errors => {
        console.log("Reconnecting...");
        return errors.pipe(delay(retryInterval));
      }),
      share()
    );
    this.connectionStatus = connectionStatus;
  }
  send(data) {
    this._input.next(data);
  }

  /**
   * @return {Observable} An Observable indicating whether this source is "available"
   */
  health() {
    return this.connectionStatus;
  }
  query() {
    return super.query();
  }
}
