import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { adminService } from '@services/adminService';
import { VehiculeImage } from '@components/vehicules/VehiculeImage';
import type { AdminUnitType } from '@/types/admin';
import { getErrorMessage, getVehiculeImageUrl } from '@utils/helpers';

const FIELD_ORDER: (keyof AdminUnitType)[] = [
  'id',
  'name',
  'type',
  'size',
  'mobility',
  'speed',
  'environments',
  'rules',
  'capabilities',
  'description',
  'metadata',
  'createdAt',
  'updatedAt',
];

const FIELD_LABELS: Record<keyof AdminUnitType, string> = {
  id: 'ID',
  name: 'Name',
  type: 'Type',
  size: 'Size',
  mobility: 'Mobility',
  speed: 'Speed',
  environments: 'Environments',
  rules: 'Rules',
  capabilities: 'Capabilities',
  description: 'Description',
  metadata: 'Metadata',
  createdAt: 'Created',
  updatedAt: 'Updated',
};

const formatFieldValue = (
  key: keyof AdminUnitType,
  value: AdminUnitType[keyof AdminUnitType],
): string => {
  if (value === null) {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (key === 'createdAt' || key === 'updatedAt') {
    return new Date(String(value)).toLocaleString();
  }

  if (Array.isArray(value) || typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
};

const isMultilineValue = (value: AdminUnitType[keyof AdminUnitType]): boolean => {
  return Array.isArray(value) || (typeof value === 'object' && value !== null);
};

export const VehiculeDetailPanel = () => {
  const { vehiculeId } = useParams<{ vehiculeId: string }>();
  const [vehicule, setVehicule] = useState<AdminUnitType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadVehicule = useCallback(async () => {
    if (!vehiculeId) {
      setVehicule(null);
      setError('Missing vehicule id.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getVehicule(vehiculeId);
      if (!data) {
        setVehicule(null);
        setError(`Vehicule "${vehiculeId}" was not found in the catalog.`);
        return;
      }
      setVehicule(data);
    } catch (err) {
      setVehicule(null);
      setError(getErrorMessage(err, 'Unable to load vehicule'));
    } finally {
      setIsLoading(false);
    }
  }, [vehiculeId]);

  useEffect(() => {
    void loadVehicule();
  }, [loadVehicule]);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {vehicule?.name ?? 'Vehicule'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Catalog entry from{' '}
            <code>GET /infinity/admin/units/vehicules/{vehiculeId ?? ':vehiculeId'}</code>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={RouterLink} to="/vehicules" variant="outlined">
            Back to list
          </Button>
          <Button variant="outlined" onClick={() => void loadVehicule()} disabled={isLoading}>
            Refresh
          </Button>
        </Box>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && error && <Alert severity="error">{error}</Alert>}

      {!isLoading && vehicule && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Card sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 3,
              }}
            >
              <VehiculeImage vehiculeId={vehicule.id} alt={vehicule.name} />
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Image from <code>{getVehiculeImageUrl(vehicule.id)}</code>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {vehicule.description ?? 'No description.'}
                </Typography>
              </Box>
            </Box>
          </Card>

          <Card>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {FIELD_ORDER.map((key) => {
                    const value = vehicule[key];
                    const formattedValue = formatFieldValue(key, value);

                    return (
                      <TableRow key={key}>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ width: '25%', fontWeight: 600, verticalAlign: 'top' }}
                        >
                          {FIELD_LABELS[key]}
                        </TableCell>
                        <TableCell
                          sx={{
                            verticalAlign: 'top',
                            ...(isMultilineValue(value)
                              ? {
                                  fontFamily: 'monospace',
                                  fontSize: '0.85rem',
                                  whiteSpace: 'pre-wrap',
                                }
                              : {}),
                          }}
                        >
                          {formattedValue}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>
      )}

      {!isLoading && !vehicule && !error && (
        <Alert severity="info">
          <Link component={RouterLink} to="/vehicules">
            Return to the vehicules list
          </Link>
        </Alert>
      )}
    </Box>
  );
};
