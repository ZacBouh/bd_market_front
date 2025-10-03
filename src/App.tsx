import { Fragment } from 'react';
import { BrowserRouter } from 'react-router';

import { Box, Button, CssBaseline} from '@mui/material';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';

import Pages from './routes/Pages';
import Header from './sections/Header';
import HotKeys from './sections/HotKeys';
import SideMenu from './sections/Sidebar/SideMenu';
import { useSidebar } from './sections/Sidebar/hooks';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Provider } from 'jotai';
import { store } from './store';

function App() {
  const { toggle: toggleSideMenu, width: sideMenuWidth} = useSidebar()
  
  return (
    <Fragment>
      <Provider store={store} >
        <CssBaseline/>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <SideMenu/>
          <Box sx={{backgroundColor: 'background.paper',  transition: "margin-left 0.2s", marginLeft: `${sideMenuWidth}px`, padding: 0}} >
            <Header/>
            <Button
              onClick={toggleSideMenu}
              >Open</Button>
            <Pages/>
            <HotKeys/>
          </Box>
        </BrowserRouter>
        </LocalizationProvider>
      </Provider>
    </Fragment>
  );
}

const AppWithErrorHandler = withErrorHandler(App, AppErrorBoundaryFallback);
export default AppWithErrorHandler;
