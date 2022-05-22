/* @refresh reload */
import type { Component } from 'solid-js';
import { Link, useRoutes, useLocation } from 'solid-app-router';
import { routes } from './routes';

const App: Component = () => {
  const location = useLocation();
  const Route = useRoutes(routes);

  return (
    <>
      <main>
        <Route />
      </main>
    </>
  );
};

export default App;
