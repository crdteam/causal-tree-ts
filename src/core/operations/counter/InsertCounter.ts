import { OPERATION_PRIORITY_MAP } from '../../../utils/constants';
import { AtomValue } from '../../AtomValue';
import Delete from '../Delete';

export default class InsertCounter implements AtomValue {
  content: null;

  priority: number;

  constructor() {
    this.content = null;
    this.priority = OPERATION_PRIORITY_MAP.InsertCounter;
  }

  toString(verbose = false): string {
    if (verbose) return 'InsertCounter';
    return 'CTR:';
  }

  validateChild(child: AtomValue): void {
    if (child instanceof InsertCounter || child instanceof Delete) {
      return;
    }

    throw new Error(`Invalid child type for InsertCounter operation: ${child.constructor.name}`);
  }
}
