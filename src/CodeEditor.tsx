import React from 'react';
import { useEffect, useRef } from 'react';
import { basicSetup } from '@codemirror/basic-setup';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';

function CodeEditor() {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!editorRef.current) return;

        const startState = EditorState.create({
            doc: '// type your code here...',
            extensions: [basicSetup, keymap.of(defaultKeymap), oneDark],
        });

        const view = new EditorView({
            state: startState,
            parent: editorRef.current,
        });

        return () => {
            view.destroy();
        };
    }, []);

    return <div ref={editorRef} 
                className="cm-editor" 
                style={{ 
                  height: '100%', 
                  display: 'grid', 
                  backgroundColor: '#282c34' /* oneDark background color */ 
                }} />;
}

export default CodeEditor;
