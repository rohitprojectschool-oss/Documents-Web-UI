import { useMachine } from '@xstate/react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import createAnalyticsMachine from './machine';
import StatCard from '../../components/StatCard/StatCard';
import { locale } from '../../locale/locale';
import './Analytics.scss';

const COUNTRY_FLAGS: Record<string, string> = {
  AO: '🇦🇴', NG: '🇳🇬', PT: '🇵🇹', SA: '🇸🇦', GR: '🇬🇷', EE: '🇪🇪',
};

const COUNTRY_COLORS: Record<string, string> = {
  AO: '#e53e3e', NG: '#4299e1', PT: '#48bb78', SA: '#ecc94b', GR: '#718096', EE: '#4FD1C5',
};

function Analytics() {
  const [state, send] = useMachine(createAnalyticsMachine());

  if (state.matches('loading')) {
    return <div className="analytics__loading">{locale('common.loading')}</div>;
  }
  if (state.matches('error')) {
    return (
      <div className="analytics__error">
        <p>{locale('common.error')}</p>
        <button onClick={() => send({ type: 'REFRESH' })}>{locale('common.retry')}</button>
      </div>
    );
  }

  const { data } = state.context;
  if (!data) return null;

  const { countryStats, monthlyTrends, docTypeStats, totalDocuments, acceptanceRate, rejectionRate, activeCountries } = data;

  // Identify countries present in data to dynamically render areas
  const dataCountryCodes = countryStats.map(c => c.countryCode);

  return (
    <div className="analytics">
      <div className="analytics__header">
        <div>
          <h1 className="analytics__title">{locale('analytics.title')}</h1>
          <p className="analytics__subtitle">{locale('analytics.subtitle')}</p>
        </div>
        <button className="analytics__refresh-btn" onClick={() => send({ type: 'REFRESH' })}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="analytics__kpis">
        <StatCard
          title={locale('analytics.totalDocuments')}
          value={totalDocuments.toLocaleString()}
          iconColor="#4299e1"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h5v7h7v9H6z" />
            </svg>
          }
        />
        <StatCard
          title={locale('analytics.acceptanceRate')}
          value={`${acceptanceRate}%`}
          iconColor="#48bb78"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          }
        />
        <StatCard
          title={locale('analytics.rejectionRate')}
          value={`${rejectionRate}%`}
          iconColor="#e53e3e"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
            </svg>
          }
        />
        <StatCard
          title={locale('analytics.activeCountries')}
          value={activeCountries}
          iconColor="#ecc94b"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          }
        />
      </div>

      {/* Charts row */}
      <div className="analytics__charts">
        {/* Monthly trends */}
        <div className="analytics__chart-card analytics__chart-card--wide">
          <div className="analytics__chart-header">
            <h3>{locale('analytics.monthlyTrends')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {dataCountryCodes.map((code) => (
                  <linearGradient key={code} id={`grad-${code}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COUNTRY_COLORS[code] || '#718096'} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={COUNTRY_COLORS[code] || '#718096'} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--color-text-primary)' }}
                itemStyle={{ fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              {dataCountryCodes.map((code) => (
                <Area 
                  key={code} 
                  type="monotone" 
                  dataKey={code} 
                  name={code} 
                  stroke={COUNTRY_COLORS[code] || '#718096'} 
                  strokeWidth={2} 
                  fill={`url(#grad-${code})`} 
                  connectNulls
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Doc type breakdown */}
        <div className="analytics__chart-card">
          <div className="analytics__chart-header">
            <h3>{locale('analytics.docTypeBreakdown')}</h3>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={docTypeStats.filter((d) => d.count > 0)}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={68}
                dataKey="count"
                nameKey="type"
                label={({ name, percent }: { name?: string; percent?: number }) => (name && typeof name === 'string' && percent != null) ? `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%` : ''}
                labelLine={false}
              >
                {docTypeStats.filter((d) => d.count > 0).map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Country comparison */}
      <div className="analytics__chart-card analytics__chart-card--full">
        <div className="analytics__chart-header">
          <h3>{locale('analytics.byCountry')}</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={countryStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="countryName"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8 }}
              labelStyle={{ color: 'var(--color-text-primary)' }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Bar dataKey="accepted" name={locale('analytics.accepted')} fill="#48bb78" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rejected" name={locale('analytics.rejected')} fill="#e53e3e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" name={locale('analytics.pending')} fill="#ecc94b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Country stats table */}
      <div className="analytics__table-card">
        <div className="analytics__chart-header">
          <h3>{locale('customers.countries')}</h3>
        </div>
        <table className="analytics__table">
          <thead>
            <tr>
              <th>{locale('table.country')}</th>
              <th>{locale('dashboard.total')}</th>
              <th>{locale('analytics.accepted')}</th>
              <th>{locale('analytics.rejected')}</th>
              <th>{locale('analytics.pending')}</th>
              <th>Acceptance</th>
            </tr>
          </thead>
          <tbody>
            {countryStats.map((c) => (
              <tr key={c.countryCode}>
                <td>
                  <div className="analytics__country-cell">
                    <span>{COUNTRY_FLAGS[c.countryCode] || '🌐'}</span>
                    <span>{c.countryName}</span>
                    <span className="analytics__cc">{c.countryCode}</span>
                  </div>
                </td>
                <td>{c.total}</td>
                <td><span className="analytics__badge analytics__badge--accepted">{c.accepted}</span></td>
                <td><span className="analytics__badge analytics__badge--rejected">{c.rejected}</span></td>
                <td><span className="analytics__badge analytics__badge--pending">{c.pending}</span></td>
                <td>
                  <div className="analytics__rate-bar">
                    <div className="analytics__rate-bg">
                      <div className="analytics__rate-fill" style={{ width: `${c.total > 0 ? Math.round((c.accepted / c.total) * 100) : 0}%` }} />
                    </div>
                    <span>{c.total > 0 ? Math.round((c.accepted / c.total) * 100) : 0}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Analytics;
