import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import Paper, { PaperProps } from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

type FormLayoutProps = PaperProps<'form'> & {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  contentSpacing?: number;
};

const FormLayout = forwardRef<HTMLFormElement, FormLayoutProps>(function FormLayout(
  props,
  ref,
) {
  const {
    title,
    description,
    actions,
    children,
    contentSpacing = 2.5,
    component,
    sx,
    ...rest
  } = props;

  const resolvedSx = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return (
    <Paper
      ref={ref}
      component={component ?? 'form'}
      elevation={0}
      sx={[
        (theme) => ({
          width: '100%',
          maxWidth: 640,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(contentSpacing),
          padding: theme.spacing(3),
          [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(4),
          },
          borderRadius: theme.shape.borderRadius * 2,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${alpha(theme.palette.divider, 0.24)}`,
          boxShadow: theme.shadows[8],
        }),
        ...resolvedSx,
      ]}
      {...rest}
    >
      {(title || description) && (
        <Stack spacing={1}>
          {typeof title === 'string' ? (
            <Typography variant="h5">{title}</Typography>
          ) : (
            title
          )}
          {typeof description === 'string' ? (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          ) : (
            description
          )}
        </Stack>
      )}
      <Stack spacing={contentSpacing}>{children}</Stack>
      {actions && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent={{ sm: 'flex-end' }}
        >
          {actions}
        </Stack>
      )}
    </Paper>
  );
});

export default FormLayout;
