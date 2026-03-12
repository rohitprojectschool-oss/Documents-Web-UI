import { useNavigate } from 'react-router-dom';
import { useMachine } from '@xstate/react';
import { useRef } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts';
import createDashboardMachine from './machine';
import StatCard from '../../components/StatCard/StatCard';
import { locale } from '../../locale/locale';
import { COUNTRIES } from '../../constants/countries';
import type { RecentDocument } from './machine/types';
import './Dashboard.scss';

const STATUS_LABEL: Record<RecentDocument['status'], string> = {
  accepted: locale('common.acceptedByAgt'),
  rejected: locale('common.rejectedByAgt'),
  pending: 'Pending',
};

function Dashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, send] = useMachine(createDashboardMachine());

  if (state.matches('loading')) {
    return <div className="dashboard__loading">{locale('common.loading')}</div>;
  }

  if (state.matches('error')) {
    return <div className="dashboard__error">{locale('common.error')}</div>;
  }

  const { stats, activityData, countryData, docDistribution, recentDocuments, showModal, formData, selectedDocument } = state.context;
  const isUploading = state.matches('uploading');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;
    send({ type: 'UPLOAD_DOCUMENT' });
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">{locale('dashboard.title')}</h1>
          <p className="dashboard__subtitle">{locale('dashboard.subtitle')}</p>
        </div>
        <button 
          className="dashboard__upload-btn"
          onClick={() => send({ type: 'TOGGLE_MODAL', show: true })}
          disabled={isUploading}
          title={locale('common.uploadDocument')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
          </svg>
        </button>
      </div>

      {showModal && (
        <div className="dashboard__modal-overlay">
          <div className="dashboard__modal">
            <div className="dashboard__modal-header">
              <h2>{locale('common.uploadDocument')}</h2>
              <button className="dashboard__modal-close" onClick={() => send({ type: 'TOGGLE_MODAL', show: false })}>&times;</button>
            </div>
            <form onSubmit={handleUploadSubmit} className="dashboard__form">
              <div className="dashboard__form-grid">
                <div className="dashboard__form-field dashboard__form-field--full">
                  <div 
                    className={`dashboard__dropzone${formData.file ? ' dashboard__dropzone--active' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={e => send({ type: 'UPDATE_FORM', field: 'file', value: e.target.files?.[0] || null })}
                    />
                    <div className="dashboard__dropzone-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4a2 2 0 0 1 2-2h14" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div className="dashboard__dropzone-text">
                      {formData.file ? formData.file.name : locale('common.uploadInvoice')}
                    </div>
                    <div className="dashboard__dropzone-hint">
                      {formData.file ? `${(formData.file.size / 1024).toFixed(1)} KB` : 'Click to select or drag and drop document'}
                    </div>
                  </div>
                </div>

                <div className="dashboard__form-field">
                  <label>{locale('common.sourceReference')}</label>
                  <input 
                    required 
                    value={formData.sourceReference}
                    onChange={e => send({ type: 'UPDATE_FORM', field: 'sourceReference', value: e.target.value })}
                    placeholder="e.g. REF-123"
                  />
                </div>
                <div className="dashboard__form-field">
                  <label>{locale('common.customerName')}</label>
                  <input 
                    required 
                    value={formData.customer}
                    onChange={e => send({ type: 'UPDATE_FORM', field: 'customer', value: e.target.value })}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div className="dashboard__form-field">
                  <label>{locale('common.grossAmount')}</label>
                  <input 
                    required 
                    type="number"
                    step="0.01"
                    value={formData.grossAmount}
                    onChange={e => send({ type: 'UPDATE_FORM', field: 'grossAmount', value: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="dashboard__form-field">
                  <label>{locale('common.documentType')}</label>
                  <select 
                    value={formData.docType}
                    onChange={e => send({ type: 'UPDATE_FORM', field: 'docType', value: e.target.value })}
                  >
                    <option value="Standard Invoice">{locale('common.standardInvoice')}</option>
                    <option value="Credit Note">{locale('common.creditNote')}</option>
                    <option value="Debit Note">{locale('common.debitNote')}</option>
                  </select>
                </div>
                <div className="dashboard__form-field dashboard__form-field--full">
                  <label>{locale('common.country')}</label>
                  <select 
                    value={formData.countryCode}
                    onChange={e => send({ type: 'UPDATE_FORM', field: 'countryCode', value: e.target.value })}
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="dashboard__modal-footer">
                <button type="button" className="dashboard__btn-secondary" onClick={() => send({ type: 'TOGGLE_MODAL', show: false })}>{locale('common.cancel')}</button>
                <button type="submit" className="dashboard__btn-primary" disabled={!formData.file || isUploading}>
                  {isUploading ? locale('common.loading') : locale('common.uploadDocument')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedDocument && (
        <div className="dashboard__modal-overlay">
          <div className="dashboard__modal dashboard__modal--large">
            <div className="dashboard__modal-header">
              <h2>{locale('invoices.details')}</h2>
              <button className="dashboard__modal-close" onClick={() => send({ type: 'CLOSE_DETAILS' })}>&times;</button>
            </div>
            <div className="dashboard__details-content" style={{ padding: '32px' }}>
              <div className="dashboard__details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                <div className="dashboard__detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>{locale('table.docId')}</label>
                  <span style={{ fontSize: '16px', fontWeight: 500 }}>{selectedDocument.docId}</span>
                </div>
                <div className="dashboard__detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>{locale('table.status')}</label>
                  <span className={`dashboard__status dashboard__status--${selectedDocument.status}`}>
                    {STATUS_LABEL[selectedDocument.status]}
                  </span>
                </div>
                <div className="dashboard__detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>{locale('table.sourceReference')}</label>
                  <span>{selectedDocument.sourceReference}</span>
                </div>
                <div className="dashboard__detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>{locale('table.customer')}</label>
                  <span>{selectedDocument.customer}</span>
                </div>
                <div className="dashboard__detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>{locale('table.grossAmount')}</label>
                  <span>{selectedDocument.grossAmount}</span>
                </div>
                <div className="dashboard__detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>{locale('table.created')}</label>
                  <span>{selectedDocument.created}</span>
                </div>
                <div className="dashboard__detail-item" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>{locale('table.docType')}</label>
                  <span>{selectedDocument.docType}</span>
                </div>
              </div>
            </div>
            <div className="dashboard__modal-footer">
              {selectedDocument.hasAttachment && (
                <div style={{ marginRight: 'auto', display: 'flex', gap: '8px' }}>
                  <button 
                    className="dashboard__btn-secondary" 
                    onClick={() => {
                      if (selectedDocument.fileUrl) window.open(selectedDocument.fileUrl, '_blank');
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {locale('common.view')}
                  </button>
                  <button 
                    className="dashboard__btn-secondary" 
                    onClick={() => {
                      if (selectedDocument.fileUrl) {
                        const link = document.createElement('a');
                        link.href = selectedDocument.fileUrl;
                        link.download = selectedDocument.docId;
                        link.click();
                      }
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4a2 2 0 0 1 2-2h14" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {locale('common.download')}
                  </button>
                </div>
              )}
              <button className="dashboard__btn-primary" onClick={() => send({ type: 'CLOSE_DETAILS' })}>
                {locale('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="dashboard__stats">
        <StatCard
          title={locale('dashboard.totalDocuments')}
          value={stats?.totalDocuments ?? 0}
          iconColor="#4299e1"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
            </svg>
          }
        />
        <StatCard
          title={locale('dashboard.pending')}
          value={stats?.pending ?? 0}
          iconColor="#ecc94b"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
            </svg>
          }
        />
        <StatCard
          title={locale('dashboard.completed')}
          value={stats?.completed ?? 0}
          iconColor="#48bb78"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          }
        />
        <StatCard
          title={locale('dashboard.rejected')}
          value={stats?.rejected ?? 0}
          iconColor="#e53e3e"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" />
            </svg>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="dashboard__charts">
        {/* Document Activity */}
        <div className="dashboard__chart-card dashboard__chart-card--wide">
          <div className="dashboard__chart-header">
            <h3>{locale('dashboard.documentActivity')}</h3>
            <div className="dashboard__period-select">
              <span>{locale('common.lastSevenDays')}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e53e3e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e53e3e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#718096', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#718096', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1a202c', border: '1px solid #2d3748', borderRadius: 8 }}
                labelStyle={{ color: '#e2e8f0' }}
                itemStyle={{ color: '#e53e3e' }}
              />
              <Area type="monotone" dataKey="count" stroke="#e53e3e" strokeWidth={2} fill="url(#activityGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Country Distribution */}
        <div className="dashboard__chart-card">
          <div className="dashboard__chart-header">
            <h3>{locale('dashboard.countryDistribution')}</h3>
            <span className="dashboard__chart-meta">{countryData.length} {locale('dashboard.countries')}</span>
          </div>
          <div className="dashboard__pie-container">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={countryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                >
                  {countryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1a202c', border: '1px solid #2d3748', borderRadius: 8 }}
                  formatter={(value) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Document Distribution */}
        <div className="dashboard__chart-card">
          <div className="dashboard__chart-header">
            <h3>{locale('dashboard.documentDistribution')}</h3>
            <span className="dashboard__chart-meta">183 {locale('dashboard.total')}</span>
          </div>
          <div className="dashboard__distribution-list">
            {docDistribution.map((item) => (
              <div key={item.type} className="dashboard__distribution-item">
                <div className="dashboard__distribution-label">
                  <span className="dashboard__distribution-dot" style={{ background: item.color }} />
                  <span>{item.type}</span>
                </div>
                <div className="dashboard__distribution-bar-row">
                  <div className="dashboard__distribution-bar">
                    <div
                      className="dashboard__distribution-bar-fill"
                      style={{ width: `${item.percentage}%`, background: item.color }}
                    />
                  </div>
                  <span className="dashboard__distribution-pct">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="dashboard__recent">
        <div className="dashboard__recent-header">
          <h3>{locale('dashboard.recentDocuments')}</h3>
          <button className="dashboard__view-all" onClick={() => navigate('/invoices')}>
            {locale('dashboard.viewAll')} →
          </button>
        </div>
        <div className="dashboard__table-wrapper">
          <table className="dashboard__table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>{locale('table.docId')}</th>
                <th>{locale('table.sourceReference')}</th>
                <th>{locale('table.customer')}</th>
                <th>{locale('table.grossAmount')}</th>
                <th>{locale('table.created')}</th>
                <th>{locale('table.status')}</th>
                <th>{locale('table.docType')}</th>
              </tr>
            </thead>
            <tbody>
              {recentDocuments.map((doc) => (
                <tr key={doc.docId} onClick={() => send({ type: 'OPEN_DETAILS', document: doc })} style={{ cursor: 'pointer' }}>
                  <td style={{ textAlign: 'center' }}>
                    {doc.hasAttachment && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    )}
                  </td>
                  <td className="dashboard__table-doc-id">{doc.docId}</td>
                  <td>{doc.sourceReference}</td>
                  <td>{doc.customer}</td>
                  <td>{doc.grossAmount}</td>
                  <td>{doc.created}</td>
                  <td>
                    <span className={`dashboard__status dashboard__status--${doc.status}`}>
                      {STATUS_LABEL[doc.status]}
                    </span>
                  </td>
                  <td>{doc.docType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;