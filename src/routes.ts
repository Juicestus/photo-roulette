/* @refresh reload */
import type { RouteDefinition } from 'solid-app-router';
import Home from './pages/Home';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
];