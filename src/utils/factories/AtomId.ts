import { faker } from '@faker-js/faker';
import AtomId from '../../core/AtomId';

const MAX_SITE = 1000;

export default (
  site?: number,
  index?: number,
  timestamp?: number,
): AtomId => {
  const atomSite = site ?? faker.datatype.number(MAX_SITE);
  const atomIndex = index ?? faker.datatype.number();
  const atomTimestamp = timestamp ?? faker.datatype.number();
  return new AtomId(atomSite, atomIndex, atomTimestamp);
};
