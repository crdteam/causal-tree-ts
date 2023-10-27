import { walkCausalBlockNoDelete } from '../utils/functions';
import Atom from './Atom';
import AtomId from './AtomId';
import CausalTree from './CausalTree';
import Delete from './operations/Delete';

/**
 * TreePosition stores an atom's position for a cursor.
 * The atom is always uniquely defined by its ID, but we also store its last
 * known position to speed up searching for it. Since trees are insert-only,
 * the atom can only be at this position or to its right.
 * @property tree - the reference causal tree
 * @property id - the Atom's Id (AtomId)
 * @property lastKnownPos - the last known position (index) of the atom
 */
export default class TreePosition {
  lastKnownPos: number;

  private tree: CausalTree;

  private id: AtomId;

  constructor(tree: CausalTree, id: AtomId, lastKnownPos: number) {
    this.tree = tree;
    this.id = id;
    this.lastKnownPos = lastKnownPos;
  }

  /**
   * Returns the atom's position in the weave.
   */
  getIndex(): number {
    for (let i = this.lastKnownPos; i < this.tree.weave.length; i += 1) {
      if (this.tree.weave[i].id === this.id) {
        this.lastKnownPos = i;
        return i;
      }
    }

    throw new Error(
      `Atom ${this.id.toString()} not found in weave after last known position ${this.lastKnownPos}. Weave size: ${this.tree.weave.length}`,
    );
  }

  /**
   * @returns the pointed atom.
   */
  getAtom(): Atom {
    return this.tree.weave[this.getIndex()];
  }

  /**
   * @returns the atom from the weave at the given index.
   */
  getAtomAtIndex(index: number): Atom {
    return this.tree.weave[index];
  }

  /**
   * @returns the reference causal tree.
   */
  getTree(): CausalTree {
    return this.tree;
  }

  /**
   * Checks if the pointed atom is deleted.
   */
  isDeleted(): boolean {
    const idx = this.getIndex();
    const { weave } = this.tree;

    if (idx === this.tree.weave.length - 1) return false;

    const atom = weave[idx + 1];
    return atom.value instanceof Delete;
  }

  /**
   * Walks through the atom's causal block, invoking the callback function for
   * each non-deleted atom.
   */
  walk(callback: (atom: Atom, pos: number, isDeleted: boolean) => boolean) {
    const pos = this.getIndex();
    walkCausalBlockNoDelete(
      this.tree.weave.slice(pos),
      pos,
      callback,
    );
  }
}
