import { useMachine } from '@xstate/react';
import { locale } from '../../locale/locale';
import type { HomeRoute } from '../../pages/Home/machine/types';
import type { UserProfile } from '../../pages/Home/machine/types';
import createNavbarMachine from './machine';
import './Navbar.scss';

interface NavbarProps {
  activeRoute: HomeRoute | string;
  onNavigate: (route: HomeRoute) => void;
  user: UserProfile | null;
  onSignOut?: () => void;
}

const NAV_ITEMS: { id: HomeRoute; labelKey: string; icon: React.ReactNode }[] = [
  {
    id: 'dashboard',
    labelKey: 'nav.dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
  },
  {
    id: 'invoices',
    labelKey: 'nav.invoices',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
  },
  {
    id: 'customers',
    labelKey: 'nav.customers',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  },
  {
    id: 'analytics',
    labelKey: 'nav.analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
      </svg>
    ),
  },
];

function Navbar({ activeRoute, onNavigate, user, onSignOut }: NavbarProps) {
  const [state, send] = useMachine(createNavbarMachine());

  const handleToggleDropdown = () => send({ type: 'TOGGLE_DROPDOWN' });
  const handleCloseDropdown = () => send({ type: 'CLOSE_DROPDOWN' });
  const handleToggleTheme = () => send({ type: 'TOGGLE_THEME' });

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <span className="navbar__logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#e53e3e" strokeWidth="2.5" />
            <path d="M8 12l3 3 5-5" stroke="#e53e3e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="navbar__logo-text">Crimson</span>
      </div>

      <div className="navbar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`navbar__nav-item${activeRoute === item.id ? ' navbar__nav-item--active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.icon}
            <span>{locale(item.labelKey)}</span>
          </button>
        ))}
      </div>

      <div className="navbar__actions">
        <button
          className={`navbar__icon-btn${activeRoute === 'settings' ? ' navbar__icon-btn--active' : ''}`}
          onClick={() => onNavigate('settings')}
          title={locale('nav.settings')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>

        <div className="navbar__user-menu">
          <button
            className={`navbar__icon-btn${activeRoute === 'users' ? ' navbar__icon-btn--active' : ''}`}
            onClick={handleToggleDropdown}
            title={locale('nav.users')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>

          {state.context.dropdownOpen && (
            <>
              <div className="navbar__dropdown-overlay" onClick={handleCloseDropdown} />
              <div className="navbar__dropdown">
                <div className="navbar__dropdown-user">
                  <span className="navbar__dropdown-name">{user?.name?.toUpperCase() || 'DEMO USER'}</span>
                  <span className="navbar__dropdown-email">{user?.email || 'client@test.com'}</span>
                </div>
                <div className="navbar__dropdown-divider" />
                <button className="navbar__dropdown-item" onClick={handleToggleTheme}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                  {state.context.theme === 'dark' ? locale('nav.lightMode') : locale('nav.darkMode')}
                </button>
                <button
                  className="navbar__dropdown-item navbar__dropdown-item--danger"
                  onClick={() => { handleCloseDropdown(); onSignOut?.(); }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  {locale('nav.signOut')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
