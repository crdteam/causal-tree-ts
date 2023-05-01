import AtomId from '../AtomId';
import IndexMap from '../IndexMap';
import getAtomID from '../utils/factories/AtomId';

describe('Atom', () => {
  describe('toString', () => {
    it('should print according to defined format', () => {
      const id = getAtomID();
      expect(id.toString()).toEqual(`S${id.site}@T${id.timestamp}`);
    });
  });
  describe('compare', () => {
    it('should compare correctly: ascending on priority and id', () => {
      const id1 = getAtomID(0, 1, 2);
      const id2 = getAtomID(1, 1, 2);
      const id3 = getAtomID(0, 2, 3);
      expect(AtomId.compare(id1, id1)).toEqual(0);
      expect(AtomId.compare(id1, id2)).toBeGreaterThan(0);
      expect(AtomId.compare(id2, id1)).toBeLessThan(0);
      expect(AtomId.compare(id1, id3)).toBeLessThan(0);
    });
  });
  describe('remapSite', () => {
    it('should return a new atom id using given index map', () => {
      const id = getAtomID();
      const map = new IndexMap();
      const newSiteIndex = 5;
      map.set(id.site, newSiteIndex);
      const mappedId = AtomId.remapSite(id, map);
      expect(mappedId).not.toBe(id);
      expect(mappedId.site).toEqual(newSiteIndex);
    });
    it('should return an new equal atom id if index map has no entries', () => {
      const id = getAtomID();
      const map = new IndexMap();
      const mappedId = AtomId.remapSite(id, map);
      expect(mappedId).not.toBe(id);
      expect(mappedId.toString()).toMatch(id.toString());
    });
  });
});
