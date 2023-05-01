export default class AtomID {
  site: number;

  index: number;

  timestamp: number;

  constructor(site: number, index: number, timestamp: number) {
    this.site = site;
    this.index = index;
    this.timestamp = timestamp;
  }

  static compare(a: AtomID, b: AtomID): number {
    if (a.timestamp === b.timestamp) return b.site - a.site;
    return a.timestamp - b.timestamp;
  }

  toString(): string {
    return `S${this.site}@T${this.timestamp}`;
  }
}