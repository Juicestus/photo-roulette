/* @refresh reload */
import type { RouteDefinition } from 'solid-app-router';
import Create from './pages/Create';
import Home from './pages/Home';
import Join from './pages/Join';
import Lobby from './pages/Lobby';
import Select from './pages/Select';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/create',
    component: Create,
  }, 
  {
    path: '/join',
    component: Join,
  }, 
  {
    path: '/lobby',
    component: Lobby,
  }, 
  {
    path: '/select',
    component: Select,
  }, 
];