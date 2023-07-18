import { OPERATION_PRIORITY_MAP } from '../../utils/constants';
import { AtomValue } from '../AtomValue';

export default class Delete implements AtomValue {
  content: null;

  priority: number;

  constructor() {
    this.content = null;
    this.priority = OPERATION_PRIORITY_MAP.Delete;
  }

  toString(): string {
    return 'Delete';
  }

  validateChild(child: AtomValue): void {
    throw new Error(`Invalid child type for Delete operation: ${child.constructor.name}`);
  }
}
