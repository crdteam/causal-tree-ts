import AtomID from '../AtomID';

describe('Atom', () => {
  describe('toString', () => {
    it('should print according to defined format', () => {
      const id = new AtomID(0, 1, 2);
      expect(id.toString()).toEqual('S0@T2');
    });
  });
  describe('compare', () => {
    it('should compare correctly: ascending on priority and id', () => {
      const id1 = new AtomID(0, 1, 2);
      const id2 = new AtomID(1, 1, 2);
      const id3 = new AtomID(0, 2, 3);
      expect(AtomID.compare(id1, id1)).toEqual(0);
      expect(AtomID.compare(id1, id2)).toBeGreaterThan(0);
      expect(AtomID.compare(id2, id1)).toBeLessThan(0);
      expect(AtomID.compare(id1, id3)).toBeLessThan(0);
    });
  });
});
