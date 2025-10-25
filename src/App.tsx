import { Fragment } from 'react';
import { BrowserRouter } from 'react-router';

import { Box, CssBaseline, useMediaQuery, useTheme} from '@mui/material';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';

import Pages from './routes/Pages';
import Header from './sections/Header';
import HotKeys from './sections/HotKeys';
import SideMenu from './sections/Sidebar/SideMenu';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Provider } from 'jotai';
import { store } from './store';
import { NotificationsProvider } from '@toolpad/core/useNotifications';

function App() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Fragment>
      <NotificationsProvider
        slotProps={{
          snackbar: {
            anchorOrigin: {
              vertical: isMobile ? 'top' : 'bottom',
              horizontal: 'right'
            },
            sx: {mt: isMobile ? 6.5 : 0}
          }
        }}
      >
        <Provider store={store} >
          <CssBaseline/>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <BrowserRouter>
            <SideMenu/>
            <Box
              sx={(theme) => ({
                padding: 0,
                minHeight: '100vh',
                backgroundColor: theme.palette.background.default,
                backgroundImage:
                  theme.palette.mode === 'dark'
                    ? 'radial-gradient(120% 120% at 15% 10%, rgba(120,144,255,0.18), transparent 60%), radial-gradient(120% 120% at 85% 90%, rgba(0,200,170,0.12), transparent 65%)'
                    : 'linear-gradient(135deg, rgba(33,150,243,0.14), rgba(0,188,212,0.08))',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
              })}
            >
              <Header/>
              <Pages/>
              <HotKeys/>
            </Box>
          </BrowserRouter>
          </LocalizationProvider>
        </Provider>
      </NotificationsProvider>
    </Fragment>
  );
}

const AppWithErrorHandler = withErrorHandler(App, AppErrorBoundaryFallback);
export default AppWithErrorHandler;
