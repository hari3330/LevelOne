// ARISE — Material Design 3 theme
// Built on MUI's theming API, tuned to feel like an M3 / modern Google surface:
// large rounded cards, soft elevation, generous touch targets, calm neutral background.

import { createTheme } from '@mui/material/styles';

const PRIMARY = '#4F46E5';
const BACKGROUND = '#F8FAFC';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: PRIMARY,
      light: '#8B85EF',
      dark: '#3730A3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0EA5E9',
    },
    success: {
      main: '#22C55E',
    },
    warning: {
      main: '#F59E0B',
    },
    error: {
      main: '#EF4444',
    },
    background: {
      default: BACKGROUND,
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E1B2E',
      secondary: '#64748B',
    },
    divider: '#E2E8F0',
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: '"Google Sans Text", "Roboto", "Segoe UI", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700, letterSpacing: -0.5 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BACKGROUND,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 20,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 1px 3px rgba(30, 27, 46, 0.06), 0 1px 2px rgba(30, 27, 46, 0.04)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          paddingTop: 10,
          paddingBottom: 10,
          minHeight: 44,
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.28)',
          },
        },
        sizeLarge: {
          borderRadius: 20,
          minHeight: 56,
          fontSize: '1rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 10,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 72,
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          minWidth: 64,
          paddingTop: 10,
          '&.Mui-selected': {
            color: PRIMARY,
          },
        },
        label: {
          fontSize: '0.75rem',
          '&.Mui-selected': {
            fontSize: '0.75rem',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 10,
          backgroundColor: '#E2E8F0',
        },
        bar: {
          borderRadius: 8,
        },
      },
    },
  },
});
