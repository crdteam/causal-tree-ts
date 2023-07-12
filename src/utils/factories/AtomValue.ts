import { faker } from '@faker-js/faker';
import { AtomValue } from '../../core/AtomValue';

const MAX_PRIORITY = -1;
const MIN_PRIORITY = 100;

export default (
  content?: any,
  priority?: number,
  toString?: () => string,
  validateChild?: (child: AtomValue) => void,
): AtomValue => {
  const finalContent = content ?? faker.lorem.word();
  return {
    content: finalContent,
    priority: priority ?? faker.datatype.number({
      min: MAX_PRIORITY,
      max: MIN_PRIORITY,
    }),
    toString: toString ?? (() => JSON.stringify(finalContent)),
    validateChild: validateChild ?? (() => true),
  };
};
