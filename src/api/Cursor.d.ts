/**
 * Cursor represents a pointer to a container's element, or the container's head.
 * @property index - Moves the cursor to the i-th element (container's head=-1).
 * It panics if i is out of bounds.
 * @property delete - Deletes the element at the cursor. The cursor is moved to the
 * previous element, or the container's head.
 * It panics if the cursor is pointing to the container's head.
 * @property insert - Inserts a new element after the cursor. The cursor is moved to
 * the new element.
 * @property element - Returns the element at the cursor.
 */
export interface Cursor {
  index(_: number): void;
  delete(): void;
  insert(_: any): any;
  element();
}
