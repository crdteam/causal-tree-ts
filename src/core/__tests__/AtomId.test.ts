import AtomId from '../AtomId';
import IndexMap from '../IndexMap';
import getAtomId from '../../utils/factories/AtomId';

describe('Atom', () => {
  describe('toString', () => {
    it('should print according to defined format', () => {
      const site = 5;
      const timestamp = 178;
      const id = getAtomId(site, undefined, timestamp);
      expect(id.toString()).toEqual('S5@T178');
    });
  });
  describe('compare', () => {
    it('should compare correctly: ascending on priority and id', () => {
      const id1 = getAtomId(0, 1, 2);
      const id2 = getAtomId(1, 1, 2);
      const id3 = getAtomId(0, 2, 3);
      expect(AtomId.compare(id1, id1)).toEqual(0);
      expect(AtomId.compare(id1, id2)).toBeGreaterThan(0);
      expect(AtomId.compare(id2, id1)).toBeLessThan(0);
      expect(AtomId.compare(id1, id3)).toBeLessThan(0);
    });
  });
  describe('remapSite', () => {
    it('should return a new atom id using given index map', () => {
      const id = getAtomId();
      const map = new IndexMap();
      const newSiteIndex = 5;
      map.set(id.site, newSiteIndex);
      const mappedId = id.remapSite(map);
      expect(mappedId).not.toBe(id);
      expect(mappedId.site).toEqual(newSiteIndex);
    });
    it('should return an new equal atom id if index map has no entries', () => {
      const id = getAtomId();
      const map = new IndexMap();
      const mappedId = id.remapSite(map);
      expect(mappedId).not.toBe(id);
      expect(mappedId.toString()).toMatch(id.toString());
    });
  });
});
