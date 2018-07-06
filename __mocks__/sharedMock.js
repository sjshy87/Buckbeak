export default class Worker {
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
