'use client'

import React, { useState, useRef, useEffect } from 'react';
import { CausalTree } from '../../../../dist';
import { Button } from './ui/button';
import type { StrCursor } from '../../../../dist/api/Str';

const SERVER_URL = 'http://localhost:9000';

const forkFromRemote = async () => {
  const response = await fetch(`${SERVER_URL}/fork`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  const { content } = await response.json();
  return content;
}

const syncToRemote = async (str: string) => {
  const response = await fetch(`${SERVER_URL}/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: str,
    })
  });

  const { content } = await response.json();
  return content;
}

function TextEditor() {
  const [causalTree, _] = useState<CausalTree>(new CausalTree());
  const [ctCursor, setCtCursor] = useState<StrCursor | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<any>(null);
  const previousTextRef = useRef('');
  const previousCursorPosRef = useRef(0);

  useEffect(() => {    
    // Initializes causal tree
    setLoading(true);
    forkFromRemote()
      .then((fork) => {
        causalTree.unmarshallInplace(fork);
        const value = causalTree.value();
        const cur = 
          value === null
            ? causalTree.setString().getCursor()
            : causalTree.getStrCursor()
        setCtCursor(cur);
        if (value !== null) {
          const text = value.snapshot();
          inputRef.current.value = text;
          previousTextRef.current = text;
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  const handleTextChange = (e: any) => {
    const newText: string = e.target.value;
    const selectionStart: number = e.target.selectionStart;

    if (ctCursor === null) throw new Error('Cursor is null');

    // Check for added or removed characters
    if (newText.length > previousTextRef.current.length) {
      const addedCharacter = newText.charAt(selectionStart - 1);

      if (selectionStart !== previousCursorPosRef.current + 1) {
        // Move cursor to the correct position
        ctCursor.index(selectionStart - 2);
      }

      ctCursor.insert(addedCharacter);
    } else if (newText.length < previousTextRef.current.length) {
      const removedCharacter = previousTextRef.current.charAt(selectionStart);

      if (selectionStart !== previousCursorPosRef.current - 1) {
        // Move cursor to the correct position
        ctCursor.index(selectionStart);
      }

      ctCursor.delete();
    }

    previousTextRef.current = newText;
    previousCursorPosRef.current = selectionStart;
  };

  const handleSync = () => {
    setLoading(true);
    console.log(causalTree.dumpWeave());
    const str = causalTree.marshall();
    if (!str) return;

    syncToRemote(str)
      .then((content) => {
        causalTree.mergeString(content);
        const text = causalTree.value().snapshot();
        inputRef.current.value = text;
        previousTextRef.current = text;
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div>
      <textarea
        className="w-full border border-transparent focus:border resize-none bg-yellow-100 text-yellow-950"
        ref={inputRef}
        onChange={handleTextChange}
        placeholder="Write your note here..."
        disabled={loading}
      />
      <Button
        className="justify-start text-yellow-900"
        variant="ghost"
        onClick={handleSync}
        disabled={loading}
      >
        <span>Sync</span>
      </Button>
    </div>
  );
}

export default TextEditor;
