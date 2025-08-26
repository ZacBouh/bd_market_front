import { Routes, useNavigate } from 'react-router';

import Box from '@mui/material/Box';

import routes from '..';
import { getPageHeight, renderRoutes } from './utils';
import { useEffect } from 'react';
import { routerNavigate } from '@/utils/routerNavigate';

function Pages() {
  // pass the react-router navigate function to be able to call navigate outside a component
  const navigate = useNavigate()
  useEffect(()=>{
    routerNavigate.setNavigate(navigate)
  }, [navigate])
  return (
    <Box sx={{ height: (theme) => getPageHeight(theme) }}>
      <Routes>{renderRoutes(routes)}</Routes>
    </Box>
  );
}

export default Pages;
