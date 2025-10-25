import { ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

export interface PageHeroProps {
  title: string;
  description?: ReactNode;
  align?: 'left' | 'center';
  action?: ReactNode;
  maxDescriptionWidth?: number | string;
  sx?: SxProps<Theme>;
}

const PageHero = ({
  title,
  description,
  align = 'left',
  action,
  maxDescriptionWidth = 640,
  sx,
}: PageHeroProps) => {
  const alignment = align === 'center' ? 'center' : 'flex-start';

  return (
    <Stack
      spacing={1.5}
      alignItems={alignment}
      textAlign={align === 'center' ? 'center' : 'left'}
      sx={sx}
    >
      <Typography variant="h3" component="h1">
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: maxDescriptionWidth }}>
          {description}
        </Typography>
      )}
      {action}
    </Stack>
  );
};

export default PageHero;
