/**
 * AtomValue is a tree operation.
 * @property content - The content itself of the operation.
 * @property priority - The priority of the operation,
 * where this atom should be placed compared with its siblings
 * (lower priority means higher in the tree).
 * @property toString - A function that returns a string representation of the
 * operation.
 * @property validateChild - A function that checks whether the given value can
 * be appended as a child.
 * @property marshall - A function that returns a JSON representation of the
 * operation.
 * @property unmarshall - A function that returns an AtomValue from a JSON
 * representation.
 */
export interface AtomValue {
  content: any;
  priority: number;
  toString(verbose?: boolean): string;
  validateChild(child: AtomValue): void;
  marshall(): string;
}
