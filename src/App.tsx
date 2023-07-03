// App.tsx

import React from 'react';
import Split from 'react-split';
import './App.css';
import CodeEditor from './CodeEditor';

function App() {
  return (
    <div className="container">
      <Split sizes={[50, 50]} minSize={100} expandToMin={true} gutterSize={10} className="split">
        <div className="pane">
          <CodeEditor/>
        </div>
        <div className="pane">
          <h2>Pane 2</h2>
          <p>This is the second pane</p>
        </div>
      </Split>
    </div>
  );
}

export default App;
