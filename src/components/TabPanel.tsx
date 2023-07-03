import React from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

const useStyles = makeStyles((theme) => ({
  scrollableContent: {
    maxHeight: 'calc(100vh - 64px)', // or the height you prefer
    overflowY: 'auto', // enables vertical scrolling
  },
}));


const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  const classes = useStyles();
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
    >
      {value === index && (
        <Box p={0}>
          <Typography>
            <div className={classes.scrollableContent}>{children}</div>
          </Typography>
        </Box>
      )}
    </div>
  );
}

export default TabPanel;
