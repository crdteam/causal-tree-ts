import IndexMap from './IndexMap';

export default class AtomId {
  site: number;

  index: number;

  timestamp: number;

  constructor(site: number, index: number, timestamp: number) {
    this.site = site;
    this.index = index;
    this.timestamp = timestamp;
  }

  static compare(a: AtomId, b: AtomId): number {
    if (a.timestamp === b.timestamp) return b.site - a.site;
    return a.timestamp - b.timestamp;
  }

  static remapSite(id: AtomId, map: IndexMap): AtomId {
    return new AtomId(map.get(id.site), id.index, id.timestamp);
  }

  toString(): string {
    return `S${this.site}@T${this.timestamp}`;
  }
}
