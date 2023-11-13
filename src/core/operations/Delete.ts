import { OPERATION_PRIORITY_MAP } from '../../utils/constants';
import { AtomValue } from '../AtomValue';

export class Delete implements AtomValue {
  content: null;

  priority: number;

  constructor() {
    this.content = null;
    this.priority = OPERATION_PRIORITY_MAP.Delete;
  }

  static unmarshall(str: string): Delete {
    return new Delete();
  }

  marshall(): string {
    return '';
  }

  toString(verbose = false): string {
    if (verbose) return 'Delete';
    return '⌫';
  }

  validateChild(child: AtomValue): void {
    throw new Error(`Invalid child type for Delete operation: ${child.constructor.name}`);
  }
}
