# Causal Tree RDT

Implementation of a causal tree replicated data type (RDT) in Typescript.

## Requirements

- Node.js 16 (or higher)
- yarn

If you don't have any Node version installed, we recommend following [this tutorial](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (with nvm). You can install the latest stable yarnV1 version.

## Installation

To install any needed dependencies, simply run

```bash
yarn
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

We provided some test files that can be executed with:

```bash
yarn test
```

Or, to generate a coverage report:

```bash
yarn test:coverage
```

## Diagrams

### Interface base structure

```mermaid
classDiagram
    class Container
    <<interface>> Container
    Container: Len() int 
    Container: Cursor() Cursor
    
    class Value
    <<interface>> Value
    Value: Snapshot()

    class String
    Container <|.. String
    Value <|.. String
    String: Snapshot() str
    
    class List
    Container <|.. List
    Value <|.. List
    List: Snapshot() any[ ]
    
    class CausalTree
    Register <|.. CausalTree

    class Cursor
    <<interface>> Cursor
    Cursor: Index(int i)
    Cursor: Delete()
    
    class Register
    <<interface>> Register
    Register: SetString() String
    Register: SetCounter() Counter
    Register: SetList() List
    Register: Clear()
    Register: Value() Value

    class Char
    Char: char ch
    
    class StringCursor
    Cursor <|.. StringCursor
    StringCursor: Insert(char ch) Char
    StringCursor: Value() Char
    
    class ListCursor
    Cursor <|.. ListCursor
    ListCursor: Insert() ListElement
    ListCursor: Value() ListElement
    
    class ListElement
    Register <|.. ListElement
    
    class Counter
    Value <|.. Counter
    Counter: Snapshot() int
    Counter: Increment(int x)
    Counter: Decrement(int x)
```

#### Interface classes relations

```mermaid
classDiagram    
    class ListElement
    ListCursor ..> ListElement
    ListElement: SetString() String
    ListElement: SetCounter() Counter
    ListElement: SetList() List

    class String
    String <.. ListElement
    String: Cursor() StringCursor

    class List
    List <.. ListElement
    List: Cursor() ListCursor

    class Counter
    Counter <.. ListElement

    class CausalTree
    CausalTree .. String
    CausalTree .. Counter
    CausalTree .. List
    CausalTree: SetString() String
    CausalTree: SetCounter() Counter
    CausalTree: SetList() List
  
    class StringCursor 
    String ..> StringCursor
    StringCursor: Insert(rune ch) Char
    StringCursor: Value() Char
    
    class ListCursor
    List ..> ListCursor
    ListCursor: Insert() ListElement
    ListCursor: Value() ListElement
    
    class Char
    StringCursor ..> Char

```

### Core structure

```mermaid
classDiagram
    Atom *-- AtomId
    CausalTree *-- Atom
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
      getAtom(AtomId id): Atom
      insertAtom(Atom atom, int pos)
      fork(): CausalTree
      merge(CausalTree other)
    }

    class Atom {
      AtomId id
      AtomId cause
      Value val
      int tag
      compare(Atom other): int
      remapSite(IndexMap map): Atom
      
    }

    class AtomId {
      int site
      int index
      int timestamp
      compare(AtomId other): int
      remapSite(IndexMap map): AtomId
      toString(): str
    }

    class TreePosition {
      CausalTree tree
      AtomId atomId
      lastKnownPos int
    }

    class IndexMap {
      dict map
      get(int index): int
      set(int index, int value)
    }
```
