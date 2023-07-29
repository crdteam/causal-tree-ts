import Atom from './Atom';
import AtomId from './AtomId';
import IndexMap from './IndexMap';
import { getNewUuid, walkCausalBlock } from '../utils/functions';
import { AtomValue } from './AtomValue';
import InsertString from './operations/string/InsertString';
import Delete from './operations/Delete';
import InsertCounter from './operations/counter/InsertCounter';

/**
 * Returns the index where a site is (or should be) in the sitemap.
 * Time complexity of O(log(sitemap.length)).
 * @param sitemap
 * @param siteUuid
 */
const findSiteIndex = (sitemap: string[], siteUuid: string): number => {
  let left = 0;
  let right = sitemap.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (sitemap[mid] === siteUuid) return mid;
    if (sitemap[mid] < siteUuid) left = mid + 1;
    else right = mid - 1;
  }

  return left;
};

export class CausalTree {
  siteIdx: number;

  sitemap: string[];

  timestamp: number;

  weave: Atom[];

  yarns: Atom[][];

  constructor() {
    const siteUuid = getNewUuid();
    this.siteIdx = 0;
    this.sitemap = [siteUuid];
    this.timestamp = 1;
    this.weave = [];
    this.yarns = [[]];
  }

  getAtomIndexAtWeave(atomID: AtomId): number {
    if (atomID.timestamp === 0) return -1;
    const idx = this.weave.findIndex((atom) => atom.id === atomID);
    return idx === -1 ? this.weave.length : idx;
  }

  getAtom(atomID: AtomId): Atom {
    return this.yarns[atomID.site][atomID.index];
  }

  /**
   * Inserts an atom in the given index of the weave (former insertAtom).
   *
   * Time complexity of O(weave.length).
   * @param index - position at the weave
   */
  insertAtomAtWeave(atom: Atom, index: number): void {
    this.weave.splice(index, 0, atom);
  }

  /**
   * Inserts an atom at the end of given site's yarn.
   *
   * Time complexity of O(yarn.length).
   * @param site - index of the site in the sitemap
   */
  insertAtomAtYarn(atom: Atom, site: number): void {
    this.yarns[site].push(atom);
  }

  /**
   * Inserts an atom in the weave given its cause atom id (former insertAtomAtCursor).
   *
   * Time complexity of O(weave.length + (avg. block size)).
   */
  insertChildAtom(atom: Atom, cause: AtomId): void {
    const causeIdx = this.getAtomIndexAtWeave(cause);
    if (causeIdx === -1) {
      this.insertAtomAtWeave(atom, 0);
      return;
    }

    if (causeIdx === this.weave.length) {
      throw new Error('Invalid cause atom');
    }

    /** Search for position in weave that atom should be inserted, in a way that
    * it's sorted relative to other children in descending order.
    *
    *                                   causal block of cursor
    *                       ------------------------------------------------
    *  Weave:           ... [cursor] [child1] ... [child2] ... [child3] ... [not child]
    *  Block indices:           0         1          c2'          c3'           end'
    *  Weave indices:          c0        c1          c2           c3            end
    */
    let pos = 0;
    let len = 0;
    walkCausalBlock(this.weave.slice(causeIdx), (a: Atom) => {
      len += 1;
      if (a.cause === cause && Atom.compare(a, atom) < 0 && pos === 0) {
        pos = len;
      }

      return true;
    });

    const index = pos > 0
      ? causeIdx + pos
      : causeIdx + len + 1;
    this.insertAtomAtWeave(atom, index);
  }

  /**
   * Creates and inserts a new atom in the weave (former addAtom).
   *
   * Time complexity of O(weave.length + log(sitemap.length)).
   */
  insertAtomFromValue(value: AtomValue, cause: AtomId): AtomId {
    this.timestamp += 1;
    if (this.timestamp === 0) throw new Error('Timestamp overflow');

    if (cause.timestamp > 0) {
      const causeAtom = this.getAtom(cause);
      if (!causeAtom) throw new Error('Invalid cause atom');
      causeAtom.value.validateChild(value);
    }

    const atomId = new AtomId(this.siteIdx, this.yarns[this.siteIdx].length, this.timestamp);
    const atom = new Atom(atomId, cause, value);
    this.insertChildAtom(atom, cause);
    this.insertAtomAtYarn(atom, this.siteIdx);
    return atomId;
  }

  /**
   * Inserts a new string container atom at the root of the weave.
   * @returns id of the inserted atom
   */
  insertString(): AtomId {
    const root = new AtomId(0, 0, 0);
    const insertStr = new InsertString();
    const id = this.insertAtomFromValue(insertStr, root);
    return id;
  }

  /**
   * Inserts a new counter container atom at the root of the weave.
   * @returns id of the inserted atom
   */
  insertCounter(): AtomId {
    const root = new AtomId(0, 0, 0);
    const insertCtr = new InsertCounter();
    const id = this.insertAtomFromValue(insertCtr, root);
    return id;
  }

  /**
   * Deletes an atom from the weave.
   * @param atomID - id of the atom to be deleted
   */
  deleteAtom(atomID: AtomId): void {
    if (atomID.timestamp === 0) return;
    const deleteAtom = new Delete();
    this.insertAtomFromValue(deleteAtom, atomID);
  }
}
