import Atom from '../core/Atom';
import TreePosition from '../core/TreePosition';
import Delete from '../core/operations/Delete';
import InsertChar from '../core/operations/string/InsertChar';
import InsertString from '../core/operations/string/InsertString';
import Char from './Char';
import { Cursor } from './Cursor';
import { Value } from './Value';

export class Str implements Value {
  treePosition: TreePosition;

  constructor(treePosition: TreePosition) {
    this.treePosition = treePosition;
  }

  /**
   * @returns A string representation of the value.
   */
  snapshot(): string {
    let chars = '';
    this.walkChars((atom, _, isDeleted) => {
      if (!isDeleted) chars += atom.value.toString();
      return true;
    });

    return chars;
  }

  /**
   * @returns The length of the string (number of characters).
   */
  length(): number {
    let length = 0;
    this.walkChars((_1, _2, isDeleted) => {
      if (!isDeleted) length += 1;
      return true;
    });

    return length;
  }

  /**
   * Walks through the string atoms invoking the callback function for each
   * non-deleted InsertChar atom.
   */
  walkChars(
    callback: (atom: Atom, pos: number, isDeleted: boolean) => boolean,
  ) {
    this.treePosition.walk((atom, pos, isDeleted) => {
      if (atom.value instanceof InsertString) return true;
      if (atom.value instanceof InsertChar) return callback(atom, pos, isDeleted);

      throw new Error(`Invalid atom value in String: ${atom.value.toString(true)}`);
    });
  }

  /**
   * Checks if the string was deleted.
   */
  isDeleted(): boolean {
    return this.treePosition.isDeleted();
  }

  /**
   * @returns A (string) cursor pointing to the beginning of the string.
   */
  getCursor(): StrCursor {
    return new StrCursor(this.treePosition);
  }
}

export class StrCursor implements Cursor {
  treePosition: TreePosition;

  /**
   * The last known position of the head (InsertString atom) in the tree's
   * weave.
   */
  private lastKnownHeadPos: number;

  constructor(treePosition: TreePosition) {
    this.treePosition = treePosition;
    this.lastKnownHeadPos = treePosition.lastKnownPos;
  }

  /**
   * @returns a pointer to the cursor's owner string.
   */
  getString(): Str {
    /**
     * Given c0 as the last known position of the pointed-to atom, and c1 its
     * current position, we know that (c1-c0) atoms were inserted since the last
     * cursor usage. The head position may be anywhere between s0 (its last
     * known position) and s0+(c1-c0).
     *
     * We search backwards from the end of the range. The first InsertStr atom
     * found must be the head of the char's string.
     */
    const c0 = this.treePosition.lastKnownPos;
    const c1 = this.treePosition.getIndex();
    const s0 = this.lastKnownHeadPos;
    let headPos = -1;
    for (let i = s0 + c1 - c0; i >= s0; i -= 1) {
      const atom = this.treePosition.getAtomAtIndex(i);
      if (atom.value instanceof InsertString) {
        headPos = i;
        this.lastKnownHeadPos = i;
        break;
      }
    }

    if (headPos === -1) {
      throw new Error('Head of string not found');
    }

    return new Str(
      new TreePosition(
        this.treePosition.getTree(),
        this.treePosition.getAtomAtIndex(headPos).id,
        headPos,
      ),
    );
  }

  /**
   * Index moves the cursor to the given string position.
   * Returns an error if index is out of range [-1:Len()-1].
   * Ignores whether string is deleted.
   * @param i - The position to move the cursor to.
   */
  index(i: number): void {
    if (i < -1) throw new Error(`Index out of range: ${i}`);

    const str = this.getString();
    if (i >= str.length()) throw new Error(`Index out of range: ${i}`);

    if (i === -1) {
      this.treePosition = new TreePosition(
        str.treePosition.getTree(),
        str.treePosition.getAtom().id,
        str.treePosition.lastKnownPos,
      );
      return;
    }

    let idxPos = -1;
    let count = 0;
    str.walkChars((_, pos, isDeleted) => {
      if (isDeleted) return true;

      if (count === i) {
        idxPos = pos;
        return false;
      }

      count += 1;
      return true;
    });

    if (idxPos === -1) throw new Error('Index not found');

    this.treePosition = new TreePosition(
      this.treePosition.getTree(),
      this.treePosition.getAtomAtIndex(idxPos).id,
      idxPos,
    );
  }

  delete(): void {
    const curAtom = this.treePosition.getAtom();
    if (curAtom.value instanceof InsertString) {
      throw new Error('Cannot delete string head');
    }

    const tree = this.treePosition.getTree();
    tree.insertAtomFromValue(new Delete(), curAtom.id);

    // Fix cursor position, moving it one to the left.
    // In this sense, "delete" is like the backspace key.
    //    v
    // abcdef
    //   v
    // abcef
    //  v
    // abef
    const str = this.getString();
    let prevPos = this.treePosition.lastKnownPos;
    str.walkChars((atom, pos, isDeleted) => {
      if (atom.id === curAtom.id) {
        this.treePosition = new TreePosition(
          tree,
          tree.weave[prevPos].id,
          prevPos,
        );
        return false;
      }

      if (!isDeleted) prevPos = pos;

      return true;
    });
  }

  /**
   * Inserts a new character right after the cursor's position.
   * The cursor is moved to the new character.
   * @returns the inserted character.
   */
  insert(ch: string): Char {
    const atom = this.treePosition.getAtom();
    const tree = this.treePosition.getTree();
    const [newAtom, newAtomPos] = tree.insertAtomFromValue(
      new InsertChar(ch),
      atom.id,
    );

    this.treePosition = new TreePosition(
      tree,
      newAtom,
      newAtomPos,
    );
    return new Char(this.treePosition);
  }

  /**
   * @returns the character at the cursor's position.
   */
  element(): string {
    const atom = this.treePosition.getAtom();
    if (atom.value instanceof InsertChar) {
      return atom.value.toString();
    }

    if (atom.value instanceof InsertString) {
      throw new Error('Cursor is pointing to string head, not a character');
    }

    throw new Error(`Invalid atom value in String: ${atom.value.toString(true)}`);
  }
}
