import { Subject, Observer, Observable } from "rxjs";
import {
  WebSocketSubject,
  WebSocketSubjectConfig
} from "rxjs/observable/dom/WebSocketSubject";
import uuid from "uuid/v4";

class ADSBSource {
  constructor(name) {
    this.name = name;
    this.socket$ = new ADSBAdapter("https://localhost:3001/");
  }
  query(id, def) {
    const self = this;
    const id = uuid();
    return this.socket$
      .multiplex(
        () => ({
          type: "subscribe",
          id: id,
          query: def //TODO: Transform this into whatever server expects
        }),
        () => ({
          type: "unsubscribe",
          id: id
        }),
        //msg => msg.id === id
        msg => true //The above depends on output from server we don't do yet.
      )
      .takeUntil(
        action$
          .ofType("CANCEL_QUERY")
          .filter(closeAction => closeAction.id === id)
      )
      .map(events => self.adapt(events));
  }
  fetch(id) {
    //TODO: Get full-fidelity details of id
    console.log("Unsupported: Fetching points for", id);
  }
}
class ReconnectingWebSocketSubject extends Subject {
  constructor(
    url,
    reconnectInterval,
    reconnectAttempts,
    resultSelector,
    serializer
  ) {
    super();
    this.reconnectInterval = reconnectInterval; //Time (in ms) to wait for reconnect
    this.reconnectAttempts = reconnectAttempts; //Max number of times to reconnect.
    //If undefined, it will reconnect indefinitely
    this.connectionStatus = Observable(observer => {
      this.connectionObserver = observer;
    })
      .share()
      .distinctUntilChanged();

    if (!resultSelector) {
      this.resultSelector = e => {
        JSON.parse(e.data);
      };
    }
    if (!serializer) {
      this.serializer = d => {
        JSON.stringify(d);
      };
    }

    this.wsSubjectConfig = {
      url: url,
      closeObserver: {
        next: e => {
          this.socket = null;
          this.connectionObserver.next(false);
        }
      },
      openObserver: {
        next: e => {
          this.connectionObserver.next(true);
        }
      }
    };
    this.connect();
    this.connectionStatus.subscribe(isConnected => {
      if (
        !this.reconnectionObservable &&
        typeof isConnected == "boolean" &&
        !isConnected
      ) {
        this.reconnect();
      }
    });
  }
  connect() {
    this.socket = new WebSocketSubject(this.wsSubjectConfig);
    this.socket.subscribe(
      m => {
        this.next(m);
      },
      error => {
        if (!this.socket) {
          this.reconnect();
        }
      }
    );
  }
  reconnect() {
    this.reconnectionObservable = Observable.interval(this.reconnectInterval);
    if (this.reconnectAttempts) {
      this.reconnectionObservable = this.reconnectionobservable.takeWhile(
        (v, index) => {
          return index < this.reconnectAttempts && !this.socket;
        }
      );
    }
    this.reconnectionObservable.subscribe(
      () => {
        console.log("Attempting reconnect...");
        this.connect();
      },
      null,
      () => {
        this.disconnect();
      }
    );
  }
  disconnect() {
    console.log("Disconnecting");
    this.reconnectionObservable = null;
    if (!this.socket) {
      this.complete();
      this.connectionObserver.complete();
    }
  }
  send(data) {
    this.socket.next(this.serializer(data));
  }
  cancel() {
    this.complete();
  }
}

class ADSBAdapter extends ReconnectingWebSocketSubject {
  constructor(url, reconnectInterval) {
    super(url, reconnectInterval || 5000);
  }
  //produces arrays of packets that collections can use to update internal state
  adapt(events) {
    return events.map(pt => {
      const time = moment.unix(pt.PosTime);
      const unix = time.unix();
      const obj = {
        id: pt.Icao,
        time: time,
        position: { cartesian: [] },
        properties: {},
        data: pt
      };
      if (pt.Lat && pt.Long) {
        obj.position.cartesian.push(unix);
        obj.position.cartesian.push(pt.Lat);
        obj.position.cartesian.push(pt.Long);
        obj.position.cartesian.push(
          pt.Alt ||
            obj.position.cartesian[obj.position.cartesian.length - 1] ||
            0
        );
      }
      //Convert to CZML CustomProperties
      for (const [k, v] of Object.entries(pt)) {
        //First, we determine the property's type
        let type;
        if (v === true || v === false) {
          type = "boolean";
        } else if (Number.isFinite(v) && +v == v) {
          type = "number";
        } else if (
          v.startsWith &&
          (v.startsWith("http://") || v.endsWith("https://"))
        ) {
          type = "uri";
        } else {
          type = "string";
        }
        //Then we populate it in the properties bag
        const prop = obj.properties[k] || {};
        if (prop[type] === undefined) {
          prop[type] = [unix, v];
          //this.addColumn(k)
        } else {
          prop[type].push(unix);
          prop[type].push(v);
        }
      }
      return obj;
    });
  }
}

class Collection extends Subject {
  constructor(id, adapters) {
    this.id = id;
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
const query = ({ source, def }) => ({ type: "QUERY", source, def });
const merge = ({ collections }) => ({ type: "MERGE", collections });
const cancel = ({ id }) => ({ type: "CLOSE_COLLECTION", id });
const cancel = ({ id }) => ({ type: "CANCEL_QUERY", id });

const collections = (state = {}, action) => {
  switch (action.type) {
    case "QUERY":
      const id = uuid();
      const source = action.source;
      state.queries[source.id] = source;
      state.collections[id] = source.query({ id, def: action.def });
    case "MERGE":
      const id = uuid();
      const adapters = action.collections.reduce(
        (adapters, c) => adapters.concat(c.adapters),
        []
      );
      state.collections[id] = new Collection(id, adapters);
    case "UPDATE_COLLECTION_DATA":
      const id = action.id;
      state.collections[id] = action.data;
    case "CANCEL_QUERY":
      const id = action.id;
      state.adapters[id].cancel();
      delete state.adapters[id];
    case "CLOSE_COLLECTIONS":
      const id = action.id;
      state.collections[id].close();
      delete state.collections[id];
  }
  return state;
};
