import { Str } from './Str';
import { Counter } from './Counter';
import { List } from './List';

/**
 * Register contains a single value or none at all.
 */
export interface Register {
  value(): Value; // Returns the value of the register.
  setString(): Str; // Sets the register to an empty string.
  setCounter(): Counter; // Sets the register to a zeroed counter.
  setList(): List; // Sets the register to an empty list.
  clear(): void; // Resets the register to an empty state.
}
