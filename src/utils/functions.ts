import { v1 as uuidv1 } from 'uuid';
import type Atom from '../Atom';

export const getNewUuid = (): string => uuidv1();

export const causalBlockLenght = (block: Atom[]): number => {
  if (block.length === 0) return 0;
  const [head, ...tail] = block;
  const endIndex = tail.findIndex((atom) => atom.cause.timestamp < head.id.timestamp);
  return endIndex === -1 ? block.length : endIndex + 1;
};

export const walkCausalBlock = (block: Atom[], callback: (atom: Atom) => boolean): number => {
  const endIndex = causalBlockLenght(block);
  const causalBlock = block.slice(0, endIndex);
  return causalBlock.findIndex((atom) => !callback(atom));
};

export const walkChildren = (block: Atom[], callback: (atom: Atom) => boolean): number => {
  const [head] = block;
  return walkCausalBlock(block, (atom) => {
    if (atom.cause === head.id) return callback(atom);
    return true;
  });
};
