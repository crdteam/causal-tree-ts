import AtomId from '../core/AtomId';
import CausalTree from '../core/CausalTree';
import TreePosition from '../core/TreePosition';
import InsertString from '../core/operations/string/InsertString';
import { Str } from './Str';

export default class ICausalTree extends CausalTree {
  /**
   * @returns a Str wrapper over InsertString
   */
  stringValue(id: AtomId): Str {
    const idx = this.getAtomIndexAtWeave(id);
    const atom = this.weave[idx];

    if (!(atom.value instanceof InsertString)) {
      throw new Error(`Atom ${atom.toString()} is not an InsertString`);
    }

    return new Str(
      new TreePosition(this, id, idx),
    );
  }

  setString(): Str {
    const id = this.insertString();
    return this.stringValue(id);
  }
}
