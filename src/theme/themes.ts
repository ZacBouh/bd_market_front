import { ThemeOptions, alpha } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

import { ThemeMode } from './types';

const sharedTheme: ThemeOptions = {
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiModal: {
      defaultProps: {
        closeAfterTransition: true,
        keepMounted: false,
      },
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        backdrop: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.common.black, 0.6),
          backdropFilter: 'blur(4px)',
        }),
      },
    },
    MuiDialog: {
      defaultProps: {
        PaperProps: {
          elevation: 0,
        },
      },
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
          borderRadius: theme.shape.borderRadius * 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.24)}`,
          boxShadow: theme.shadows[24],
        }),
        paperFullWidth: ({ theme }) => ({
          margin: theme.spacing(2),
        }),
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: 600,
          paddingBottom: theme.spacing(1),
        }),
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingTop: theme.spacing(1.5),
          paddingBottom: theme.spacing(2),
        }),
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(0, 3, 3),
          gap: theme.spacing(1.5),
          flexWrap: 'wrap',
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        vertical: {
          marginRight: 10,
          marginLeft: 10,
        },
      },
    },
  },
  custom: {
    sideMenuWidth: 240
  }
};

// to explore all the options, check out https://mui.com/material-ui/customization/default-theme/
const themes: Record<ThemeMode, ThemeOptions> = {
  light: deepmerge(sharedTheme, {
    palette: {
      mode: 'light',
      background: {
        default: '#fafafa',
        paper: '#fff',
      },
    },
  }),

  dark: deepmerge(sharedTheme, {
    palette: {
      mode: 'dark',
      background: {
        default: '#0d0b1f',
        paper: '#181424',
      },
    },
  }),
};

export default themes;
