import React from 'react';
import { AppBar, Toolbar, Typography, MenuList, MenuItem, Popover, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#333',
  },
  toolbar: {
    minHeight: '25px',
  },
  menuText: {
    fontSize: '14px',
    color: '#bbb',
    marginRight: '15px',
    cursor: 'pointer',
    '&:hover': {
      color: '#fff',
    },
  },
  popOver: {
    marginTop: theme.spacing(1),
  },
  menuList: {
    backgroundColor: '#333',
    width: '200px',
  },
  menuItem: {
    fontSize: '14px',
    color: '#bbb',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#555',
    },
  },
}));

export default function MenuBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (menuName) => (event) => {
    setAnchorEl({anchor: event.currentTarget, menu: menuName});
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const menus = {
    'File': ['New File', 'Open File', 'Save File'],
    'Edit': ['Undo', 'Redo', 'Cut', 'Copy', 'Paste'],
    'View': ['Toggle Full Screen', 'Zoom In', 'Zoom Out'],
    'Run': ['Start Debugging', 'Stop Debugging', 'Restart Debugging'],
    'Help': ['Welcome', 'Interactive Playground', 'Documentation'],
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {Object.keys(menus).map((menuName) => (
          <React.Fragment key={menuName}>
            <Typography variant="h6" onClick={handleClick(menuName)} className={classes.menuText}>
              {menuName}
            </Typography>
            <Popover
              open={open && anchorEl?.menu === menuName}
              anchorEl={anchorEl?.anchor}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
              transformOrigin={{ vertical: 'top', horizontal: 'left', }}
            >
              <MenuList className={classes.menuList}>
                {menus[menuName].map((item) => (
                  <MenuItem onClick={handleClose} className={classes.menuItem} key={item}>
                    {item}
                  </MenuItem>
                ))}
              </MenuList>
            </Popover>
          </React.Fragment>
        ))}
      </Toolbar>
    </AppBar>
  );
}
