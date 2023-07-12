import TreePosition from '../core/TreePosition';
import { Value } from './Value';

export class String implements Value {
  treePosition: TreePosition;

  constructor(treePosition: TreePosition) {
    this.treePosition = treePosition;
  }

  isValue(): boolean {
    return false;
  }

  snapshot(): string {
    const idx = this.treePosition.getIndex();
    return `String(${idx})`;
  }
}
