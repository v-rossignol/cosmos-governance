import { Box } from '@mui/material';
import cosmosGovernanceBg from '@/assets/images/cosmos-governance-1.avif';

export const PageBackground = () => (
  <Box
    aria-hidden
    sx={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      backgroundImage: `url(${cosmosGovernanceBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: (theme) =>
          `linear-gradient(
            180deg,
            ${theme.palette.background.default}cc 0%,
            ${theme.palette.background.default}e6 100%
          )`,
      },
    }}
  />
);
