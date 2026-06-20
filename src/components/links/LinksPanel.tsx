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
    links: [
      { text: 'Player authentication client', href: '/stellar-gate/' },
    ],
  },
  {
    label: 'Solaris',
    links: [
      { text: 'Solar system view client', href: '/solaris/' },
    ],
  },
  {
    label: 'Terra View',
    links: [
      { text: 'Planetary surface client', href: '/terra-view/' },
      { text: 'Planet surface Modeler', href: '/terra-view/modeler/' },
    ],
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
            {EXTERNAL_LINKS.map(({ label, links }) => (
              <ListItem
                key={label}
                disablePadding
                sx={{ py: 1.5, display: 'flex', alignItems: 'baseline', gap: 2 }}
              >
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ flexShrink: 0, width: LABEL_COLUMN_WIDTH }}
                >
                  {label}
                </Typography>
                <Box
                  component="span"
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'baseline',
                    columnGap: 1.5,
                    rowGap: 0.5,
                  }}
                >
                  {links.map(({ text, href }, index) => (
                    <Box
                      key={href}
                      component="span"
                      sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 1.5 }}
                    >
                      {index > 0 && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.disabled"
                          aria-hidden
                        >
                          ·
                        </Typography>
                      )}
                      <Link
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ typography: 'body2', color: 'text.secondary' }}
                      >
                        {text}
                      </Link>
                    </Box>
                  ))}
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};
