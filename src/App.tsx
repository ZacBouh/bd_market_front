import { Fragment, useState } from 'react';
import { BrowserRouter } from 'react-router';

import { Box, Button, CssBaseline, Drawer, List, ListItem } from '@mui/material';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';

import Pages from './routes/Pages';
import Header from './sections/Header';
import HotKeys from './sections/HotKeys';
import Sidebar from './sections/Sidebar';
import { Padding, TransferWithinAStationSharp } from '@mui/icons-material';
import SideMenu from './sections/Sidebar/SideMenu';
import { useSidebar } from './sections/Sidebar/hooks';

function App() {
  const { toggle: toggleSideMenu, width: sideMenuWidth} = useSidebar()
  return (
    <Fragment>
      <CssBaseline/>
      <Box sx={{backgroundColor: 'red', padding: 0, margin: 0}} >
        <SideMenu/>
      </Box>
      <Box sx={{backgroundColor: 'background.paper',  transition: "margin-left 0.2s", marginLeft: `${sideMenuWidth}px`, padding: 0}} >
        <Header/>
        <div>
        TextYellow
        <Button
          onClick={toggleSideMenu}
        >Toggle</Button>
        <HotKeys/>
        </div>
      </Box>
    {/* </Box> */}
    </Fragment>
  );
}

const AppWithErrorHandler = withErrorHandler(App, AppErrorBoundaryFallback);
export default AppWithErrorHandler;
