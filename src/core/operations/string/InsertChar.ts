import { OPERATION_PRIORITY_MAP } from '../../../utils/constants';
import { AtomValue } from '../../AtomValue';
import Delete from '../Delete';

export default class InsertChar implements AtomValue {
  content: string;

  priority: number;

  constructor(char: string) {
    if (char.length !== 1) throw new Error('InsertChar content must be a single character');
    this.content = char;
    this.priority = OPERATION_PRIORITY_MAP.InsertChar;
  }

  toString(): string {
    return `InsertChar(${this.content})`;
  }

  contentToString(): string {
    return this.content;
  }

  validateChild(child: AtomValue): void {
    if (child instanceof InsertChar || child instanceof Delete) {
      return;
    }

    throw new Error(`Invalid child type for InsertChar operation: ${child.constructor.name}`);
  }
}
