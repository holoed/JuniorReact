// App.tsx

import React, { useState, useCallback } from 'react';
import Split from 'react-split';
import './App.css';
import CodeEditor from './CodeEditor';

// New component for the second pane
const SecondPane = ({ content } : any) => (
  <div className="pane">
    <h2>Pane 2</h2>
    <pre>{content}</pre>
  </div>
);

function App() {
  // define a piece of state to store the editor content
  const [editorContent, setEditorContent] = useState('');

  // this function will be called whenever the content of the editor changes
  const onEditorChange = useCallback((content: string) => {
    setEditorContent(content);
  }, []);
  
  return (
    <div className="container">
      <Split sizes={[50, 50]} minSize={100} expandToMin={true} gutterSize={10} className="split">
        <div className="pane">
          <CodeEditor onChange={onEditorChange} />
        </div>
        <SecondPane content={editorContent} />
      </Split>
    </div>
  );
}

export default App;
