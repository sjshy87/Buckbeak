class Worker {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }

  postMessage(msg) {
    this.onmessage(msg);
  }
}
class SharedWorker {
  constructor(stringUrl) {
    this.url = stringUrl;
    this.port = {
      start: function() {},
      postMessage: function() {}
    };
    this.onmessage = () => {};
  }

  postMessage(msg) {
    this.onmessage(msg);
  }
}
window.Worker = Worker;
