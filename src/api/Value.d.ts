import TreePosition from '../core/TreePosition';

/**
 * Value represents a structure that may be converted to concrete data.
 * @property treePosition - The position of the value in the tree.
 * @property snapshot - A function that returns a string representation of the
 * operation.
 */
export interface Value {
  treePosition: TreePosition;
  snapshot(): string;
}
