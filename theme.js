import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d0b1f', // Main background
      paper: '#181424',   // Card/panel background
    },
    primary: {
      main: '#8b5cf6', // Purple (e.g., for buttons)
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057', // Pink for accents if needed
    },
    success: {
      main: '#22c55e', // Bright green
    },
    error: {
      main: '#ef4444', // Red for losses or negative changes
    },
    warning: {
      main: '#facc15', // Yellow-ish highlight (not heavily used here)
    },
    info: {
      main: '#3b82f6', // Blue tones (for things like order fills)
    },
    text: {
      primary: '#f5f5f5', // Main text
      secondary: '#a1a1aa', // Muted text
      disabled: '#6b7280',  // Even more muted
    },
    divider: 'rgba(255, 255, 255, 0.1)', // Thin separators
  },
});
