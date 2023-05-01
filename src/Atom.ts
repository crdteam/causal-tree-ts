import AtomID from './AtomID';
import type { AtomValue } from './types';

export default class Atom {
  id: AtomID;

  cause: AtomID;

  value: AtomValue;

  constructor(id: AtomID, cause: AtomID, value: AtomValue) {
    this.id = id;
    this.cause = cause;
    this.value = value;
  }

  static compare(a: Atom, b: Atom): number {
    const aPriority = a.value.priority;
    const bPriority = b.value.priority;
    if (aPriority === bPriority) return AtomID.compare(a.id, b.id);
    return aPriority - bPriority;
  }

  toString(): string {
    return `Atom(${this.id.toString()} ${this.cause.toString()} ${this.value.content})`;
  }
}
