import TreePosition from '../core/TreePosition';
import { Value } from './Value';

export class String implements Value {
  treePosition: TreePosition;

  constructor(treePosition: TreePosition) {
    this.treePosition = treePosition;
  }

  snapshot(): string {
    const idx = this.treePosition.getIndex();
    return `String(${idx})`;
  }
}
