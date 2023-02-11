import { doStuff } from "../app";

describe('app', () => {
  describe('doStuff', () => {
    it('should return correct value', () => {
      const result = doStuff();

      expect(result).toEqual(100);
    });
  });
});