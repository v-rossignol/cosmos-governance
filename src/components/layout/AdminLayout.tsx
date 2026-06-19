import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import { useAuthStore } from '@stores/authStore';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" component="div">
            Cosmos Governance
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
            <Button
              component={NavLink}
              to="/health"
              color="inherit"
              sx={{
                '&.active': { color: 'primary.main' },
              }}
            >
              Server health
            </Button>
            <Button
              component={NavLink}
              to="/users"
              color="inherit"
              sx={{
                '&.active': { color: 'primary.main' },
              }}
            >
              Users
            </Button>
            <Button
              component={NavLink}
              to="/star-systems"
              color="inherit"
              sx={{
                '&.active': { color: 'primary.main' },
              }}
            >
              Star systems
            </Button>
            <Button
              component={NavLink}
              to="/planets"
              color="inherit"
              sx={{
                '&.active': { color: 'primary.main' },
              }}
            >
              Planets
            </Button>
          </Box>
          {user && (
            <Typography variant="body2" color="text.secondary">
              {user.username}
            </Typography>
          )}
          <Button variant="outlined" onClick={() => void handleLogout()} disabled={isLoading}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};
