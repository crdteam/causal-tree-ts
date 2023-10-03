/**
 * Map storing conversion between original and new index.
 * An empty map means that the index is unchanged.
 */
export default class IndexMap {
  private map: { [index: number]: number; };

  constructor() {
    this.map = {};
  }

  get(index: number): number {
    return this.map[index] ?? index;
  }

  set(index: number, value: number): void {
    if (index !== value) this.map[index] = value;
  }

  /**
   * @returns the number of entries in the map.
   */
  length(): number {
    return Object.keys(this.map).length;
  }
}
