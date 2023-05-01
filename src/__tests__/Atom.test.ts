import Atom from '../Atom';
import IndexMap from '../IndexMap';
import getAtom from '../utils/factories/Atom';

describe('Atom', () => {
  describe('toString', () => {
    it('should print according to defined format', () => {
      const atom = getAtom();
      expect(atom.toString()).toEqual(
        `Atom(S${atom.id.site}@T${atom.id.timestamp} S${atom.cause.site}@T${atom.cause.timestamp} ${atom.value.content})`,
      );
    });
  });
  describe('compare', () => {
    it('should compare correctly: ascending on priority and id', () => {
      const atom1 = getAtom(
        { site: 0, timestamp: 2 },
        { site: 0, timestamp: 1 },
        { priority: 10 },
      );
      const atom2 = getAtom(
        { site: 1, timestamp: 2 },
        { site: 1, timestamp: 1 },
        { priority: 100 },
      );
      const atom3 = getAtom(
        { site: 0, timestamp: 3 },
        { site: 0, timestamp: 2 },
        { priority: 10 },
      );
      expect(Atom.compare(atom1, atom1)).toEqual(0);
      expect(Atom.compare(atom1, atom2)).toBeLessThan(0);
      expect(Atom.compare(atom2, atom1)).toBeGreaterThan(0);
      expect(Atom.compare(atom1, atom3)).toBeLessThan(0);
    });
  });
  describe('remapSite', () => {
    it('should return a new atom using given index map to both id and cause atom ids', () => {
      const atom = getAtom(
        { site: 3 },
        { site: 3 },
      );
      const map = new IndexMap();
      const newSiteIndex = 5;
      map.set(atom.id.site, newSiteIndex);
      const mappedAtom = atom.remapSite(map);
      expect(mappedAtom).not.toBe(atom);
      expect(mappedAtom.id.site).toEqual(newSiteIndex);
      expect(mappedAtom.cause.site).toEqual(newSiteIndex);
    });
  });
});
