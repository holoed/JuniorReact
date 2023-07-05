import { useEffect, useState, useRef } from 'react';
import { EditorState, basicSetup } from '@codemirror/basic-setup';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import { StreamLanguage } from "@codemirror/language";
import { haskell } from "@codemirror/legacy-modes/mode/haskell";
import { js as beautify } from 'js-beautify';

interface TabPanelProps {
  content: string;
  value: number;
  index: number;
  apiEndpoint: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ content, value, index, apiEndpoint }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [tabContent, setTabContent] = useState('');

  useEffect(() => {
    fetch(apiEndpoint, {
      method: 'POST', 
      headers: {
        'Content-Type': 'text/plain',
      }, 
      body: content, 
    }).then(res => res.json())
    .then(result => setTabContent(index == 2 ? beautify(result[0]) : result[0]));
  }, [value, index, content, apiEndpoint]);

  useEffect(() => {
    if (!editorRef.current || value !== index) return;

    const startState = EditorState.create({
      doc: tabContent,
      extensions: [
        basicSetup,
        oneDark,
        StreamLanguage.define(haskell),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    return () => {
      view.destroy();
    };
  }, [tabContent, index, value]);

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <div ref={editorRef} className="cm-editor" style={{
          height: 'calc(100vh - 64px)',
          overflow: 'scroll',
          display: 'grid',
          backgroundColor: '#282c34', /* oneDark background color */
        }} />
      )}
    </div>
  );
}

export default TabPanel;
