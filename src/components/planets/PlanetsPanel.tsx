import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { adminService } from '@services/adminService';
import type { AdminPlanetSummary, PlanetType } from '@/types/admin';
import { getErrorMessage } from '@utils/helpers';

const PAGE_SIZE_OPTIONS = [10, 20, 100] as const;
const DEFAULT_PAGE_SIZE = 20;

const PLANET_TYPE_COLORS: Record<PlanetType, 'default' | 'primary' | 'info' | 'warning'> = {
  rocky: 'default',
  gas: 'info',
  ice: 'primary',
  lava: 'warning',
};

const formatCreatedAt = (value: string): string => {
  return new Date(value).toLocaleString();
};

export const PlanetsPanel = () => {
  const [planets, setPlanets] = useState<AdminPlanetSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  const loadPlanets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminService.getPlanets({ page, count: pageSize });
      setPlanets(data.items);
      setTotal(data.total);
    } catch (err) {
      setPlanets([]);
      setTotal(0);
      setError(getErrorMessage(err, 'Unable to load planets'));
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    void loadPlanets();
  }, [loadPlanets]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Planets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Defined planets from <code>GET /infinity/admin/planets</code>
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => void loadPlanets()} disabled={isLoading}>
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
        <Alert severity="info">No planets found.</Alert>
      )}

      {!isLoading && !error && total > 0 && (
        <Card>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Star system</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Radius</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {planets.map((planet) => (
                  <TableRow key={planet._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Link
                          href={`/terra-view/${planet._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${planet.name} in Terra View`}
                          underline="none"
                          sx={{
                            fontSize: '1.1rem',
                            lineHeight: 1,
                            flexShrink: 0,
                            cursor: 'pointer',
                            '&:hover': { opacity: 0.8 },
                          }}
                        >
                          🚀
                        </Link>
                        {planet.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {planet.starSystemId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={planet.type}
                        size="small"
                        color={PLANET_TYPE_COLORS[planet.type]}
                      />
                    </TableCell>
                    <TableCell align="right">{planet.radius}</TableCell>
                    <TableCell>{formatCreatedAt(planet.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              px: 2,
              py: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                {rangeStart}–{rangeEnd} of {total.toLocaleString()} planets
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="planets-page-size-label">Per page</InputLabel>
                <Select
                  labelId="planets-page-size-label"
                  value={pageSize}
                  label="Per page"
                  onChange={handlePageSizeChange}
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="small"
              showFirstButton
              showLastButton
            />
          </Box>
        </Card>
      )}
    </Box>
  );
};
