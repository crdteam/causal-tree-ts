import Atom from './Atom';
import AtomId from './AtomId';
import IndexMap from './IndexMap';
import { causalBlockLength, getNewUuid, isContainer, walkCausalBlock } from '../utils/functions';
import { AtomValue } from './AtomValue';
import { InsertString } from './operations/string/InsertString';
import { Delete } from './operations/Delete';
import { InsertCounter } from './operations/counter/InsertCounter';

const WEAVE_STR_SEPARATOR = '->';

/**
 * CausalTreePrototype is a base type for CausalTree.
 */
interface CausalTreePrototype {
  weave: Atom[];
  sitemap: string[];
  timestamp: number;
  yarns: Atom[][];
  siteIdx: number;
}

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

export default class CausalTree {
  weave: Atom[];

  sitemap: string[];

  timestamp: number;

  yarns: Atom[][];

  siteIdx: number;

  constructor(proto?: CausalTreePrototype) {
    if (proto) {
      this.weave = proto.weave;
      this.sitemap = proto.sitemap;
      this.timestamp = proto.timestamp;
      this.yarns = proto.yarns;
      this.siteIdx = proto.siteIdx;
      return;
    }

    const siteUuid = getNewUuid();
    this.siteIdx = 0;
    this.sitemap = [siteUuid];
    this.timestamp = 1;
    this.weave = [];
    this.yarns = [[]];
  }

  static unmarshall(str: string): CausalTree {
    const {
      weave: weaveStr,
      yarns: yarnsStrs,
      sitemap,
      timestamp,
      siteIdx,
    } = JSON.parse(str);
    const weave = weaveStr
      .split(WEAVE_STR_SEPARATOR)
      .map((atomStr: string) => Atom.unmarshall(atomStr));
    const yarns = yarnsStrs.map((yarnStr: string) => (
      yarnStr === ''
        ? []
        : yarnStr
          .split(WEAVE_STR_SEPARATOR)
          .map((atomStr: string) => Atom.unmarshall(atomStr))
    ));

    return new CausalTree({
      weave,
      yarns,
      sitemap,
      timestamp,
      siteIdx,
    });
  }

  getAtom(atomID: AtomId): Atom {
    return this.yarns[atomID.site][atomID.index];
  }

  getAtomIndexAtWeave(atomID: AtomId): number {
    if (atomID.timestamp === 0) return -1;
    const idx = this.weave.findIndex((atom) => (
      AtomId.compare(atom.id, atomID) === 0
    ));
    return idx === -1 ? this.weave.length : idx;
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
     * @returns index of the inserted atom in the weave.
     */
  insertChildAtom(atom: Atom, cause: AtomId): number {
    const causeIdx = this.getAtomIndexAtWeave(cause);
    if (causeIdx === -1) {
      this.insertAtomAtWeave(atom, 0);
      return -1;
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
      // TODO: if there are new operation priorities, this should be revisited
      if (Atom.compare(a, atom) < 0) {
        pos = len;
        return false;
      }

      return true;
    });

    const index = pos > 0
      ? causeIdx + pos
      : causeIdx + len + 1;
    this.insertAtomAtWeave(atom, index);
    return index;
  }

  /**
   * Creates and inserts a new atom in the weave (former addAtom).
   *
   * Time complexity of O(weave.length + log(sitemap.length)).
   * @returns id and index of the inserted atom.
   */
  insertAtomFromValue(value: AtomValue, cause: AtomId): [AtomId, number] {
    this.timestamp += 1;
    if (this.timestamp === 0) throw new Error('Timestamp overflow');

    if (cause.timestamp > 0) {
      const causeAtom = this.getAtom(cause);
      if (!causeAtom) throw new Error('Invalid cause atom');
      causeAtom.value.validateChild(value);
    }

    const atomId = new AtomId(this.siteIdx, this.yarns[this.siteIdx].length, this.timestamp);
    const atom = new Atom(atomId, cause, value);
    const index = this.insertChildAtom(atom, cause);
    this.insertAtomAtYarn(atom, this.siteIdx);
    return [atomId, index];
  }

  /**
   * Inserts a new string container atom at the root of the weave.
   * @returns id of the inserted atom
   */
  insertString(): AtomId {
    this.clean();
    const root = new AtomId(0, 0, 0);
    const insertStr = new InsertString();
    const [id] = this.insertAtomFromValue(insertStr, root);
    return id;
  }

  /**
   * Inserts a new counter container atom at the root of the weave.
   * @returns id of the inserted atom
   */
  insertCounter(): AtomId {
    this.clean();
    const root = new AtomId(0, 0, 0);
    const insertCtr = new InsertCounter();
    const [id] = this.insertAtomFromValue(insertCtr, root);
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

  /**
   * Ignores deleted atoms in the weave
   * @returns an array of atoms
   *
   * Time complexity of O(weave.length)
   */
  filterDeletedAtoms(): Atom[] {
    const atoms: Atom[] = [];
    for (let i = 0; i < this.weave.length;) {
      const element = this.weave[i];
      const next = i === this.weave.length - 1 ? null : this.weave[i + 1];
      if (!next) {
        atoms.push(element);
        break;
      }

      if (next.value instanceof Delete) {
        if (isContainer(element)) i += causalBlockLength(this.weave.slice(i));
        else i += 2;
      } else {
        atoms.push(element);
        i += 1;
      }
    }

    return atoms;
  }

  /**
   * Returns the tree weave as a readable array string (result).
   */
  toString(): any[] {
    const atoms = this.filterDeletedAtoms();
    const elements: any[] = [];

    for (let i = 0; i < atoms.length;) {
      const curr = atoms[i];

      if (isContainer(curr)) {
        const len = causalBlockLength(atoms.slice(i));
        const causalBlock = atoms.slice(i + 1, i + len + 1);

        if (curr.value instanceof InsertString) {
          const str = causalBlock
            .map((a) => a.value.toString())
            .join('');
          elements.push(str);
        } else if (curr.value instanceof InsertCounter) {
          const sum = causalBlock
            .map((a) => a.value.content)
            .reduce((a, b) => a + b, 0);
          elements.push(sum);
        }

        i += len;
      } else {
        throw new Error(`Atom without a container: ${curr.value.toString(true)}. AtomId: ${curr.id.toString()}`);
      }
    }

    return elements;
  }

  /**
   * Clears the tree weave and yarns.
   */
  clean(): void {
    this.weave = [];
    this.yarns = [[]];
  }

  /**
   * Fork a replicated tree into an independent object.
   *
   * Time complexity of O(weave.length + yarns.length).
   */
  fork(): CausalTree {
    if (this.sitemap.length >= Number.MAX_SAFE_INTEGER) {
      throw new Error('Sitemap overflow');
    }

    const newSiteId = getNewUuid();
    const idx = findSiteIndex(this.sitemap, newSiteId);

    if (idx === this.sitemap.length) {
      this.sitemap.push(newSiteId);
      this.yarns.push([]);
    } else {
      const localRemap = new IndexMap();

      // For each site after the new site, shift its index by 1
      for (let i = idx; i < this.sitemap.length; i += 1) {
        localRemap.set(i, i + 1);
      }

      // Remaps atoms in yarns and weave
      for (let i = 0; i < this.yarns.length; i += 1) {
        for (let j = 0; j < this.yarns[i].length; j += 1) {
          this.yarns[i][j].remapSiteInplace(localRemap);
        }
      }

      for (let i = 0; i < this.weave.length; i += 1) {
        this.weave[i].remapSiteInplace(localRemap);
      }

      // Adds new yarn and site to the tree
      this.yarns.splice(idx, 0, []);
      this.sitemap.splice(idx, 0, newSiteId);
    }

    this.timestamp += 1;

    const tree = new CausalTree();
    tree.timestamp = this.timestamp;
    tree.siteIdx = idx;
    tree.sitemap = [...this.sitemap];
    tree.weave = [...this.weave];
    tree.yarns = this.yarns.map((yarn) => [...yarn]);
    return tree;
  }

  /**
   * Merges two sitemaps, returning the result.
   *
   * Time complexity of O(sitemap.length).
   */
  mergeSitemaps(sitemap1: string[], sitemap2: string[]): string[] {
    const finalSitemap: string[] = [];

    let i = 0;
    let j = 0;
    while (i < sitemap1.length && j < sitemap2.length) {
      const s1 = sitemap1[i];
      const s2 = sitemap2[j];

      if (s1 === s2) {
        finalSitemap.push(s1);
        i += 1;
        j += 1;
      } else if (s1 < s2) {
        finalSitemap.push(s1);
        i += 1;
      } else {
        finalSitemap.push(s2);
        j += 1;
      }
    }

    if (i < sitemap1.length) finalSitemap.push(...sitemap1.slice(i));
    if (j < sitemap2.length) finalSitemap.push(...sitemap2.slice(j));

    return finalSitemap;
  }

  /**
   * Same as mergeWeave, but with two different weaves, returning the result.
   */
  mergeWeaves(weave1: Atom[], weave2: Atom[]): Atom[] {
    const finalWeave: Atom[] = [];

    let i = 0;
    let j = 0;
    while (i < weave1.length && j < weave2.length) {
      const a1 = weave1[i];
      const a2 = weave2[j];

      if (Atom.compare(a1, a2) === 0) {
        // Atoms are equal, so we can just add one of them
        finalWeave.push(a1);
        i += 1;
        j += 1;
      } else if (a1.id.site === a2.id.site) {
        // Atoms are from the same site, so we need only to compare their timestamps
        if (a1.id.timestamp < a2.id.timestamp) {
          finalWeave.push(a2);
          j += 1;
        } else {
          finalWeave.push(a1);
          i += 1;
        }
      } else if (Atom.compare(a1, a2) >= 0) {
        // Atoms are concurrent; append first causal block, according to heads' order.
        const n1 = i + causalBlockLength(weave1.slice(i));
        finalWeave.splice(finalWeave.length, 0, ...weave1.slice(i, n1));
        i = n1;
      } else {
        const n2 = j + causalBlockLength(weave2.slice(j));
        finalWeave.splice(finalWeave.length, 0, ...weave2.slice(j, n2));
        j = n2;
      }
    }

    if (i < weave1.length) finalWeave.push(...weave1.slice(i));
    if (j < weave2.length) finalWeave.push(...weave2.slice(j));

    return finalWeave;
  }

  /**
   * Remap atoms from local, returning the result.
   *
   * @param localRemap - index map of the local site
   * @param length - length of the sitemap
   *
   * Time complexity of O(weave.length + yarns.length * sitemap.length).
   */
  remapAtoms(localRemap: IndexMap, length: number): [Atom[][], Atom[]] {
    const yarns: Atom[][] = [...new Array(length)].map(() => []);
    let weave: Atom[];
    if (localRemap.length() > 0) {
      // Remap atoms in yarns
      for (let i = 0; i < this.yarns.length; i += 1) {
        const iNew = localRemap.get(i);
        yarns[iNew] = this.yarns[i].map((atom) => atom.remapSite(localRemap));
      }

      // Remap atoms in weave
      weave = this.weave.map((atom) => atom.remapSite(localRemap));

      return [yarns, weave];
    }

    for (let i = 0; i < this.yarns.length; i += 1) {
      yarns[i] = [...this.yarns[i]];
    }

    weave = [...this.weave];

    return [yarns, weave];
  }

  /**
   * Merge updates the current state with that of another remote tree.
   *
   * Time complexity of O(weave.length ^ 2 + sitemap.length * log(sitemap.length)).
   */
  merge(remote: CausalTree): void {
    // Merge sitemaps
    const sitemap = this.mergeSitemaps(this.sitemap, remote.sitemap);
    const siteIdx = findSiteIndex(sitemap, this.sitemap[this.siteIdx]);

    // Compute site index remapping
    const localRemap = new IndexMap();
    const remoteRemap = new IndexMap();
    this.sitemap.forEach((site, idx) => (
      localRemap.set(idx, findSiteIndex(sitemap, site))
    ));
    remote.sitemap.forEach((site, idx) => (
      remoteRemap.set(idx, findSiteIndex(sitemap, site))
    ));

    // Remap atoms from local
    const [yarns, weave] = this.remapAtoms(localRemap, sitemap.length);

    // Merge yarns
    remote.yarns.forEach((yarn, idx) => {
      const idxNew = remoteRemap.get(idx);
      const start = yarns[idxNew].length;
      const end = yarn.length;
      const newAtoms = yarn.slice(start, end);
      yarns[idxNew].splice(start, 0, ...newAtoms.map(
        (atom) => atom.remapSite(remoteRemap),
      ));
    });

    // Merge weave
    const remoteWeave = remote.weave.map((atom) => atom.remapSite(remoteRemap));
    const mergedWeave = this.mergeWeaves(weave, remoteWeave);

    // Update tree
    this.sitemap = sitemap;
    this.siteIdx = siteIdx;
    this.yarns = yarns;
    // TODO: this next step may break current cursors
    this.weave = mergedWeave;
    if (remote.timestamp > this.timestamp) this.timestamp = remote.timestamp;
    this.timestamp += 1;
  }

  marshallAtoms(atoms: Atom[]): string {
    return atoms
      .map((atom) => atom.marshall())
      .join(WEAVE_STR_SEPARATOR);
  }

  marshall(): string {
    const weaveStr = this.marshallAtoms(this.weave);
    const yarnsStrs = this.yarns.map((yarn) => this.marshallAtoms(yarn));
    return JSON.stringify({
      weave: weaveStr,
      yarns: yarnsStrs,
      sitemap: this.sitemap,
      timestamp: this.timestamp,
      siteIdx: this.siteIdx,
    });
  }
}
