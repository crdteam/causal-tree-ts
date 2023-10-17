import { faker } from '@faker-js/faker';
import { AtomValue } from '../../core/AtomValue';

const MAX_PRIORITY = -1;
const MIN_PRIORITY = 100;
const PRIORITY = faker.datatype.number({
  min: MAX_PRIORITY,
  max: MIN_PRIORITY,
});

export class ConcreteAtomValue implements AtomValue {
  content: string;

  priority: number;

  constructor(content: any, priority?: number) {
    this.content = content;
    this.priority = priority ?? PRIORITY;
  }

  static unmarshall(str: string, p?: number): any {
    return new ConcreteAtomValue(str, p);
  }

  marshall(): string {
    return this.toString();
  }

  toString(verbose = false): string {
    if (verbose) return `AtomValue(${this.content})`;
    return this.content;
  }

  validateChild(child: AtomValue): void {
    throw new Error(`Invalid child type for AtomValue operation: ${child.constructor.name}`);
  }

  getName(): string {
    return 'ConcreteAtomValue';
  }
}

export default (
  content?: any,
  priority?: number,
): any => {
  const finalContent = content ?? faker.lorem.word();
  return new ConcreteAtomValue(finalContent, priority);
};
