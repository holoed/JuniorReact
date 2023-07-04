// App.tsx

import React, { useState, useCallback } from 'react';
import Split from 'react-split';
import './App.css';
import CodeEditor from './components/CodeEditor';
import { js as beautify } from 'js-beautify';
import MenuBar from './components/MenuBar';
import SecondPane from './components/SecondPane';

function clearPanels() {
  const elem = document.getElementById("compiledJs");
  if (elem != null) elem.style.display = "none";

  const canvas = document.getElementById("canvas");
  if (canvas != null) {
    canvas.style.zIndex = "2";
    canvas.style.width  = '100%';
    canvas.style.height = '100%';
  }
}

async function compileTo(target: string, content: string) {
  const url = `api${target}`;

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
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

async function runJs(jsCode: string) {
    const response = await fetch("api/libJs")
    const libCodeJson = await response.text();
    const script = "(function() {\n\n" + JSON.parse(libCodeJson) + 
    "\n\n" + jsCode.replace("const main = ", "return ") + 
    "\n\n})();"
    const scriptBase64 = window.btoa(jsCode);
    const ret = eval(`const codeBase64 = "${scriptBase64}";\n\n` + script);
    return ret;
}

function App() {
  const [js, setJs] = useState('');
  const [ty, setTy] = useState('');
  const [cp, setCp] = useState('');
  const [out, setOut] = useState('');
  const onEditorChange = useCallback(async (content: any) => {
      const js = await compileTo("/compileToJs", content);
      setJs(beautify(js[0], { indent_size: 2 }));
      const ty = await compileTo("/type", content);
      setTy(ty[0]);
      const cp = await compileTo("/compile", content);
      setCp(cp[0])
      const ret = await runJs(js[0]);
      setOut(JSON.stringify(ret))
  }, []);

  return (
    <div className="container">
      <MenuBar />
      <Split sizes={[50, 50]} minSize={100} expandToMin={true} gutterSize={10} className="split">
        <div className="pane">
          <CodeEditor onChange={onEditorChange} />
        </div>
        <SecondPane js={js} ty={ty} cp={cp} out={out} />
      </Split>
    </div>
  );
}

export default App;
