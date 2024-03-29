import TreePosition from '../core/TreePosition';

/**
 * Value represents a structure that may be converted to concrete data.
 * @property treePosition - The position of the value in the tree.
 * @property snapshot - A function that returns a representation of the
 * pointed operation.
 */
export interface Value {
  treePosition: TreePosition;
  snapshot(): any;
}
