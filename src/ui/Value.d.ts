/**
 * Value is a tree operation.
 * @property content - The content itself of the operation.
 * @property toString - A function that returns a string representation of the
 * operation.
 */
export interface Value {
  content: any;
  toString(): string;
}
