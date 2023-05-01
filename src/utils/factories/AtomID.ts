import { faker } from '@faker-js/faker';
import AtomID from '../../AtomID';

const MAX_SITE = 1000;

export default (
  site?: number,
  index?: number,
  timestamp?: number,
): AtomID => {
  const atomSite = site ?? faker.datatype.number(MAX_SITE);
  const atomIndex = index ?? faker.datatype.number();
  const atomTimestamp = timestamp ?? faker.datatype.number();
  return new AtomID(atomSite, atomIndex, atomTimestamp);
};
