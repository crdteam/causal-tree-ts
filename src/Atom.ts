import AtomId from './AtomId';
import { AtomTag } from './constants';
import IndexMap from './IndexMap';
import type { Value } from './interfaces/Value';
import { priority } from './utils/functions';

/**
 * Atom represents an atomic operation within a replicated tree.
 * @property id - The identifier of the atom.
 * @property cause - The identifier of the preceding atom.
 * @property value - The data operation represented by the atom.
 */
export default class Atom {
  id: AtomId;

  cause: AtomId;

  value: Value;

  tag: AtomTag;

  constructor(id: AtomId, cause: AtomId, value: Value, tag: AtomTag = AtomTag.element) {
    this.id = id;
    this.cause = cause;
    this.value = value;
    this.tag = tag;
  }

  /**
   * Compare two atoms, ascending by priority. In case of a tie, compare by atom IDs.
   * @param a - The first atom.
   * @param b - The second atom.
   * @returns {number} The relative order between atoms.
   */
  static compare(a: Atom, b: Atom): number {
    const aPriority = priority(a.tag);
    const bPriority = priority(b.tag);
    if (aPriority === bPriority) return AtomId.compare(a.id, b.id);
    return aPriority - bPriority;
  }

  remapSite(map: IndexMap): Atom {
    return new Atom(
      this.id.remapSite(map),
      this.cause.remapSite(map),
      this.value,
      this.tag,
    );
  }

  toString(): string {
    return `Atom(${this.id.toString()} ${this.cause.toString()} ${this.value.toString()})`;
  }
}
