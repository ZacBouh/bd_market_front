import AddTaskIcon from '@mui/icons-material/AddTask';
import BugReportIcon from '@mui/icons-material/BugReport';
import HomeIcon from '@mui/icons-material/Home';


import asyncComponentLoader from '@/utils/loader';

import { Routes } from './types';

const routes: Routes = [
  {
    component: asyncComponentLoader(() => import('@/pages/Welcome')),
    path: '/',
    title: 'Welcome',
    icon: HomeIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/pages/TitlePage')),
    path: '/Titles',
    title: 'Add Title',
    icon: AddTaskIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/pages/AuthorPage')),
    path: '/Authors',
    title: 'Add Author',
    icon: AddTaskIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/pages/PublisherPage')),
    path: '/Publishers',
    title: 'Add Publisher',
    icon: AddTaskIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/pages/LoginPage')),
    path: '/login',
    title: 'Login',
    icon: BugReportIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/pages/SubscribePage')),
    path: '/Subscribe',
    title: 'Subscribe',
    icon: BugReportIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
];

export default routes;
