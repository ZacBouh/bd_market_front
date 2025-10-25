import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import Paper, { PaperProps } from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, lighten } from '@mui/material/styles';

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
    contentSpacing = 3,
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
          gap: theme.spacing(contentSpacing + 0.5),
          padding: theme.spacing(3.5, 3, 4),
          [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(4, 5),
          },
          borderRadius: theme.shape.borderRadius * 2,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.88)
              : lighten(theme.palette.background.paper, 0.02),
          boxShadow: theme.shadows[16],
          backgroundImage:
            theme.palette.mode === 'dark'
              ? 'radial-gradient(circle at top, rgba(255,255,255,0.04), transparent 55%)'
              : 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.75))',
          backdropFilter: 'blur(6px)',
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
        <Stack spacing={contentSpacing + 0.5}>{children}</Stack>
      {actions && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2.5}
          justifyContent={{ sm: 'flex-end' }}
        >
          {actions}
        </Stack>
      )}
    </Paper>
  );
});

export default FormLayout;
