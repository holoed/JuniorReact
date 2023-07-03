// App.tsx

import React, { useState, useCallback } from 'react';
import Split from 'react-split';
import './App.css';
import CodeEditor from './CodeEditor';
import { js as beautify } from 'js-beautify';
import MenuBar from './MenuBar';
import SecondPane from './SecondPane';

function App() {
  const [output, setOutput] = useState('');

  const onEditorChange = useCallback(async (content: any) => {
    const url = "http://localhost:5173/api/compileToJs";

    try {
      const response = await fetch(url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'text/plain',
        },
        body: content,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setOutput(beautify(data[0], { indent_size: 2 }));
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }, []);

  return (
    <div className="container">
      <MenuBar />
      <Split sizes={[50, 50]} minSize={100} expandToMin={true} gutterSize={10} className="split">
        <div className="pane">
          <CodeEditor onChange={onEditorChange} />
        </div>
        <SecondPane content={output} />
      </Split>
    </div>
  );
}

export default App;
