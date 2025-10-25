import { Routes, useNavigate } from 'react-router';

import Box from '@mui/material/Box';

import routes from '..';
import { getPageHeight, renderRoutes } from './utils';
import { useEffect } from 'react';
import { routerNavigate } from '@/utils/routerNavigate';
import { notification } from '@/utils/padNotification';
import { useNotifications } from '@toolpad/core/useNotifications';
import { useSidebar } from '@/sections/Sidebar/hooks';
import { useMediaQuery, useTheme } from '@mui/material';

function Pages() {
  // pass the react-router navigate function to be able to call navigate outside a component
  const navigate = useNavigate()
  const notificationFunc = useNotifications()
  const {width : sidebarWidth} = useSidebar()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const leftPadding = isMobile ? 0 : sidebarWidth
  useEffect(()=>{
    routerNavigate.setNavigate(navigate)
  }, [navigate])
  useEffect(() =>{
    notification.setNotificationFunc(notificationFunc)
  }, [notificationFunc])
  console.log(sidebarWidth)
  return (
    <Box
      component="main"
      sx={{
        minHeight: (theme) => getPageHeight(theme),
        pl: `${leftPadding}px`,
        width: '100%',
      }}
    >
      <Routes>{renderRoutes(routes)}</Routes>
    </Box>
  );
}

export default Pages;
