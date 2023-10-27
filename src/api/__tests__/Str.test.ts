import CausalTree from '../CausalTree';

describe('StrCursor', () => {
  it('should insert a new char', () => {
    const ct = new CausalTree();
    const strCur = ct.setString().getCursor();

    strCur.insert('a');
    strCur.insert('b');
    strCur.insert('c');
    const newCh = strCur.insert('d');

    expect(ct.toString()).toEqual(['abcd']);
    expect(newCh.snapshot()).toEqual('d');
  });
  it('should return the pointed char', () => {
    const ct = new CausalTree();
    const strCur = ct.setString().getCursor();
    strCur.insert('a');
    strCur.insert('b');
    strCur.insert('c');

    const ch = strCur.element();

    expect(ct.toString()).toEqual(['abc']);
    expect(ch).toEqual('c');
  });
  it('should delete the pointed char and move the cursor backwards', () => {
    const ct = new CausalTree();
    const strCur = ct.setString().getCursor();
    strCur.insert('a');
    strCur.insert('b');
    strCur.insert('c');

    strCur.delete();

    expect(ct.toString()).toEqual(['ab']);
    expect(strCur.element()).toEqual('b');
  });
  it('should move the cursor accordingly', () => {
    const ct = new CausalTree();
    const strCur = ct.setString().getCursor();
    strCur.insert('a');
    strCur.insert('b');
    strCur.insert('c');

    strCur.index(0);
    expect(strCur.element()).toEqual('a');

    strCur.index(1);
    expect(strCur.element()).toEqual('b');

    strCur.index(2);
    expect(strCur.element()).toEqual('c');

    strCur.index(-1);
    expect(() => strCur.element()).toThrowError();
  });
  it('should throw an error if the cursor is moved to a invalid position', () => {
    const ct = new CausalTree();
    const strCur = ct.setString().getCursor();
    strCur.insert('a');
    strCur.insert('b');
    strCur.insert('c');

    expect(() => strCur.index(3)).toThrowError();
    expect(() => strCur.index(4)).toThrowError();
    expect(() => strCur.index(-2)).toThrowError();
  });
  it('should return a new string pointer', () => {
    const ct = new CausalTree();
    const strCur = ct.setString().getCursor();
    strCur.insert('a');
    strCur.insert('b');
    strCur.insert('c');

    const str = strCur.getString();

    expect(str).toBeDefined();
    expect(str.snapshot()).toEqual('abc');
  });
  it('should handle multiple operations', () => {
    const ct = new CausalTree();
    const strCur = ct.setString().getCursor();

    strCur.insert('a');
    strCur.insert('b');
    strCur.insert('c');
    strCur.index(1);
    strCur.delete();
    strCur.index(1);
    strCur.insert('c');
    strCur.index(-1);
    strCur.insert('z');
    strCur.insert('z');

    expect(ct.toString()).toEqual(['zzacc']);
  });
});

describe('Str', () => {
  it('should return a valid string cursor', () => {
    const ct = new CausalTree();

    const strCur = ct.setString().getCursor();
    expect(strCur).toBeDefined();

    strCur.insert('a');
    const str = strCur.getString();
    expect(str).toBeDefined();
    expect(ct.toString()).toEqual(['a']);
  });
  it('should snapshot the string properly', () => {
    const ct = new CausalTree();
    const strCur = ct.setString().getCursor();
    strCur.insert('a');
    strCur.insert('b');
    strCur.insert('c');
    strCur.index(1);
    strCur.delete();
    strCur.index(1);
    strCur.insert('c');

    const str = strCur.getString();

    expect(str).toBeDefined();
    expect(str.snapshot()).toEqual('acc');
  });
  it('should return the string length', () => {
    const ct = new CausalTree();
    const strCur = ct.setString().getCursor();
    strCur.insert('a');
    strCur.insert('b');
    strCur.insert('c');
    strCur.insert('d');
    strCur.insert('e');
    strCur.delete();
    strCur.index(0);
    strCur.delete();

    const str = strCur.getString();

    expect(str).toBeDefined();
    expect(str.length()).toEqual(3);
  });
  it('should check if the string was deleted', () => {
    const ct = new CausalTree();
    const strCur = ct.setString().getCursor();
    strCur.insert('a');
    strCur.insert('b');
    strCur.insert('c');
    strCur.insert('d');
    strCur.insert('e');
    strCur.delete();
    strCur.index(-1);

    let str = strCur.getString();
    ct.deleteString(str);

    str = strCur.getString();
    expect(str).toBeDefined();
    expect(str.isDeleted()).toBeTruthy();
  });
});
