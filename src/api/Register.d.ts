import type { Str } from './Str';
import type { Counter } from './Counter';
import type { List } from './List';
import type { Value } from './Value';

/**
 * Register contains a single value or none at all.
 */
export interface Register {
  value(): Value | null; // Returns the value of the register.
  setString(): Str; // Sets the register to an empty string.
  setCounter?(): Counter; // Sets the register to a zeroed counter.
  setList?(): List; // Sets the register to an empty list.
  clear?(): void; // Resets the register to an empty state.
}
