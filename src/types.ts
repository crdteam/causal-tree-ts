export interface AtomValue {
  content: string;
  priority: number;
  validateChild(child: AtomValue): void;
}
