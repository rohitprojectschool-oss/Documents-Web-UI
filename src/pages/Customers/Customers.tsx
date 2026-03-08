import { useMachine } from '@xstate/react';
import createCustomersMachine from './machine';
import { locale } from '../../locale/locale';
import './Customers.scss';

const COUNTRY_FLAGS: Record<string, string> = {
  AO: '🇦🇴', NG: '🇳🇬', PT: '🇵🇹', SA: '🇸🇦', GR: '🇬🇷',
  EE: '🇪🇪', US: '🇺🇸', GB: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪',
};

const COUNTRY_NAMES: Record<string, string> = {
  AO: 'Angola', NG: 'Nigeria', PT: 'Portugal', SA: 'Saudi Arabia', GR: 'Greece',
  EE: 'Estonia', US: 'United States', GB: 'United Kingdom',
};

function Customers() {
  const [state, send] = useMachine(createCustomersMachine());

  if (state.matches('loading')) {
    return <div className="customers__loading">{locale('common.loading')}</div>;
  }
  if (state.matches('error')) {
    return (
      <div className="customers__error">
        <p>{locale('common.error')}</p>
        <button onClick={() => send({ type: 'REFRESH' })}>{locale('common.retry')}</button>
      </div>
    );
  }

  const { customers, selectedCountry, searchQuery } = state.context;

  // Build country counts
  const countryMap = customers.reduce<Record<string, number>>((acc, c) => {
    acc[c.countryCode] = (acc[c.countryCode] || 0) + 1;
    return acc;
  }, {});
  const countries = Object.entries(countryMap).sort((a, b) => b[1] - a[1]);

  const filtered = customers.filter((c) => {
    if (selectedCountry !== 'all' && c.countryCode !== selectedCountry) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.customerId.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        (c.email ?? '').toLowerCase().includes(q) ||
        (c.phone ?? '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sidebarTitle = selectedCountry === 'all'
    ? locale('customers.allCountries')
    : COUNTRY_NAMES[selectedCountry] || selectedCountry;

  return (
    <div className="customers">
      <div className="customers__header">
        <div>
          <h1 className="customers__title">{locale('customers.title')}</h1>
          <p className="customers__subtitle">{locale('customers.subtitle')}</p>
        </div>
        <div className="customers__header-actions">
          <button className="customers__action-btn customers__action-btn--outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
            {locale('customers.download')}
          </button>
          <button className="customers__action-btn customers__action-btn--outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
            </svg>
            {locale('customers.upload')}
          </button>
          <button className="customers__action-btn customers__action-btn--primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
            </svg>
            {locale('customers.addCustomer')}
          </button>
        </div>
      </div>

      <div className="customers__body">
        {/* Sidebar */}
        <div className="customers__sidebar">
          <div className="customers__sidebar-title">{locale('customers.countries')}</div>
          <div className="customers__sidebar-subtitle">{locale('customers.selectCountry')}</div>
          <div className="customers__country-list">
            <button
              className={`customers__country-item${selectedCountry === 'all' ? ' customers__country-item--active' : ''}`}
              onClick={() => send({ type: 'SELECT_COUNTRY', country: 'all' })}
            >
              <span className="customers__country-label">{locale('customers.all')}</span>
              <span className="customers__country-count">{customers.length}</span>
            </button>
            {countries.map(([code, count]) => (
              <button
                key={code}
                className={`customers__country-item${selectedCountry === code ? ' customers__country-item--active' : ''}`}
                onClick={() => send({ type: 'SELECT_COUNTRY', country: code })}
              >
                <span className="customers__country-flag">{COUNTRY_FLAGS[code] || '🌐'}</span>
                <span className="customers__country-info">
                  <span className="customers__country-name">{COUNTRY_NAMES[code] || code}</span>
                  <span className="customers__country-code">{code}</span>
                </span>
                <span className="customers__country-count">{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main table */}
        <div className="customers__main">
          <div className="customers__main-header">
            <div>
              <span className="customers__main-title">{sidebarTitle}</span>
              <span className="customers__main-count">{filtered.length} {locale('customers.customers')}</span>
            </div>
            <div className="customers__search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="customers__search-icon">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                className="customers__search"
                type="text"
                placeholder={locale('customers.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => send({ type: 'SEARCH', query: e.target.value })}
              />
            </div>
          </div>

          <div className="customers__table-wrapper">
            {filtered.length === 0 ? (
              <div className="customers__empty">{locale('customers.noCustomers')}</div>
            ) : (
              <table className="customers__table">
                <thead>
                  <tr>
                    <th>{locale('customers.customerId')}</th>
                    <th>{locale('customers.taxId')}</th>
                    <th>{locale('customers.name')}</th>
                    <th>{locale('customers.email')}</th>
                    <th>{locale('customers.phone')}</th>
                    <th>{locale('customers.country')}</th>
                    <th>{locale('customers.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id}>
                      <td className="customers__customer-id">{c.customerId}</td>
                      <td>{c.taxId}</td>
                      <td>{c.name}</td>
                      <td className="customers__muted">{c.email ?? '—'}</td>
                      <td className="customers__muted">{c.phone ?? '—'}</td>
                      <td>
                        <div className="customers__country-cell">
                          <span className="customers__flag">{COUNTRY_FLAGS[c.countryCode] || '🌐'}</span>
                          <span>
                            <span className="customers__country-cell-name">{COUNTRY_NAMES[c.countryCode] || c.countryCode}</span>
                            <span className="customers__country-cell-code">{c.countryCode}</span>
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="customers__actions">
                          <button className="customers__action-icon" title="Edit">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                          </button>
                          <button className="customers__action-icon customers__action-icon--danger" title="Delete">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;
