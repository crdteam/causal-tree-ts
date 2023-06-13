import IndexMap from '../core/IndexMap';

describe('IndexMap', () => {
  describe('get', () => {
    it('should return original index if not mapped', () => {
      const map = new IndexMap();
      expect(map.get(0)).toEqual(0);
      expect(map.get(1)).toEqual(1);
      expect(map.get(2)).toEqual(2);
    });

    it('should return mapped index if mapped', () => {
      const map = new IndexMap();
      map.set(0, 1);
      map.set(1, 2);
      map.set(2, 0);
      expect(map.get(0)).toEqual(1);
      expect(map.get(1)).toEqual(2);
      expect(map.get(2)).toEqual(0);
    });
  });

  describe('set', () => {
    it('should set mapping if index is not mapped', () => {
      const map = new IndexMap();
      map.set(0, 1);
      expect(map.get(0)).toEqual(1);
    });

    it('should not set mapping if value and index are the same', () => {
      const map = new IndexMap();
      map.set(3, 3);
      expect(map.get(3)).toEqual(3);
    });
  });
});
