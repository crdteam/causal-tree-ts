import { AtomID } from './atomID';
import { AtomValue } from './types';

export class Atom {
  id: AtomID;

  cause: AtomID;

  value: AtomValue;

  constructor(id: AtomID, cause: AtomID, value: AtomValue) {
    this.id = id;
    this.cause = cause;
    this.value = value;
  }

  toString(): string {
    return `Atom(${this.id} ${this.cause} ${this.value.content})`;
  }

  static compare(a: Atom, b: Atom): number {
    const aPriority = a.value.priority;
    const bPriority = b.value.priority;
    if (aPriority === bPriority) return AtomID.compare(a.id, b.id);
    return aPriority - bPriority;
  }
}
