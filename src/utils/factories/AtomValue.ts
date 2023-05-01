import { faker } from '@faker-js/faker';
import { AtomValue } from '../../types';

const MAX_PRIORITY = -1;
const MIN_PRIORITY = 100;

export default (
  content?: string,
  priority?: number,
  validateChild?: (child: AtomValue) => void,
): AtomValue => ({
  content: content ?? faker.lorem.word(),
  priority: priority ?? faker.datatype.number({
    min: MAX_PRIORITY,
    max: MIN_PRIORITY,
  }),
  validateChild: validateChild ?? (() => true),
});
