import React from 'react';
import { AppBar, Toolbar, Typography, MenuList, MenuItem, Popover } from '@material-ui/core';

export default function MenuBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event : any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const appBarStyle = {
    backgroundColor: '#333', // Change to desired color
    height: '30px', // Adjust based on preference
  };

  const toolbarStyle = {
    minHeight: '30px', // This ensures the toolbar is only 30px tall
  };

  const typographyStyle = {
    fontSize: '12px', // Adjust based on preference
    marginRight: '15px',
    cursor: 'pointer',
    lineHeight: '30px', // Centers the text vertically
  };

  return (
    <AppBar position="static" style={appBarStyle}>
      <Toolbar style={toolbarStyle}>
        <Typography 
          variant="h6" 
          onClick={handleClick}
          style={typographyStyle}
        >
          File
        </Typography>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <MenuList>
            <MenuItem onClick={handleClose}>New File</MenuItem>
            <MenuItem onClick={handleClose}>Open File</MenuItem>
            <MenuItem onClick={handleClose}>Save File</MenuItem>
          </MenuList>
        </Popover>
        <Typography variant="h6" style={typographyStyle}>
          Edit
        </Typography>
        {/* Repeat for additional top bar items */}
      </Toolbar>
    </AppBar>
  );
}
