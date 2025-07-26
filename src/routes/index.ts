import AddTaskIcon from '@mui/icons-material/AddTask';
import BugReportIcon from '@mui/icons-material/BugReport';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';
import TerrainIcon from '@mui/icons-material/Terrain';

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
    icon: GitHubIcon,
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
    icon: TerrainIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/pages/Page4')),
    path: '/page-4',
    title: 'Page 4',
    icon: BugReportIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
];

export default routes;
