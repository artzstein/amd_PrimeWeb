import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { AuthContext } from '../App';

function Navigation() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/dashboard')}
        >
          📊 Analytics Platform
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ textTransform: 'none' }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/datasets')}
            sx={{ textTransform: 'none' }}
          >
            Datasets
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/dashboard-builder')}
            sx={{ textTransform: 'none' }}
          >
            Build
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/analytics')}
            sx={{ textTransform: 'none' }}
          >
            Analytics
          </Button>

          <Box sx={{ ml: 2 }}>
            <Avatar
              sx={{ cursor: 'pointer' }}
              onClick={handleMenuOpen}
            >
              {auth?.user?.name[0]}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>
                {auth?.user?.email}
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
