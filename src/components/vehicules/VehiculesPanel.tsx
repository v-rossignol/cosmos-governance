import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { adminService } from '@services/adminService';
import type { AdminUnitType } from '@/types/admin';
import { getErrorMessage } from '@utils/helpers';

const formatSpeed = (value: number | null): string => {
  return value === null ? '—' : value.toLocaleString();
};

export const VehiculesPanel = () => {
  const [vehicules, setVehicules] = useState<AdminUnitType[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadVehicules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getVehicules();
      setVehicules(data.items);
      setTotal(data.total);
    } catch (err) {
      setVehicules([]);
      setTotal(0);
      setError(getErrorMessage(err, 'Unable to load vehicules'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVehicules();
  }, [loadVehicules]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Vehicules
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Unit types from <code>GET /infinity/admin/units/vehicules</code>
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => void loadVehicules()} disabled={isLoading}>
          Refresh
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && error && <Alert severity="error">{error}</Alert>}

      {!isLoading && !error && total === 0 && (
        <Alert severity="info">No vehicules found in the catalog.</Alert>
      )}

      {!isLoading && !error && total > 0 && (
        <Card>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell align="right">Speed</TableCell>
                  <TableCell>Environments</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicules.map((vehicule) => (
                  <TableRow key={vehicule.id} hover>
                    <TableCell>
                      <Link component={RouterLink} to={`/vehicules/${vehicule.id}`}>
                        {vehicule.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Chip label={vehicule.size} size="small" />
                    </TableCell>
                    <TableCell align="right">{formatSpeed(vehicule.speed)}</TableCell>
                    <TableCell>{vehicule.environments.join(', ')}</TableCell>
                    <TableCell>{vehicule.description ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {total.toLocaleString()} vehicule{total === 1 ? '' : 's'} in catalog
            </Typography>
          </Box>
        </Card>
      )}
    </Box>
  );
};
