import { Atom } from '../atom';
import { AtomID } from '../atomID';

describe('Atom', () => {
  describe('toString', () => {
    it('should print according to defined format', () => {
      const newId = new AtomID(0, 1, 2);
      const causeId = new AtomID(0, 0, 1);
      const value = {
        content: 'test',
        priority: 10,
        validateChild: () => true,
      };
      const atom = new Atom(
        newId,
        causeId,
        value,
      );
      expect(atom.toString()).toEqual('Atom(S0@T2 S0@T1 test)');
    });
  });
  describe('compare', () => {
    it('should compare correctly: ascending on priority and id', () => {
      const newId1 = new AtomID(0, 1, 2);
      const causeId1 = new AtomID(0, 0, 1);
      const value1 = {
        content: 'test-1',
        priority: 10,
        validateChild: () => true,
      };
      const atom1 = new Atom(
        newId1,
        causeId1,
        value1,
      );
      const newId2 = new AtomID(1, 1, 2);
      const causeId2 = new AtomID(1, 0, 1);
      const value2 = {
        content: 'test-2',
        priority: 100,
        validateChild: () => true,
      };
      const atom2 = new Atom(
        newId2,
        causeId2,
        value2,
      );
      const newId3 = new AtomID(0, 2, 3);
      const causeId3 = new AtomID(0, 1, 2);
      const value3 = {
        content: 'test-3',
        priority: 10,
        validateChild: () => true,
      };
      const atom3 = new Atom(
        newId3,
        causeId3,
        value3,
      );
      expect(Atom.compare(atom1, atom1)).toEqual(0);
      expect(Atom.compare(atom1, atom2)).toBeLessThan(0);
      expect(Atom.compare(atom2, atom1)).toBeGreaterThan(0);
      expect(Atom.compare(atom1, atom3)).toBeLessThan(0);
    });
  });
});
