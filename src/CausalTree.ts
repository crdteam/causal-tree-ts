import Atom from './Atom';
import AtomId from './AtomId';
import IndexMap from './IndexMap';
import { getNewUuid } from './utils/functions';

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

  insertAtom(atom: Atom, index: number): void {
    this.weave.splice(index, 0, atom);
  }

}
