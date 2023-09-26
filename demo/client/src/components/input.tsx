'use client'

import React, { useState, useRef, useEffect } from 'react';
import { CausalTree } from '../../../../dist';
import { Button } from './ui/button';
import type { StrCursor } from '../../../../dist/api/Str';

function TextEditor() {
  const [causalTree, _] = useState(new CausalTree());
  const [ctCursor, setCtCursor] = useState<StrCursor | null>(null);
  const inputRef = useRef<any>(null);
  const previousTextRef = useRef('');
  const previousCursorPosRef = useRef(0);

  useEffect(() => {
    // Initializes causal tree
    const cur = causalTree.setString().getCursor();
    setCtCursor(cur);
  }, [causalTree]);
  

  const handleTextChange = (e: any) => {
    const newText: string = e.target.value;
    const selectionStart = e.target.selectionStart;

    // Check for added or removed characters
    if (newText.length > previousTextRef.current.length) {
      // Character added
      const addedCharacter = newText.charAt(selectionStart - 1);
      console.log(`Added character: ${addedCharacter} at position ${selectionStart - 1}`);
      
      // Adds equivalent CT operation
      if (selectionStart !== previousCursorPosRef.current + 1) {
        console.log('moving cursor');
        console.log(`selectionStart: ${selectionStart}, cursorPosition: ${previousCursorPosRef.current}`);
        ctCursor?.index(selectionStart - 2);
      }
      ctCursor?.insert(addedCharacter);
    } else if (newText.length < previousTextRef.current.length) {
      // Character removed
      const removedCharacter = previousTextRef.current.charAt(selectionStart);
      console.log(`Removed character: ${removedCharacter} at position ${selectionStart}`);
      
      // Adds equivalent CT operation
      if (selectionStart !== previousCursorPosRef.current - 1) {
        console.log('moving cursor');
        console.log(`selectionStart: ${selectionStart}, cursorPosition: ${previousCursorPosRef.current}`);
        ctCursor?.index(selectionStart);
      }
      ctCursor?.delete();
    }
    
    console.log('ct', causalTree.toString())

    previousTextRef.current = newText;
    previousCursorPosRef.current = selectionStart;
  };

  // TODO: implement sync
  const handleSync = () => {
    console.log('dump', causalTree.dumpWeave());
  }

  return (
    <div>
      <textarea
        className="w-full border border-transparent focus:border resize-none bg-yellow-100 text-yellow-950"
        ref={inputRef}
        onChange={handleTextChange}
        placeholder="Write your note here..."
      />
      <Button 
        className="justify-start text-yellow-900" 
        variant="ghost"
        onClick={handleSync}
        >
        <span>Sync</span>
      </Button>
    </div>
  );
}

export default TextEditor;