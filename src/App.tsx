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
            <Box sx={{padding: 0}} >
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
