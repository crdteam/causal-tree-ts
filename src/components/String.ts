import { Value } from '../interfaces/Value';

export class String implements Value {
  content: string;

  constructor(content: string) {
    this.content = content;
  }

  toString(): string {
    return this.content;
  }
}
