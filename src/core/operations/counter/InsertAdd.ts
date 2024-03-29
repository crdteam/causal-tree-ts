import { OPERATION_PRIORITY_MAP } from '../../../utils/constants';
import { AtomValue } from '../../AtomValue';

export default class InsertAdd implements AtomValue {
  content: number;

  priority: number;

  constructor(value: number) {
    if (Number.isNaN(value) || !Number.isInteger(value)) {
      throw new Error('InsertAdd content must be an integer');
    }

    this.content = value;
    this.priority = OPERATION_PRIORITY_MAP.InsertAdd;
  }

  toString(verbose = false): string {
    if (verbose) return `InsertAdd(${this.content})`;
    return `${this.content > 0 ? '+' : ''}${this.content}`;
  }

  validateChild(child: AtomValue): void {
    if (child instanceof InsertAdd) {
      return;
    }

    throw new Error(`Invalid child type for InsertAdd operation: ${child.constructor.name}`);
  }
}
