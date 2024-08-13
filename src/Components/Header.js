import React from 'react';
import { AppBar, Toolbar, Typography, Avatar } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="sticky" className="bg-gradient-to-r from-blue-600 to-indigo-800">
      <Toolbar className="justify-between">
        <Typography variant="h5" component="h1" className="font-bold tracking-wide">
          User Dashboard
        </Typography>
        <Avatar alt="User Avatar" src="/path-to-avatar-image.jpg" className="cursor-pointer" />
      </Toolbar>
    </AppBar>
  );
};

export default Header;