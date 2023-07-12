/**
 * Container represents a collection of elements.
 * @property len - Returns the number of elements.
 * @property cursor - Returns a type-appropriate cursor for the container.
 */
export interface Container {
  len(): number;
  cursor(): Cursor;
}
