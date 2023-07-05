import React, { useEffect, useState }  from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';

function clearPanels() {
  const elem = document.getElementById("compiledJs");
  if (elem != null) elem.style.display = "none";

  const canvas = document.getElementById("canvas");
  if (canvas != null) {
    canvas.style.zIndex = "2";
    canvas.style.width  = '100%';
    canvas.style.height = '100%';
  }
  const plotlyChart = document.getElementById("plotlyChart");
  if (plotlyChart != null) {
    plotlyChart.style.width  = '100%';
    plotlyChart.style.height = '100%';
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

const useStyles = makeStyles((theme) => ({
  scrollableContent: {
    width: '100%', // take up full width
    maxHeight: 'calc(100vh - 64px)', // or the height you prefer
    overflowY: 'auto', // vertical scrolling
    overflowX: 'hidden', // no horizontal scrolling
  },
  panel: {
    flex: 1,
    overflow: 'auto', // to enable scrolling if content overflows
  },
}));


interface TabPanelProps {
  content: string;
  value: number;
  index: number;
  apiEndpoint: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ content, value, index, apiEndpoint }) => {
  const classes = useStyles();
  const [tabContent, setTabContent] = useState('');
  
  useEffect(() => {
    if (value === index) {
      fetch(apiEndpoint, {
        method: 'POST', 
        headers: {
          'Content-Type': 'text/plain',
        }, 
        body: content, 
      }).then(res => res.json())
      .then(result => setTabContent(result[0]));
    }
  }, [value, index, content, apiEndpoint]);

  return (
    <div role="tabpanel" hidden={value !== index} className={classes.panel}>
      {value === index && (
        <Box p={2} className={classes.scrollableContent}> {/* added padding here */}
          <Typography><pre>{tabContent}</pre></Typography>
        </Box>
      )}
    </div>
  );
}

export default TabPanel;
