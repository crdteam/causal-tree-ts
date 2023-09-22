import { v1 as uuidv1 } from 'uuid';
import type Atom from '../core/Atom';
import InsertString from '../core/operations/string/InsertString';
import InsertCounter from '../core/operations/counter/InsertCounter';

/**
 * @returns A new unique identifier (uuid v1).
 */
export const getNewUuid = (): string => uuidv1();

/**
 * @param block - An weave cut.
 * @returns The size of the causal block, including its head.
 */
export const causalBlockLength = (block: Atom[]): number => {
  if (block.length === 0) return 0;
  const [head, ...tail] = block;
  const endIndex = tail.findIndex((atom) => atom.cause.timestamp < head.id.timestamp);
  return endIndex === -1 ? block.length : endIndex + 1;
};

/**
 * Invokes the closure callback with each atom of the causal block.
 * @param block - An weave cut.
 * @param callback - Function to invoke.
 * @returns The number of atoms visited.
 */
export const walkCausalBlock = (block: Atom[], callback: (atom: Atom) => boolean): number => {
  const endIndex = causalBlockLength(block);
  const causalBlock = block.slice(1, endIndex);
  return causalBlock.findIndex((atom) => !callback(atom));
};

/**
 * Invokes the closure callback with each direct children of the block's head.
 * @param block - An weave cut.
 * @param callback - Function to invoke.
 * @returns The number of atoms visited.
 */
export const walkChildren = (block: Atom[], callback: (atom: Atom) => boolean): number => {
  const [head] = block;
  return walkCausalBlock(block, (atom) => {
    if (atom.cause === head.id) return callback(atom);
    return true;
  });
};

/**
 * Checks if a given atom is a container.
 */
export const isContainer = (atom: Atom): boolean => (
  atom.value instanceof InsertString || atom.value instanceof InsertCounter
);
