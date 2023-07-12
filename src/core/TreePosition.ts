import AtomId from './AtomId';
import { CausalTree } from './CausalTree';

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
  private tree: CausalTree;

  private id: AtomId;

  private lastKnownPos: number;

  constructor(tree: CausalTree, id: AtomId, lastKnownPos: number) {
    this.tree = tree;
    this.id = id;
    this.lastKnownPos = lastKnownPos;
  }

  /**
   * Returns the atom's position in the weave.
   */
  getIndex(): number {
    // TODO: check if Array.slice(lastKnownPos) is faster
    return this.tree.weave.findIndex(
      (atom, index) => index > this.lastKnownPos && atom.id === this.id,
    );
  }
}
