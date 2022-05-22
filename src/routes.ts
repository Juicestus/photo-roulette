/* @refresh reload */
import type { RouteDefinition } from 'solid-app-router';
import Create from './pages/Create';
import Home from './pages/Home';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/create',
    component: Create,
  }, 
];