import CausalTree from '../CausalTree';

describe('CausalTree', () => {
  it('should create a new empty CT', () => {
    const ct = new CausalTree();
    expect(ct).toBeDefined();
    expect(ct.toString()).toEqual([]);
  });
  describe('setString', () => {
    it('should create a new empty string and return a string pointer', () => {
      const ct = new CausalTree();

      const str = ct.setString();

      expect(str).toBeDefined();
      expect(ct.toString()).toEqual(['']);
    });
    it('should ignore and clear previous content', () => {
      const ct = new CausalTree();
      const strCur = ct.setString().getCursor();
      strCur.insert('a');
      strCur.insert('b');

      const newStr = ct.setString();

      expect(newStr).toBeDefined();
      expect(ct.toString()).toEqual(['']);
    });
  });
});
