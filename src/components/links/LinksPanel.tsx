import {
  Box,
  Card,
  CardContent,
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/material';

const EXTERNAL_LINKS = [
  {
    label: 'Stellar Gate',
    description: 'Player authentication client',
    href: '/stellar-gate/',
  },
  {
    label: 'Solaris',
    description: 'Solar system view client',
    href: '/solaris/',
  },
  {
    label: 'Terra View',
    description: 'Planetary surface client',
    href: '/terra-view/',
  },
] as const;

const LABEL_COLUMN_WIDTH = 120;

export const LinksPanel = () => {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Links
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quick access to other Infinity clients
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ py: 0, '&:last-child': { pb: 0 } }}>
          <List disablePadding>
            {EXTERNAL_LINKS.map(({ label, description, href }) => (
              <ListItem
                key={href}
                disablePadding
                sx={{ py: 1.5, display: 'flex', alignItems: 'baseline', gap: 2 }}
              >
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    typography: 'body1',
                    flexShrink: 0,
                    width: LABEL_COLUMN_WIDTH,
                  }}
                >
                  {label}
                </Link>
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};
