export interface AtomValue {
  content: any;
  priority: number;
  toString(): string;
  validateChild(child: AtomValue): void;
}
