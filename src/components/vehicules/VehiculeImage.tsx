import { useState } from 'react';
import { Box } from '@mui/material';
import { getVehiculeImageUrl } from '@utils/helpers';

interface VehiculeImageProps {
  vehiculeId: string;
  alt: string;
  variant?: 'large';
  maxWidth?: number | string;
}

export const VehiculeImage = ({
  vehiculeId,
  alt,
  variant = 'large',
  maxWidth = 320,
}: VehiculeImageProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

  return (
    <Box
      component="img"
      src={getVehiculeImageUrl(vehiculeId, variant)}
      alt={alt}
      onError={() => setHasError(true)}
      sx={{
        display: 'block',
        maxWidth,
        maxHeight: 300,
        width: 'auto',
        height: 'auto',
      }}
    />
  );
};
