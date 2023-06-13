import { faker } from '@faker-js/faker';
import { Value } from '../../ui/Value';

export default (
  content?: any,
  toString?: () => string,
): Value => {
  const finalContent = content ?? faker.lorem.word();
  return {
    content: finalContent,
    toString: toString ?? (() => JSON.stringify(finalContent)),
  };
};
