import Atom from '../Atom';
import IndexMap from '../IndexMap';
import getAtomID from '../utils/factories/AtomID';

describe('Atom', () => {
  describe('toString', () => {
    it('should print according to defined format', () => {
      const newId = getAtomID(0, 1, 2);
      const causeId = getAtomID(0, 0, 1);
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
      const newId1 = getAtomID(0, 1, 2);
      const causeId1 = getAtomID(0, 0, 1);
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
      const newId2 = getAtomID(1, 1, 2);
      const causeId2 = getAtomID(1, 0, 1);
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
      const newId3 = getAtomID(0, 2, 3);
      const causeId3 = getAtomID(0, 1, 2);
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
  describe('remapSite', () => {
    it('should return a new atom using given index map to both id and cause atom ids', () => {
      const id = getAtomID();
      const causeId = getAtomID(id.site);
      const value = {
        content: 'test',
        priority: 10,
        validateChild: () => true,
      };
      const atom = new Atom(
        id,
        causeId,
        value,
      );
      const map = new IndexMap();
      const newSiteIndex = 5;
      map.set(id.site, newSiteIndex);
      const mappedAtom = Atom.remapSite(atom, map);
      expect(mappedAtom).not.toBe(atom);
      expect(mappedAtom.id.site).toEqual(newSiteIndex);
      expect(mappedAtom.cause.site).toEqual(newSiteIndex);
    });
  });
});
