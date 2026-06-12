import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ce93d8',
    },
    background: {
      default: '#0a0a0f',
      paper: '#15151f',
    },
  },
});

export default theme;
