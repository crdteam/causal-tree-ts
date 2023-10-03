import { OPERATION_PRIORITY_MAP } from '../../../utils/constants';
import { AtomValue } from '../../AtomValue';
import { Delete } from '../Delete';
import { InsertAdd } from './InsertAdd';

export class InsertCounter implements AtomValue {
  content: null;

  priority: number;

  constructor() {
    this.content = null;
    this.priority = OPERATION_PRIORITY_MAP.InsertCounter;
  }

  static unmarshall(str: string): InsertCounter {
    return new InsertCounter();
  }

  marshall(): string {
    return '';
  }

  toString(verbose = false): string {
    if (verbose) return 'InsertCounter';
    return 'CTR:';
  }

  validateChild(child: AtomValue): void {
    if (child instanceof InsertAdd || child instanceof Delete) {
      return;
    }

    throw new Error(`Invalid child type for InsertCounter operation: ${child.constructor.name}`);
  }
}
