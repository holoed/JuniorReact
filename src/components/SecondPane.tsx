import React from 'react';
import { AppBar, Tabs, Tab, IconButton, makeStyles } from '@material-ui/core';
import TabPanel from './TabPanel';
import OutputTabPanel from './OutputPanel';

// Styles for the SecondPane component
const useStyles = makeStyles((theme) => ({
    appBar: {
      backgroundColor: '#333', // match VS Code tab color
      borderBottom: '1px solid #000', // Add this line to create a bottom border for the AppBar
      height: '20px',
      '& .MuiTabs-root': {
        minHeight: '21px',  // specify your desired height
      },
    },
    tab: {
      color: '#fff', // white text
      textTransform: 'none', // lowercase text
      fontSize: '12px', // Adjust the font size here. This matches the fontSize of the menu.
      borderBottom: '.5px solid #FFF', // Add this line to create a bottom border for non-active tabs
      borderLeft: '.5px solid #FFF',
      borderRight: '.5px solid #FFF',
      borderTop: '.5px solid #FFF',
      paddingTop: 0, // reduce top padding
      paddingBottom: 0, // reduce bottom padding
      minHeight: 0, // add this line to reduce the minimum height of the tab
    },  
    indicator: {
        top: 0, // Move the selected indicator to the top
        backgroundColor: '#f00', // Set the color of the selected indicator
    },
  })); 
  
  const SecondPane: React.FC<{ content: string }> = ({ content }) => {
    const [value, setValue] = React.useState(0);
    const classes = useStyles();
  
    const handleChange = (event: any, newValue: any) => {
      setValue(newValue);
    };
  
    return (
      <div className="pane" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <AppBar position="static" className={classes.appBar}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label={<div>Typed</div>} className={classes.tab} />
            <Tab label={<div>Compiled</div>} className={classes.tab} />
            <Tab label={<div>Js</div>} className={classes.tab} />
            <Tab label={<div>Output</div>} className={classes.tab} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} content={content} apiEndpoint="api/type" />
        <TabPanel value={value} index={1} content={content} apiEndpoint="api/compile" />
        <TabPanel value={value} index={2} content={content} apiEndpoint="api/compileToJs" />
        <OutputTabPanel value={value} index={3} content={content} apiEndpoint="api/compileToJs" />
      </div>
    );
  }
  
  export default SecondPane;
  
