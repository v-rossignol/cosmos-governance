import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import { adminService } from '@services/adminService';
import type { AdminStatistics } from '@/types/admin';
import { getErrorMessage } from '@utils/helpers';

const STAT_LABELS: { key: keyof AdminStatistics; label: string }[] = [
  { key: 'users', label: 'Users' },
  { key: 'cubes', label: 'Cubes' },
  { key: 'starSystems', label: 'Star systems' },
  { key: 'planets', label: 'Planets' },
];

const VIEW_ROUTES: Partial<
  Record<keyof AdminStatistics, { to: string; buttonLabel: string }>
> = {
  users: { to: '/users', buttonLabel: 'View users' },
  starSystems: { to: '/star-systems', buttonLabel: 'View star systems' },
  planets: { to: '/planets', buttonLabel: 'View planets' },
};

export const AdminStatisticsPanel = () => {
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getStatistics();
      setStatistics(data);
    } catch (err) {
      setStatistics(null);
      setError(getErrorMessage(err, 'Unable to load server statistics'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatistics();
  }, [loadStatistics]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            Object statistics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Document counts from <code>GET /infinity/admin/statistics</code>
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => void loadStatistics()} disabled={isLoading}>
          Refresh
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && error && <Alert severity="error">{error}</Alert>}

      {!isLoading && statistics && (
        <Grid container spacing={2}>
          {STAT_LABELS.map(({ key, label }) => {
            const viewRoute = VIEW_ROUTES[key];

            return (
              <Grid item xs={12} sm={6} key={key}>
                <Card>
                  <CardContent>
                    {viewRoute ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: 1,
                        }}
                      >
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {label}
                          </Typography>
                          <Typography variant="h4" component="p">
                            {statistics[key].toLocaleString()}
                          </Typography>
                        </Box>
                        <Button
                          component={Link}
                          to={viewRoute.to}
                          variant="outlined"
                          size="small"
                          sx={{ flexShrink: 0 }}
                        >
                          {viewRoute.buttonLabel}
                        </Button>
                      </Box>
                    ) : (
                      <>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {label}
                        </Typography>
                        <Typography variant="h4" component="p">
                          {statistics[key].toLocaleString()}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};
