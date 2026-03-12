import { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useMachine } from '@xstate/react';
import createHomeMachine from './machine';
import Navbar from '../../components/Navbar/Navbar';
import type { HomeRoute } from './machine/types';
import './Home.scss';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [state, send] = useMachine(createHomeMachine());

  // Sync URL to machine state whenever the active route changes
  useEffect(() => {
    if (state.matches('ready')) {
      const route = state.value as { ready: string };
      const activeRoute = typeof route === 'object' ? Object.values(route)[0] : route;
      if (location.pathname !== `/${activeRoute}`) {
        navigate(`/${activeRoute}`, { replace: true });
      }
    }
  }, [state.value]);

  const handleNavigate = (route: HomeRoute) => {
    send({ type: 'NAVIGATE', route });
  };

  // Determine active route from URL for Navbar highlight
  const activeRoute = (location.pathname.slice(1) || 'dashboard') as HomeRoute;

  if (state.matches('loading')) {
    return (
      <div className="home__loader">
        <div className="home__loader-spinner" />
      </div>
    );
  }

  if (state.matches('error')) {
    return (
      <div className="home__error">
        <h2>Something went wrong</h2>
        <p>{state.context.error}</p>
        <button onClick={() => send({ type: 'RETRY' })}>Retry</button>
      </div>
    );
  }

  return (
    <div className="home">
      <Navbar activeRoute={activeRoute} onNavigate={handleNavigate} user={state.context.user} />
      <main className="home__content">
        <Outlet />
      </main>
    </div>
  );
}

export default Home;
