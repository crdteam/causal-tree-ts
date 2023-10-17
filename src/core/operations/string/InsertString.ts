import { OPERATION_PRIORITY_MAP } from '../../../utils/constants';
import { AtomValue } from '../../AtomValue';
import { Delete } from '../Delete';
import { InsertChar } from './InsertChar';

export class InsertString implements AtomValue {
  content: null;

  priority: number;

  constructor() {
    this.content = null;
    this.priority = OPERATION_PRIORITY_MAP.InsertString;
  }

  static unmarshall(str: string): InsertString {
    return new InsertString();
  }

  marshall(): string {
    return '';
  }

  toString(verbose = false): string {
    if (verbose) return 'InsertString';
    return 'STR:';
  }

  validateChild(child: AtomValue): void {
    if (child instanceof InsertChar || child instanceof Delete) {
      return;
    }

    throw new Error(`Invalid child type for InsertString operation: ${child.constructor.name}`);
  }

  getName(): string {
    return 'InsertString';
  }
}
