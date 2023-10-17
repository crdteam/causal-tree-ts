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
    it('should throw if there are any previous content', () => {
      const ct = new CausalTree();
      const strCur = ct.setString().getCursor();
      strCur.insert('a');
      strCur.insert('b');

      expect(() => ct.setString()).toThrow();
    });
  });
  describe('toString', () => {
    it('should return a string array', () => {
      const ct = new CausalTree();
      const strCur = ct.setString().getCursor();
      strCur.insert('a');
      strCur.insert('b');

      expect(ct.toString()).toEqual(['ab']);
    });
  });
  describe('value', () => {
    it('should return null for empty string', () => {
      const ct = new CausalTree();

      expect(ct.value()).toBeNull();
    });
    it('should return the first string value', () => {
      const ct = new CausalTree();
      const strCur = ct.setString().getCursor();
      strCur.insert('a');
      strCur.insert('b');

      expect(ct.value()?.snapshot()).toEqual('ab');
    });
    it('should return the first string value after deletion', () => {
      const ct = new CausalTree();
      const strCur = ct.setString().getCursor();
      strCur.insert('a');
      strCur.insert('b');
      ct.deleteString(strCur.getString());

      expect(ct.value()).toBeNull();
    });
  });
  describe('deleteString', () => {
    it('should delete the string', () => {
      const ct = new CausalTree();
      const strCur = ct.setString().getCursor();
      strCur.insert('a');
      strCur.insert('b');

      ct.deleteString(strCur.getString());

      expect(ct.toString()).toEqual([]);
    });
  });
  describe('dumpWeave', () => {
    it('should return the weave as string array', () => {
      const ct = new CausalTree();
      const strCur = ct.setString().getCursor();
      strCur.insert('a');
      strCur.insert('b');

      expect(ct.dumpWeave()).toEqual(['Atom(S0@T2 S0@T0 STR:)', 'Atom(S0@T3 S0@T2 a)', 'Atom(S0@T4 S0@T3 b)']);
    });
  });
  describe('fork', () => {
    it('should return a new forked CausalTree', () => {
      const ct = new CausalTree();
      const strCur = ct.setString().getCursor();
      strCur.insert('a');
      strCur.insert('b');

      const fork = ct.fork();

      expect(fork).not.toBe(ct);
      expect(fork.toString()).toEqual(['ab']);
    });
  });
  describe('forkString', () => {
    it('should return a new forked CausalTree string', () => {
      const ct = new CausalTree();
      const strCur = ct.setString().getCursor();
      strCur.insert('a');
      strCur.insert('b');

      const forkStr = ct.forkString();

      expect(forkStr).toBeDefined();
      expect(forkStr).not.toEqual(ct.toString());
    });
  });
  describe('mergeString', () => {
    it('should merge a CausalTree string into the current tree', () => {
      const ct = new CausalTree();
      const strCur = ct.setString().getCursor();
      strCur.insert('a');
      strCur.insert('b');
      const forkStr = ct.forkString();

      const ct2 = new CausalTree();
      ct2.mergeString(forkStr);

      expect(ct2.toString()).toEqual(['ab']);
    });
  });
  describe('unmarshall', () => {
    it('should unmarshall an empty tree', () => {
      const ct = new CausalTree();
      const str = ct.forkString();

      const ct2 = new CausalTree();
      expect(() => ct2.unmarshallInplace(str)).not.toThrow();
      expect(ct2.toString()).toEqual([]);
    });
  });
});
