import { AdminStatisticsPanel } from '@components/health/AdminStatisticsPanel';
import { ServerHealthPanel } from '@components/health/ServerHealthPanel';
import { LinksPanel } from '@components/links/LinksPanel';
import { Box } from '@mui/material';

export const ServerHealthPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <ServerHealthPanel />
      <AdminStatisticsPanel />
      <LinksPanel />
    </Box>
  );
};
