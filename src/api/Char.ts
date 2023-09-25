import TreePosition from '../core/TreePosition';
import { Value } from './Value';

export default class Char implements Value {
  treePosition: TreePosition;

  constructor(treePosition: TreePosition) {
    this.treePosition = treePosition;
  }

  snapshot(): string {
    const atom = this.treePosition.getAtom();
    return atom.value.toString();
  }
}
