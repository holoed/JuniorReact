import React, { useEffect, useRef } from 'react';
import { basicSetup } from '@codemirror/basic-setup';
import { EditorState, StateField, StateEffect } from '@codemirror/state';
import { EditorView, keymap, Decoration, hoverTooltip, DecorationSet } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import {syntaxTree, StreamLanguage} from "@codemirror/language"
import {haskell} from "@codemirror/legacy-modes/mode/haskell"
import { Diagnostic, setDiagnostics } from '@codemirror/lint';

var dictionary: any = {}

const tooltipTheme = EditorView.theme({
  ".cm-tooltip-lint": {
    backgroundColor: "#333842", // VSCode's tooltip background color
    padding: "0px",
    color: "#ffffff", // VSCode's tooltip text color
    borderRadius: "0px",
    boxShadow: "2px 2px 10px rgba(0,0,0,0.5)",
    fontFamily: "'Courier New', monospace", // monospace font for tooltip
    fontSize: "12px", // reduce font size
  },
  ".cm-tooltip-section": {
    border: "0px",
    padding: "0px 3px 3px 3px",
  },
  ".cm-diagnostic-error": {
    border: "0px",
    padding: "0px 3px 3px 3px",
  },
});

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
  const viewRef = useRef<EditorView | null>(null);

  async function updateTypes(code: string) {
    const response = await  fetch("api/type", {
      method: 'POST', 
      headers: {
        'Content-Type': 'text/plain',
      }, 
      body: code, 
    })
  
    if (response.ok) {
      const json = await response.json();
      let view = viewRef.current!;
      dictionary = {};
      if (json[1] != undefined && Array.isArray(json[1])) {
        const obj = json[1];
        dictionary = {};
        obj.forEach(sym => {
            dictionary["(" +
                       sym.name.loc.line + "," + 
                       sym.name.loc.column + "," + 
                       sym.name.loc.len + "," +
                       sym.name.txt + 
                       ")"] = sym;
        }); 
        view.dispatch(setDiagnostics(view.state, []));  
      } else {
          const obj = json;
          const loc = obj.loc;
          if (loc != null) {
            const from = { line: loc.line, ch: loc.column };
            const to = { line: loc.line, ch: loc.column + loc.len - 1 };        
            
            // Get the Text object of the document
            const docText = view.state.doc;

            // Calculate the absolute position
            // Remember that the line method expects a 0-based line number
            const startPos: number = docText.line(from.line).from + from.ch;
            const endPos: number = docText.line(to.line).from + to.ch;

            const diagnostics: Diagnostic[] = [];

            diagnostics.push({
              from: startPos - 1,
              to: endPos,
              severity: 'error',  // or 'warning', 'info', 'hint'
              message: obj.txt,
            });
            
            // Attach diagnostics to the document
            view.dispatch(setDiagnostics(view.state, diagnostics));
          }
      }
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
        wordHover,
        tooltipTheme
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    // Store the EditorView instance in the ref
    viewRef.current = view;

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
