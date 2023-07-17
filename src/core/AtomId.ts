import IndexMap from './IndexMap';

/**
 * AtomId is the unique identifier of an atom.
 * @property site - The site index in the sitemap of the site that created an
 * atom.
 * @property index - The index of the atom within the site (site's yarn).
 * @property timestamp - The site's Lamport timestamp when the atom was created.
 */
export default class AtomId {
  site: number;

  index: number;

  timestamp: number;

  constructor(site: number, index: number, timestamp: number) {
    this.site = site;
    this.index = index;
    this.timestamp = timestamp;
  }

  /**
   * Compare two atom IDs, ascending by timestamp and descending by site index.
   * @param a - The first atom ID.
   * @param b - The second atom ID.
   * @returns {number} The relative order between atom IDs.
   */
  static compare(a: AtomId, b: AtomId): number {
    if (a.timestamp === b.timestamp) return b.site - a.site;
    return a.timestamp - b.timestamp;
  }

  remapSite(map: IndexMap): AtomId {
    return new AtomId(map.get(this.site), this.index, this.timestamp);
  }

  // TODO: unused
  remapSiteInplace(map: IndexMap): void {
    this.site = map.get(this.site);
  }

  toString(): string {
    return `S${this.site}@T${this.timestamp}`;
  }
}
