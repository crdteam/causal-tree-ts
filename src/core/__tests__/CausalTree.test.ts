import CausalTree from '../CausalTree';
import Delete from '../operations/Delete';
import InsertAdd from '../operations/counter/InsertAdd';
import InsertCounter from '../operations/counter/InsertCounter';
import InsertChar from '../operations/string/InsertChar';
import InsertString from '../operations/string/InsertString';

describe('CausalTree', () => {
  describe('insertString', () => {
    it('should insert a new container atom at root', () => {
      const tree = new CausalTree();

      const id = tree.insertString();

      expect(id).toBeDefined();
      expect(id.site).toEqual(0);
      expect(id.index).toEqual(0);
      expect(id.timestamp).toBeGreaterThan(0);
      expect(tree.weave.length).toEqual(1);
      expect(tree.weave[0].value).toBeInstanceOf(InsertString);
    });
  });
  describe('insertCounter', () => {
    it('should insert a new counter atom at root', () => {
      const tree = new CausalTree();

      const id = tree.insertCounter();

      expect(id).toBeDefined();
      expect(id.site).toEqual(0);
      expect(id.index).toEqual(0);
      expect(id.timestamp).toBeGreaterThan(0);
      expect(tree.weave.length).toEqual(1);
      expect(tree.weave[0].value).toBeInstanceOf(InsertCounter);
    });
  });
  describe('toString', () => {
    it('should get the final value of a string weave', () => {
      const tree = new CausalTree();
      const id1 = tree.insertString();
      // [str]:id1 -- c:id6
      //   '- a:id2 -- r:id7 -- ' ':id9
      //      |        '- s:id8
      //      '- t:id3 -- o:id4 -- r:id10
      //                  '- m:id5
      const [id2] = tree.insertAtomFromValue(new InsertChar('a'), id1);
      const [id3] = tree.insertAtomFromValue(new InsertChar('t'), id2);
      const [id4] = tree.insertAtomFromValue(new InsertChar('o'), id3);
      const [id5] = tree.insertAtomFromValue(new InsertChar('m'), id4);
      const [id6] = tree.insertAtomFromValue(new InsertChar('c'), id1);
      const [id7] = tree.insertAtomFromValue(new InsertChar('r'), id2);
      const [id8] = tree.insertAtomFromValue(new InsertChar('s'), id7);
      const [id9] = tree.insertAtomFromValue(new InsertChar(' '), id7);
      const [id10] = tree.insertAtomFromValue(new InsertChar('r'), id4);

      expect(tree.toString()[0]).toEqual('car storm');
    });
    it('should get the final value of a counter weave', () => {
      const tree = new CausalTree();
      const id1 = tree.insertCounter();

      const [id2] = tree.insertAtomFromValue(new InsertAdd(1), id1);
      const [id3] = tree.insertAtomFromValue(new InsertAdd(-2), id2);
      const [id4] = tree.insertAtomFromValue(new InsertAdd(3), id3);
      const [id5] = tree.insertAtomFromValue(new InsertAdd(4), id4);
      const [id6] = tree.insertAtomFromValue(new InsertAdd(-5), id1);
      const [id7] = tree.insertAtomFromValue(new InsertAdd(6), id2);
      const [id8] = tree.insertAtomFromValue(new InsertAdd(-7), id7);
      const [id9] = tree.insertAtomFromValue(new InsertAdd(-8), id7);
      const [id10] = tree.insertAtomFromValue(new InsertAdd(9), id4);

      expect(tree.toString()[0]).toEqual(1);
    });
  });
  describe('deleteAtom', () => {
    it('should delete the given atom', () => {
      const tree = new CausalTree();
      const id = tree.insertString();

      tree.deleteAtom(id);

      expect(tree.weave.length).toEqual(2);
      expect(tree.weave[1].value).toBeInstanceOf(Delete);
    });
    it('should delete the correct atom', () => {
      const tree = new CausalTree();
      const id1 = tree.insertString();
      const [id2] = tree.insertAtomFromValue(new InsertChar('a'), id1);
      const [id3] = tree.insertAtomFromValue(new InsertChar('t'), id1);
      const [id4] = tree.insertAtomFromValue(new InsertChar('i'), id1);

      tree.deleteAtom(id2);

      expect(tree.weave.length).toEqual(5);
      expect(tree.toString()[0]).toEqual('it');
    });
    it('should delete a string container atom', () => {
      const tree = new CausalTree();
      const id1 = tree.insertString();
      tree.insertAtomFromValue(new InsertChar('a'), id1);
      tree.insertAtomFromValue(new InsertChar('t'), id1);
      tree.insertAtomFromValue(new InsertChar('i'), id1);

      tree.deleteAtom(id1);

      expect(tree.weave.length).toEqual(5);
      expect(tree.toString()[0]).toBeUndefined();
    });
    it('should delete a counter container atom', () => {
      const tree = new CausalTree();
      const id1 = tree.insertCounter();
      tree.insertAtomFromValue(new InsertAdd(1), id1);
      tree.insertAtomFromValue(new InsertAdd(2), id1);
      tree.insertAtomFromValue(new InsertAdd(3), id1);
      tree.insertAtomFromValue(new InsertAdd(4), id1);

      tree.deleteAtom(id1);

      expect(tree.weave.length).toEqual(6);
      expect(tree.toString()[0]).toBeUndefined();
    });
    it('should allow more than one delete to an atom', () => {
      const tree = new CausalTree();
      const id1 = tree.insertString();
      const [id2] = tree.insertAtomFromValue(new InsertChar('a'), id1);
      tree.insertAtomFromValue(new InsertChar('t'), id1);
      tree.insertAtomFromValue(new InsertChar('i'), id1);

      tree.deleteAtom(id2);
      tree.deleteAtom(id2);
      tree.deleteAtom(id2);

      expect(tree.weave.length).toEqual(7);
      expect(tree.toString()[0]).toEqual('it');
    });
    it('should allow more than one delete to a container atom', () => {
      const tree = new CausalTree();
      const id1 = tree.insertString();
      tree.insertAtomFromValue(new InsertChar('a'), id1);
      tree.insertAtomFromValue(new InsertChar('t'), id1);
      tree.insertAtomFromValue(new InsertChar('i'), id1);

      tree.deleteAtom(id1);
      tree.deleteAtom(id1);
      tree.deleteAtom(id1);

      expect(tree.weave.length).toEqual(7);
      expect(tree.toString()[0]).toBeUndefined();
    });
    it('should allow multiple deletions consistently', () => {
      const tree = new CausalTree();
      const id1 = tree.insertString();
      // [str]:id1 -- o
      //   '- c:id2 -- [del]
      //      '- r:id3 -- m
      //         '- d:id4 -- [del]
      //            '- t:id5 -- [del]
      const [id2] = tree.insertAtomFromValue(new InsertChar('c'), id1);
      const [id3] = tree.insertAtomFromValue(new InsertChar('r'), id2);
      const [id4] = tree.insertAtomFromValue(new InsertChar('d'), id3);
      const [id5] = tree.insertAtomFromValue(new InsertChar('t'), id4);
      tree.deleteAtom(id2);
      tree.insertAtomFromValue(new InsertChar('o'), id1);
      tree.deleteAtom(id4);
      tree.deleteAtom(id5);
      tree.insertAtomFromValue(new InsertChar('m'), id3);

      expect(tree.weave.length).toEqual(10);
      expect(tree.toString()[0]).toEqual('orm');
    });
  });
});
