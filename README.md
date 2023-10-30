# Causal Tree RDT

Implementation of a causal tree replicated data type (RDT) in Typescript.

## Requirements

- Node.js 16 (or higher)
- yarn

If you don't have any Node version installed, we recommend following [this tutorial](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (with nvm). You can install the latest stable yarnV1 version.

## Installation

To install any needed dependencies, simply run

```bash
yarn install --frozen-lockfile
```

## Usage

While in development, you can run the application in live mode using the following command:

```bash
yarn dev
```

In this way, it will recompile as you change source files.

To run the application as in production, you need first to compile source files to Javascript using:

```bash
yarn build
```

This will create the `build` directory at root (if it doesn't exist). Then, you can run:

```bash
yarn start
```

To check the code for any style issue or bad practice, you can run:

```bash
yarn lint
```

Which runs ESLint linter with the provided rules. To fix any auto-fixable issue, you can run:

```bash
yarn lint:fix
```

We provided some test files that can be executed with:

```bash
yarn test
```

Or, to generate a coverage report:

```bash
yarn test:coverage
```

## Diagrams

### Interface structure and relations

```mermaid
classDiagram    
    class Value
    <<interface>> Value
    Value: snapshot()

    class Str
    Container <|.. Str
    Value <|.. Str
    Str ..> StrCursor
    Str: snapshot() str
    Str: length() int
    Str: walkChars(func callback)
    Str: isDeleted() bool
    Str: getCursor() StrCursor
    
    class CausalTree
    Register <|.. CausalTree
    Str .. CausalTree
    CausalTree: unmarshall(str data) CausalTree
    CausalTree: unmarshallInplace(str data) CausalTree
    CausalTree: marshall() str
    CausalTree: fork() CausalTree
    CausalTree: forkString() str
    CausalTree: mergeString(str data)
    CausalTree: setString() 
    CausalTree: getStrCursor() StrCursor
    CausalTree: deleteString(Str string)

    class Cursor
    <<interface>> Cursor
    Cursor: index(int i)
    Cursor: delete()
    Cursor: insert(any ch) any
    Cursor: element() any
    
    class Register
    <<interface>> Register
    Register: setString() Str
    Register: clear()
    Register: value() Value

    class Char
    Char: snapshot() str
    
    class StrCursor
    Cursor <|.. StrCursor
    StrCursor ..> Char
    StrCursor: insert(str ch) Char
    StrCursor: getString() Str
    StrCursor: index(int i)
    StrCursor: delete()
    StrCursor: element() str
```

### Core structure

```mermaid
classDiagram
    Delete ..|> AtomValue
    Atom *-- AtomId
    CausalTree *-- Atom
    InsertStr ..|> AtomValue
    InsertChar ..|> AtomValue
    CausalTree <-- TreePosition
    TreePosition --> AtomId
    IndexMap .. Atom
    IndexMap .. AtomId

    class CausalTree {
      int siteIdx
      str[ ] sitemap
      Atom[ ] weave
      Atom[ ][ ] yarns
      int timestamp
      getAtom(AtomId id) Atom
      insertAtom(Atom atom, int pos)
      fork() CausalTree
      merge(CausalTree other)
    }

    class Atom {
      AtomId id
      AtomId cause
      AtomValue value
      int tag
      compare(Atom other) int
      remapSite(IndexMap map) Atom
      remapSiteInplace(IndexMap map)
      unmarshall(str data) Atom
      marshall() str
    }

    class AtomId {
      int site
      int index
      int timestamp
      compare(AtomId other) int
      remapSite(IndexMap map) AtomId
      remapSiteInplace(IndexMap map)
      toString() str
      unmarshall(str data) AtomId
      marshall() str
    }

    class AtomValue {
      <<interface>>
      content
      int priority
      toString(bool verbose) str
      validateChild(AtomValue child) bool
      marshall() str
      unmarshall(str data) AtomValue
      getName() str
    }

    class InsertStr

    class InsertChar 

    class Delete

    class TreePosition {
      CausalTree tree
      AtomId atomId
      lastKnownPos int
      getIndex() int
      getAtom() Atom
      getAtomAtIndex(int index) Atom
      getTree() CausalTree
      isDeleted() bool
      walk(func callback) void
    }

    class IndexMap {
      dict map
      get(int index) int
      set(int index, int value)
      length() int
    }

    %% class InsertCounter
    %% InsertCounter ..|> AtomValue

    %% class InsertAdd
    %% InsertAdd ..|> AtomValue
```
