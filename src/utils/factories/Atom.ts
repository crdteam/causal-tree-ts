import AtomId from '../../core/AtomId';
import Atom from '../../core/Atom';
import getAtomId from './AtomId';
import getAtomValue from './AtomValue';
import { AtomValue } from '../../core/AtomValue';

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
    ? getAtomValue(value.content, value.priority)
    : getAtomValue();
  return new Atom(
    atomId,
    atomCause,
    atomValue,
  );
};
