import Atom from '../Atom';
import IndexMap from '../IndexMap';
import getAtom from '../../utils/factories/Atom';
import getAtomId from '../../utils/factories/AtomId';
import getAtomValue from '../../utils/factories/AtomValue';
import AtomId from '../AtomId';

describe('Atom', () => {
  describe('toString', () => {
    it('should print according to defined format', () => {
      const site1 = 5;
      const timestamp1 = 178;
      const site2 = 6;
      const timestamp2 = 179;
      const id1 = getAtomId(site1, undefined, timestamp1);
      const id2 = getAtomId(site2, undefined, timestamp2);
      const value = getAtomValue(true);
      const atom = getAtom(id2, id1, value);
      expect(atom.toString()).toEqual(
        'Atom(S6@T179 S5@T178 true)',
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
  describe('marshall', () => {
    it('should marshall atom correctly', () => {
      const atom = getAtom(
        { site: 3, timestamp: 2, index: 1 },
        { site: 3, timestamp: 1, index: 0 },
        { content: 'a' },
      );
      expect(atom.marshall()).toEqual(
        '3:1:2)(3:0:1)(ConcreteAtomValue)(a',
      );
    });
  });
  describe('unmarshall', () => {
    it('should unmarshall atom correctly', () => {
      const atom = getAtom(
        { site: 3, timestamp: 2, index: 1 },
        { site: 3, timestamp: 1, index: 0 },
        { content: 'a' },
      );
      const unmarshalledAtom = Atom.unmarshall(atom.marshall());
      expect(AtomId.compare(unmarshalledAtom.id, atom.id)).toEqual(0);
      expect(AtomId.compare(unmarshalledAtom.cause, atom.cause)).toEqual(0);
      expect(unmarshalledAtom.value.toString()).toEqual(atom.value.toString());
    });
  });
});
