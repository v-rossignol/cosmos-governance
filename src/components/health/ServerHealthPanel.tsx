import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';
import { healthService } from '@services/healthService';
import type { ServerHealth } from '@/types/health';
import { getErrorMessage } from '@utils/helpers';

export const ServerHealthPanel = () => {
  const [health, setHealth] = useState<ServerHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadHealth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await healthService.getHealth();
      setHealth(data);
    } catch (err) {
      setHealth(null);
      setError(getErrorMessage(err, 'Unable to reach the Infinity server'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHealth();
  }, [loadHealth]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Server health
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Live status from <code>GET /infinity/health</code>
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => void loadHealth()} disabled={isLoading}>
          Refresh
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && error && <Alert severity="error">{error}</Alert>}

      {!isLoading && health && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h6">{health.name}</Typography>
              <Chip
                label={health.status}
                color={health.status === 'OK' ? 'success' : 'warning'}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Version: {health.version}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
