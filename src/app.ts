import { value1, value2 } from "./constants";

export function doStuff() {
  return value1 + value2;
}

console.log('This is a node-ts app!');
console.log(`here's some env var: ${process.env.SOME_VAR}`);
