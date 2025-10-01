import AddTaskIcon from '@mui/icons-material/AddTask';
import BugReportIcon from '@mui/icons-material/BugReport';
import HomeIcon from '@mui/icons-material/Home';
import ScanIcon from '@mui/icons-material/Flip';
import asyncComponentLoader from '@/utils/loader';
import StoreFront from '@mui/icons-material/Storefront'

import { Routes } from './types';

const routes: Routes = [
  {
    component: asyncComponentLoader(() => import('@/pages/Welcome')),
    path: '/',
    title: 'Welcome',
    icon: HomeIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/pages/ScanPage')),
    path: '/scan',
    title: 'Scan',
    icon: ScanIcon,
    isProtected: true
  },
  {
    component: asyncComponentLoader(() => import('@/pages/UserLibraryPage')),
    path: '/library',
    title: 'My Library',
    icon: AddTaskIcon,
    isProtected: true
  },
  {
    component: asyncComponentLoader(() => import('@/pages/CartPage')),
    path: '/shopping-cart',
    isProtected: true
  },
  {
    component: asyncComponentLoader(() => import('@/pages/MarketPage')),
    path: '/market',
    title: 'Market',
    icon: StoreFront,
    isProtected: true
  },
  {
    component: asyncComponentLoader(() => import('@/pages/TitlePage')),
    path: '/titles',
    title: 'Add Title',
    icon: AddTaskIcon,
    isProtected: true
  },
  {
    component: asyncComponentLoader(() => import('@/pages/ArtistPage')),
    path: '/artists',
    title: 'Add Artist',
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
    component: asyncComponentLoader(() => import('@/pages/SeriesPage')),
    path: '/series',
    title: 'Series',
    icon: AddTaskIcon, 
    isProtected: true
  },
  {
    component: asyncComponentLoader(() => import('@/pages/PublisherCollectionPage')),
    path: '/collections',
    title: 'Collections',
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
