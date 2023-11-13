import CausalTree from '../CausalTree';
import { Delete } from '../operations/Delete';
import { InsertAdd } from '../operations/counter/InsertAdd';
import { InsertCounter } from '../operations/counter/InsertCounter';
import { InsertChar } from '../operations/string/InsertChar';
import { InsertString } from '../operations/string/InsertString';

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
      tree.insertAtomFromValue(new InsertChar('m'), id4);
      tree.insertAtomFromValue(new InsertChar('c'), id1);
      const [id7] = tree.insertAtomFromValue(new InsertChar('r'), id2);
      tree.insertAtomFromValue(new InsertChar('s'), id7);
      tree.insertAtomFromValue(new InsertChar(' '), id7);
      tree.insertAtomFromValue(new InsertChar('r'), id4);

      expect(tree.toString()[0]).toEqual('car storm');
    });
    it('should get the final value of a counter weave', () => {
      const tree = new CausalTree();
      const id1 = tree.insertCounter();

      const [id2] = tree.insertAtomFromValue(new InsertAdd(1), id1);
      const [id3] = tree.insertAtomFromValue(new InsertAdd(-2), id2);
      const [id4] = tree.insertAtomFromValue(new InsertAdd(3), id3);
      tree.insertAtomFromValue(new InsertAdd(4), id4);
      tree.insertAtomFromValue(new InsertAdd(-5), id1);
      const [id7] = tree.insertAtomFromValue(new InsertAdd(6), id2);
      tree.insertAtomFromValue(new InsertAdd(-7), id7);
      tree.insertAtomFromValue(new InsertAdd(-8), id7);
      tree.insertAtomFromValue(new InsertAdd(9), id4);

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
      tree.insertAtomFromValue(new InsertChar('t'), id1);
      tree.insertAtomFromValue(new InsertChar('i'), id1);

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
  describe('fork', () => {
    it('should return a new valid CT with same weave and yarns', () => {
      const tree = new CausalTree();
      const id1 = tree.insertString();
      const [id2] = tree.insertAtomFromValue(new InsertChar('a'), id1);
      tree.insertAtomFromValue(new InsertChar('t'), id1);
      tree.insertAtomFromValue(new InsertChar('i'), id1);

      const forked = tree.fork();

      expect(tree.sitemap.length).toEqual(2);
      expect(tree.yarns.length).toEqual(2);
      expect(tree.siteIdx).not.toEqual(forked.siteIdx);
      expect(tree.sitemap[tree.siteIdx]).not.toEqual(forked.sitemap[forked.siteIdx]);
      expect(forked.sitemap).toEqual(tree.sitemap);
      expect(forked.weave).toEqual(tree.weave);
      expect(forked.yarns).toEqual(tree.yarns);
      forked.yarns.forEach((yarn, i) => {
        expect(yarn).toEqual(tree.yarns[i]);
      });
      expect(forked.toString()).toEqual(['ita']);
      expect(() => forked.insertAtomFromValue(new Delete(), id2)).not.toThrow();
      expect(forked.toString()).toEqual(['it']);
    });
  });
  describe('merge', () => {
    it('should merge other valid CT into the current one', () => {
      // [str]@1 -- a@1 -- [del]@2
      //   '- t@1 -- c@2
      //   '- i@1 -- [del]@2
      //   '- e@2
      const tree = new CausalTree();
      const id1 = tree.insertString();
      const [id2] = tree.insertAtomFromValue(new InsertChar('a'), id1);
      const [id3] = tree.insertAtomFromValue(new InsertChar('t'), id1);
      const [id4] = tree.insertAtomFromValue(new InsertChar('i'), id1);

      const forked = tree.fork();
      forked.insertAtomFromValue(new Delete(), id2);
      forked.insertAtomFromValue(new Delete(), id4);
      forked.insertAtomFromValue(new InsertChar('e'), id1);
      forked.insertAtomFromValue(new InsertChar('c'), id3);

      tree.merge(forked);

      expect(tree.sitemap.length).toEqual(2);
      expect(tree.yarns.length).toEqual(2);
      expect(tree.siteIdx).not.toEqual(forked.siteIdx);
      expect(forked.sitemap).toEqual(tree.sitemap);
      expect(forked.weave).toEqual(tree.weave);
      expect(forked.yarns).toEqual(tree.yarns);
      forked.yarns.forEach((yarn, i) => {
        expect(yarn).toEqual(tree.yarns[i]);
      });
      expect(forked.toString()).toEqual(['etc']);
      expect(tree.toString()).toEqual(['etc']);
    });
    it('should merge an unknown valid CT into the current one', () => {
      const baseTree = new CausalTree();
      const id1 = baseTree.insertString();
      const tree1 = baseTree.fork();
      const [id2] = tree1.insertAtomFromValue(new InsertChar('i'), id1);
      const [id3] = tree1.insertAtomFromValue(new InsertChar('t'), id2);
      tree1.insertAtomFromValue(new InsertChar('a'), id3);
      const tree2 = baseTree.fork();
      const [id4] = tree2.insertAtomFromValue(new InsertChar('c'), id1);
      const [id5] = tree2.insertAtomFromValue(new InsertChar('o'), id4);
      tree2.insertAtomFromValue(new InsertChar('c'), id5);

      tree1.merge(tree2);

      expect(tree1.sitemap.length).toEqual(3);
      expect(tree1.yarns.length).toEqual(3);
      expect(tree1.toString()).toEqual(['cocita']);

      tree2.merge(tree1);

      expect(tree2.sitemap).toEqual(tree1.sitemap);
      expect(tree2.yarns.length).toEqual(3);
      expect(tree2.siteIdx).not.toEqual(tree1.siteIdx);
      expect(tree2.weave).toEqual(tree1.weave);
      tree2.yarns.forEach((yarn, i) => {
        expect(yarn).toEqual(tree1.yarns[i]);
      });
      expect(tree2.toString()).toEqual(['cocita']);

      baseTree.merge(tree2);

      expect(baseTree.sitemap).toEqual(tree2.sitemap);
      expect(baseTree.yarns.length).toEqual(3);
      expect(baseTree.siteIdx).not.toEqual(tree2.siteIdx);
      expect(baseTree.weave).toEqual(tree2.weave);
      baseTree.yarns.forEach((yarn, i) => {
        expect(yarn).toEqual(tree2.yarns[i]);
      });
      expect(baseTree.toString()).toEqual(['cocita']);

      const [id6] = baseTree.insertAtomFromValue(new InsertChar('t'), id1);
      baseTree.insertAtomFromValue(new InsertChar('g'), id6);

      tree2.merge(baseTree);

      expect(tree2.sitemap).toEqual(baseTree.sitemap);
      expect(tree2.yarns.length).toEqual(3);
      expect(tree2.siteIdx).not.toEqual(baseTree.siteIdx);
      expect(tree2.weave).toEqual(baseTree.weave);
      tree2.yarns.forEach((yarn, i) => {
        expect(yarn).toEqual(baseTree.yarns[i]);
      });
      expect(tree2.toString()).toEqual(['tgcocita']);
    });
    it('should throw error and apply no changes if there\'s some problem during merge', () => {
      const tree = new CausalTree();
      const id1 = tree.insertString();
      const [id2] = tree.insertAtomFromValue(new InsertChar('a'), id1);
      const [id3] = tree.insertAtomFromValue(new InsertChar('t'), id1);
      const [id4] = tree.insertAtomFromValue(new InsertChar('i'), id1);

      const forked = tree.fork();
      forked.insertAtomFromValue(new Delete(), id2);
      forked.insertAtomFromValue(new Delete(), id4);
      forked.insertAtomFromValue(new InsertChar('e'), id1);
      forked.insertAtomFromValue(new InsertChar('c'), id3);
      const problematic = forked.fork();
      problematic.sitemap.splice(1, 2); // invalidates sitemap

      expect(() => tree.merge(problematic)).toThrow();

      expect(tree.sitemap.length).toEqual(2);
      expect(forked.toString()).toEqual(['etc']);
      expect(tree.toString()).toEqual(['ita']);
    });
  });
  describe('(un)marshall', () => {
    it('should marshall and unmarshall properly a single CT', () => {
      const tree = new CausalTree();
      const id1 = tree.insertString();
      const [id2] = tree.insertAtomFromValue(new InsertChar('a'), id1);
      tree.insertAtomFromValue(new InsertChar('t'), id1);
      tree.insertAtomFromValue(new InsertChar('i'), id1);

      const marshalled = tree.marshall();
      const unmarshalled = CausalTree.unmarshall(marshalled);

      expect(unmarshalled.sitemap.length).toEqual(1);
      expect(unmarshalled.yarns.length).toEqual(1);
      expect(unmarshalled.siteIdx).toEqual(tree.siteIdx);
      expect(unmarshalled.sitemap).toEqual(tree.sitemap);
      expect(unmarshalled.weave).toEqual(tree.weave);
      expect(unmarshalled.yarns).toEqual(tree.yarns);
      unmarshalled.yarns.forEach((yarn, i) => {
        expect(yarn).toEqual(tree.yarns[i]);
      });
      expect(unmarshalled.toString()).toEqual(['ita']);
      expect(() => unmarshalled.insertAtomFromValue(new Delete(), id2)).not.toThrow();
      expect(unmarshalled.toString()).toEqual(['it']);
    });
    it('should marshall and unmarshall a merged CT', () => {
      const baseTree = new CausalTree();
      const id1 = baseTree.insertString();
      const tree1 = baseTree.fork();
      const [id2] = tree1.insertAtomFromValue(new InsertChar('i'), id1);
      const [id3] = tree1.insertAtomFromValue(new InsertChar('t'), id2);
      tree1.insertAtomFromValue(new InsertChar('a'), id3);
      const tree2 = baseTree.fork();
      const [id4] = tree2.insertAtomFromValue(new InsertChar('c'), id1);
      const [id5] = tree2.insertAtomFromValue(new InsertChar('o'), id4);

      tree1.merge(tree2);

      const marshalled = tree1.marshall();
      const unmarshalled = CausalTree.unmarshall(marshalled);

      expect(unmarshalled.sitemap.length).toEqual(3);
      expect(unmarshalled.yarns.length).toEqual(3);
      expect(unmarshalled.siteIdx).toEqual(tree1.siteIdx);
      expect(unmarshalled.sitemap).toEqual(tree1.sitemap);
      expect(unmarshalled.weave).toEqual(tree1.weave);
      expect(unmarshalled.yarns).toEqual(tree1.yarns);
      unmarshalled.yarns.forEach((yarn, i) => {
        expect(yarn).toEqual(tree1.yarns[i]);
      });
      expect(unmarshalled.toString()).toEqual(['coita']);
      expect(() => unmarshalled.insertAtomFromValue(new InsertChar('c'), id5)).not.toThrow();
      expect(unmarshalled.toString()).toEqual(['cocita']);
    });
  });
});
