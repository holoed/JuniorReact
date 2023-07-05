// App.tsx

import React, { useState, useCallback } from 'react';
import Split from 'react-split';
import './App.css';
import CodeEditor from './components/CodeEditor';
import MenuBar from './components/MenuBar';
import SecondPane from './components/SecondPane';

function App() {
  const [content, setContent] = useState('');

  const onEditorChange = useCallback((newContent) => {
    setContent(newContent);
  }, []);

  return (
    <div className="container">
      <MenuBar />
      <Split sizes={[50, 50]} minSize={100} expandToMin={true} gutterSize={10} className="split">
        <div className="pane">
          <CodeEditor onChange={onEditorChange} />
        </div>
        <SecondPane content={content} />
      </Split>
    </div>
  );
}

export default App;
