//TODO: More work to behave more array-like
export default class TimeSeries {
  constructor(data) {
    this.data = data || [];
    this.length = this.data.length;
  }
  findIndex(fn) {
    //Search backwards through the data. This is because,
    //in the most common cases, the item is close to the end
    for (let i = this.data.length - 1; i >= 0; i--) {
      if (fn(this.data[i], i)) return i;
    }
    return -1;
  }
  insert(item) {
    const index = this.findIndex(({ time }) => time <= item.time);
    if (index === this.data.length - 1) {
      this.data.push(item);
    } else if (index > 0) {
      this.data.splice(index, 0, item);
    } else {
      this.data.unshift(item);
    }
    return new TimeSeries(this.data);
  }
  slice(first, last) {
    return new TimeSeries(this.data.slice(first, last));
  }
  splice(start, deleteCount) {
    return new TimeSeries(this.data.splice(start, deleteCount));
  }
  map(fn) {
    return this.data.map(fn);
  }
  reduce(fn, initial) {
    return this.data.reduce(fn, initial);
  }
  *[Symbol.iterator]() {
    for (const x of this.data) {
      yield x.value, x.time;
    }
  }
}
