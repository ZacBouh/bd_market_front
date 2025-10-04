import { Routes, useNavigate } from 'react-router';

import Box from '@mui/material/Box';

import routes from '..';
import { getPageHeight, renderRoutes } from './utils';
import { useEffect } from 'react';
import { routerNavigate } from '@/utils/routerNavigate';
import { notification } from '@/utils/padNotification';
import { useNotifications } from '@toolpad/core/useNotifications';

function Pages() {
  // pass the react-router navigate function to be able to call navigate outside a component
  const navigate = useNavigate()
  const notificationFunc = useNotifications()
  useEffect(()=>{
    routerNavigate.setNavigate(navigate)
  }, [navigate])
  useEffect(() =>{
    notification.setNotificationFunc(notificationFunc)
  }, [notificationFunc])
  return (
    <Box sx={{ height: (theme) => getPageHeight(theme) }}>
      <Routes>{renderRoutes(routes)}</Routes>
    </Box>
  );
}

export default Pages;
