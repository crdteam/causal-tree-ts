import type { AtomValue } from '../../types';
import AtomId from '../../AtomId';
import Atom from '../../Atom';
import getAtomId from './AtomId';
import getAtomValue from './AtomValue';

type AtomIdInput = AtomId | {
  site?: number,
  index?: number,
  timestamp?: number,
};

type AtomValueInput = Partial<AtomValue>;

export default (
  id?: AtomIdInput,
  cause?: AtomIdInput,
  value?: AtomValueInput,
): Atom => {
  const atomId = id
    ? (id instanceof AtomId && id)
      || getAtomId(id.site, id.index, id.timestamp)
    : getAtomId();
  const atomCause = cause
    ? (cause instanceof AtomId && cause)
      || getAtomId(cause.site, cause.index, cause.timestamp)
    : getAtomId();
  const atomValue = value
    ? getAtomValue(value.content, value.priority, value.toString, value.validateChild)
    : getAtomValue();
  return new Atom(
    atomId,
    atomCause,
    atomValue,
  );
};
