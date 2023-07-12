import { OPERATION_PRIORITY_MAP } from '../../../utils/constants';
import { AtomValue } from '../../AtomValue';

export default class InsertString implements AtomValue {
  content: null;

  priority: number;

  constructor() {
    this.content = null;
    this.priority = OPERATION_PRIORITY_MAP.InsertString;
  }

  toString(): string {
    return 'InsertString';
  }

  validateChild(): void {
    throw new Error('InsertString cannot have children.');
  }
}
