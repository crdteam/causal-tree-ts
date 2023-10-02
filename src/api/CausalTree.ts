import AtomId from '../core/AtomId';
import CausalTreeCore from '../core/CausalTree';
import TreePosition from '../core/TreePosition';
import InsertString from '../core/operations/string/InsertString';
import { Register } from './Register';
import { Str } from './Str';
import { Value } from './Value';

/**
 * This is a wrapper over CausalTreeCore that provides a more convenient API,
 * and also hides implementation details.
 */
export default class CausalTree implements Register {
  private tree: CausalTreeCore;

  constructor(tree: CausalTreeCore = new CausalTreeCore()) {
    this.tree = tree;
  }

  setString(): Str {
    const id = this.tree.insertString();
    return this.stringValue(id);
  }

  toString(): any[] {
    return this.tree.toString();
  }

  // TODO: this should be reimplemented when having other data types besides
  // string.
  value(): Value | null {
    const atoms = this.tree.filterDeletedAtoms();
    if (atoms.length === 0) {
      return null;
    }

    return this.stringValue(atoms[0].id);
  }

  /**
   * Deletes the whole string, given a Str wrapper.
   */
  deleteString(str: Str): void {
    const atom = str.treePosition.getAtom();
    this.tree.deleteAtom(atom.id);
  }

  dumpWeave(): string[] {
    return this.tree.weave.map((atom) => atom.toString());
  }

  /**
   * Forks the current CausalTree, returning a new tree.
   */
  fork(): CausalTree {
    const fork = new CausalTree(this.tree.fork());
    return fork;
  }

  /**
   * @returns a Str wrapper over InsertString
   */
  private stringValue(id: AtomId): Str {
    const idx = this.tree.getAtomIndexAtWeave(id);
    const atom = this.tree.weave[idx];

    if (!(atom.value instanceof InsertString)) {
      throw new Error(`Atom ${atom.toString()} is not an InsertString`);
    }

    return new Str(
      new TreePosition(this.tree, id, idx),
    );
  }
}
