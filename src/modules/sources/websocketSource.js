import { QueueingSubject } from "queueing-subject";
import websocketConnect from "rxjs-websockets";
import { Source } from "./source";

const defaultFactory = (url, protocols) => new WebSocket(url, protocols);

/**
 *
 * @class {WebsocketSource}
 */
export class WebsocketSource extends Source {
  constructor(name, { url, factory = defaultFactory, retryInterval = 1000 }) {
    super(name);
    this._input = new QueueingSubject().map(message => JSON.stringify(message));

    const { messages, connectionStatus } = websocketConnect(
      url,
      this._input,
      undefined,
      factory
    );

    this.messages = messages
      .retryWhen(errors => errors.delay(retryInterval))
      .map(message => JSON.parse(message))
      .share();
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
