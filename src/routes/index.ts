import AddTaskIcon from '@mui/icons-material/AddTask';
import BugReportIcon from '@mui/icons-material/BugReport';
import HomeIcon from '@mui/icons-material/Home';
import asyncComponentLoader from '@/utils/loader';
import { store, userAtom } from '@/store';

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
    path: '/titles',
    title: 'Add Title',
    icon: AddTaskIcon,
    isProtected: true
  },
  {
    component: asyncComponentLoader(() => import('@/pages/AuthorPage')),
    path: '/authors',
    title: 'Add Author',
    icon: AddTaskIcon,
    isProtected: true
  },
  {
    component: asyncComponentLoader(() => import('@/pages/PublisherPage')),
    path: '/publishers',
    title: 'Add Publisher',
    icon: AddTaskIcon,
    isProtected: true
  },
  {
    component: asyncComponentLoader(() => import('@/pages/LoginPage')),
    path: '/login',
    title: 'Login',
    icon: BugReportIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/pages/SubscribePage')),
    path: '/subscribe',
    title: 'Subscribe',
    icon: BugReportIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
];

export default routes;
