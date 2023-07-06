import React, { useEffect, useRef, useState } from 'react';
import { basicSetup } from '@codemirror/basic-setup';
import { EditorState, Transaction } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import {syntaxTree, StreamLanguage} from "@codemirror/language"
import {haskell} from "@codemirror/legacy-modes/mode/haskell"

import {Tooltip, hoverTooltip} from "@codemirror/view"

var dictionary: any = {}

export const wordHover = hoverTooltip((view, pos, side) => {
  let line = view.state.doc.lineAt(pos);
  let tree = syntaxTree(view.state)
  let node = tree.resolve(pos, side)
  console.log(JSON.stringify({ x: node.from, y: node.to}));
  let text = view.state.doc.sliceString(node.from, node.to);
  console.log(JSON.stringify({ line: line.number, start: node.from - line.from + 1, length: node.to - node.from, text: text }));
  const key = "(" + line.number + "," + (node.from - line.from + 1) + "," + (node.to - node.from) + "," + text + ")"; 
  const ret = dictionary[key];   
  return {
    pos: node.from,
    end: node.to,
    above: true,
    create(view) {
      let dom = document.createElement("div");
      dom.textContent = ret ? ret.ty : '';
      // Add style to the tooltip
      dom.style.padding = "5px";
      dom.style.backgroundColor = "#333842"; // VSCode's tooltip background color
      dom.style.color = "#ffffff"; // VSCode's tooltip text color
      dom.style.borderRadius = "5px";
      dom.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.5)";
      dom.style.fontFamily = "'Courier New', monospace"; // monospace font for tooltip
      dom.style.fontSize = "12px"; // reduce font size
      
      return {dom}
    }
  }
})

interface CodeEditorProps {
  onChange?: (content: string) => void;
}

function CodeEditor({ onChange }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  async function updateTypes(code: string) {
    const response = await  fetch("api/type", {
      method: 'POST', 
      headers: {
        'Content-Type': 'text/plain',
      }, 
      body: code, 
    })
  
    if (response.ok) {
      const typesData = await response.json();
      dictionary = {};
      typesData[1].forEach((sym: any) => {
            dictionary["(" +
                       sym.name.loc.line + "," + 
                       sym.name.loc.column + "," + 
                       sym.name.loc.len + "," +
                       sym.name.txt + 
                       ")"] = sym;
                    });   
    }
  }

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: '',
      extensions: [
        basicSetup,
        keymap.of(defaultKeymap),
        oneDark,
        StreamLanguage.define(haskell),
        EditorView.updateListener.of(async (update) => {
          if (update.docChanged && onChange) {
            const code = update.state.doc.toString()
            await updateTypes(code);
            onChange(code);
          }
        }),
        wordHover
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    return () => {
      view.destroy();
    };
  }, [onChange]);

  return (
    <div
      ref={editorRef}
      className="cm-editor"
      style={{
        height: 'calc(100vh - 34px)',
        overflow: 'scroll',
        display: 'grid',
        backgroundColor: '#282c34', /* oneDark background color */
      }}
    />
  );
}

export default CodeEditor;
