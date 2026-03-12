import { useMachine } from '@xstate/react';
import { useRef } from 'react';
import createInvoicesMachine from './machine';
import { locale } from '../../locale/locale';
import { COUNTRY_FLAGS, COUNTRY_NAMES } from '../../constants/countries';
import { BASE_URL } from '../../constants/urls';
import type { Invoice, DateRange } from './machine/types';
import './Invoices.scss';

// Helper to resolve the file URL
const getFullFileUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${BASE_URL.replace(/\/$/, '')}${url}`;
};

const STATUS_LABEL: Record<string, string> = {
  all: locale('common.all'),
  pending: locale('common.pending'),
  accepted: locale('common.acceptedByAgt'),
  rejected: locale('common.rejectedByAgt'),
};

const DATE_RANGES: { value: DateRange; labelKey: string }[] = [
  { value: 'all', labelKey: 'invoices.all' },
  { value: 'today', labelKey: 'invoices.today' },
  { value: 'thisWeek', labelKey: 'invoices.thisWeek' },
  { value: 'thisMonth', labelKey: 'invoices.thisMonth' },
  { value: 'thisYear', labelKey: 'invoices.thisYear' },
  { value: 'customDays', labelKey: 'invoices.customDays' },
];

const CrimsonLoader = () => (
  <div className="crimson-loader-wrapper">
    <div className="crimson-loader">
      <div className="crimson-loader-logo">C</div>
    </div>
    <div className="crimson-loader-text">Crimson</div>
  </div>
);

function Invoices() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, send] = useMachine(createInvoicesMachine());

  if (state.matches('loading')) {
    return (
      <div className="invoices__loading">
        <CrimsonLoader />
      </div>
    );
  }
  if (state.matches('error')) {
    return (
      <div className="invoices__error">
        <p>{locale('common.error')}</p>
        <p className="invoices__error-detail">{state.context.error}</p>
        <button onClick={() => send({ type: 'REFRESH' })}>{locale('common.retry')}</button>
      </div>
    );
  }

  const { invoices, selectedCountry, selectedStatus, searchQuery, dateRange, withDocsOnly, showModal, formData, selectedDocument } = state.context;
  const isUploading = state.matches('uploading');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;
    send({ type: 'UPLOAD_DOCUMENT' });
  };

  const filtered = invoices.filter((inv) => {
    if (selectedCountry !== 'all' && inv.countryCode !== selectedCountry) return false;
    if (selectedStatus !== 'all' && inv.status !== selectedStatus) return false;
    if (withDocsOnly && !inv.hasAttachment) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inv.docId.toLowerCase().includes(q) ||
        inv.sourceReference.toLowerCase().includes(q) ||
        inv.customer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Cockpit stats
  const total = filtered.length;
  const errorCount = filtered.filter(i => i.status === 'rejected').length;
  const pendingCount = filtered.filter(i => i.status === 'pending').length;
  const completedCount = filtered.filter(i => i.status === 'accepted').length;

  // Group by country
  const countries = Array.from(new Set(invoices.map(i => i.countryCode))).sort();

  return (
    <div className="invoices">
      <div className="invoices__header">
        <div>
          <h1 className="invoices__title">{locale('invoices.title')}</h1>
          <p className="invoices__subtitle">{total} {locale('invoices.subtitle')}</p>
        </div>
        <button 
          className="invoices__cockpit-upload"
          onClick={() => send({ type: 'TOGGLE_MODAL', show: true })}
          disabled={isUploading}
          title={locale('invoices.upload')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
          </svg>
        </button>
      </div>

      {/* Date Range & Clear Filters */}
      <div className="invoices__filter-bar">
        <div className="invoices__date-range">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
          <span className="invoices__filter-label">{locale('invoices.dateRange')}</span>
          <div className="invoices__range-buttons">
            {DATE_RANGES.map(r => (
              <button
                key={r.value}
                className={`invoices__range-btn${dateRange === r.value ? ' invoices__range-btn--active' : ''}`}
                onClick={() => send({ type: 'SELECT_DATE_RANGE', range: r.value })}
              >
                {locale(r.labelKey)}
              </button>
            ))}
          </div>
        </div>
        <button className="invoices__clear-btn" onClick={() => send({ type: 'CLEAR_FILTERS' })}>
          {locale('invoices.clearFilters')}
        </button>
      </div>

      {/* Summary Dashboard */}
      <div className="invoices__dashboard">
        <div className="invoices__dashboard-total">{total}</div>
        <div className="invoices__dashboard-stats">
          <div className="invoices__stat-pill invoices__stat-pill--error">
            <span className="invoices__stat-dot" />
            <span className="invoices__stat-label">{locale('invoices.error')}</span>
            <span className="invoices__stat-value">{errorCount}</span>
          </div>
          <div className="invoices__stat-pill invoices__stat-pill--pending">
            <span className="invoices__stat-dot" />
            <span className="invoices__stat-label">{locale('invoices.pending')}</span>
            <span className="invoices__stat-value">{pendingCount}</span>
          </div>
          <div className="invoices__stat-pill invoices__stat-pill--completed">
            <span className="invoices__stat-dot" />
            <span className="invoices__stat-label">{locale('invoices.completed')}</span>
            <span className="invoices__stat-value">{completedCount}</span>
          </div>
        </div>
        <div className="invoices__dashboard-toggle">
          <label className="invoices__switch">
            <input 
              type="checkbox" 
              checked={withDocsOnly} 
              onChange={e => send({ type: 'TOGGLE_WITH_DOCS_ONLY', value: e.target.checked })}
            />
            <span className="invoices__slider" />
          </label>
          <span className="invoices__toggle-label">{locale('invoices.withDocsOnly')}</span>
        </div>
      </div>

      {/* Country Breakdown */}
      <div className="invoices__breakdown">
        {countries.map(code => {
          const countryDocs = filtered.filter(i => i.countryCode === code);
          const cTotal = countryDocs.length;
          const cError = countryDocs.filter(i => i.status === 'rejected').length;
          const cPending = countryDocs.filter(i => i.status === 'pending').length;
          const cCompleted = countryDocs.filter(i => i.status === 'accepted').length;

          return (
            <div key={code} className="invoices__country-card">
              <div className="invoices__country-info">
                <span className="invoices__country-flag">{COUNTRY_FLAGS[code] || '🌐'}</span>
                <span className="invoices__country-name">{COUNTRY_NAMES[code] || code}</span>
              </div>
              <div className="invoices__country-stats">
                <div className="invoices__c-stat">
                  <span className="invoices__c-label">{locale('invoices.total')}</span>
                  <span className="invoices__c-value invoices__c-value--bold">{cTotal}</span>
                </div>
                <div className="invoices__c-stat">
                  <span className="invoices__c-label">{locale('invoices.error')}</span>
                  <span className="invoices__c-value invoices__c-value--error">{cError}</span>
                </div>
                <div className="invoices__c-stat">
                  <span className="invoices__c-label">{locale('invoices.pending')}</span>
                  <span className="invoices__c-value invoices__c-value--pending">{cPending}</span>
                </div>
                <div className="invoices__c-stat">
                  <span className="invoices__c-label">{locale('invoices.completed')}</span>
                  <span className="invoices__c-value invoices__c-value--completed">{cCompleted}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      <div className="invoices__table-section">
        <div className="invoices__search-row">
          <div className="invoices__search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="invoices__search-icon">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              className="invoices__search"
              type="text"
              placeholder={locale('invoices.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => send({ type: 'SEARCH', query: e.target.value })}
            />
          </div>
        </div>

        <div className="invoices__table-wrapper">
          <table className="invoices__table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>{locale('table.docId')}</th>
                <th>{locale('table.sourceReference')}</th>
                <th>{locale('table.customer')}</th>
                <th>{locale('table.grossAmount')}</th>
                <th>{locale('table.created')}</th>
                <th>{locale('table.status')}</th>
                <th>{locale('table.country')}</th>
                <th>{locale('table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.docId} onClick={() => send({ type: 'OPEN_DETAILS', document: inv })} style={{ cursor: 'pointer' }}>
                  <td style={{ textAlign: 'center' }}>
                    {inv.hasAttachment && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                    )}
                  </td>
                  <td className="invoices__doc-id">{inv.docId}</td>
                  <td>{inv.sourceReference}</td>
                  <td>{inv.customer}</td>
                  <td>{inv.grossAmount}</td>
                  <td>{inv.created}</td>
                  <td>
                    <span className={`invoices__status invoices__status--${inv.status}`}>
                      {STATUS_LABEL[inv.status]}
                    </span>
                  </td>
                  <td>
                    <span className="invoices__country-badge">{inv.countryCode}</span>
                  </td>
                  <td>
                    {inv.hasAttachment && (
                      <button 
                        className="invoices__view-doc-btn"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (inv.fileUrl) window.open(getFullFileUrl(inv.fileUrl), '_blank');
                        }}
                        title={locale('common.view')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedDocument && (
        <div className="invoices__modal-overlay">
          <div className="invoices__modal invoices__modal--large">
            <div className="invoices__modal-header">
              <h2>{locale('invoices.details')}</h2>
              <button className="invoices__modal-close" onClick={() => send({ type: 'CLOSE_DETAILS' })}>&times;</button>
            </div>
            <div className="invoices__details-content">
              <div className="invoices__details-grid">
                <div className="invoices__detail-item">
                  <label>{locale('table.docId')}</label>
                  <span>{selectedDocument.docId}</span>
                </div>
                <div className="invoices__detail-item">
                  <label>{locale('table.status')}</label>
                  <span className={`invoices__status invoices__status--${selectedDocument.status}`}>
                    {STATUS_LABEL[selectedDocument.status]}
                  </span>
                </div>
                <div className="invoices__detail-item">
                  <label>{locale('table.sourceReference')}</label>
                  <span>{selectedDocument.sourceReference}</span>
                </div>
                <div className="invoices__detail-item">
                  <label>{locale('table.customer')}</label>
                  <span>{selectedDocument.customer}</span>
                </div>
                <div className="invoices__detail-item">
                  <label>{locale('table.grossAmount')}</label>
                  <span>{selectedDocument.grossAmount}</span>
                </div>
                <div className="invoices__detail-item">
                  <label>{locale('table.created')}</label>
                  <span>{selectedDocument.created}</span>
                </div>
                <div className="invoices__detail-item">
                  <label>{locale('table.docType')}</label>
                  <span>{selectedDocument.docType}</span>
                </div>
                <div className="invoices__detail-item">
                  <label>{locale('table.country')}</label>
                  <span>{COUNTRY_NAMES[selectedDocument.countryCode]} ({selectedDocument.countryCode})</span>
                </div>
              </div>
            </div>
            <div className="invoices__modal-footer">
              {selectedDocument.hasAttachment && (
                <div style={{ marginRight: 'auto', display: 'flex', gap: '8px' }}>
                  <button 
                    className="invoices__btn-secondary" 
                    onClick={() => {
                      if (selectedDocument.fileUrl) window.open(getFullFileUrl(selectedDocument.fileUrl), '_blank');
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {locale('common.view')}
                  </button>
                  <button 
                    className="invoices__btn-secondary" 
                    onClick={() => {
                      if (selectedDocument.fileUrl) {
                        const link = document.createElement('a');
                        link.href = getFullFileUrl(selectedDocument.fileUrl);
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
              <button className="invoices__btn-primary" onClick={() => send({ type: 'CLOSE_DETAILS' })}>
                {locale('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="invoices__modal-overlay">
          <div className="invoices__modal">
            <div className="invoices__modal-header">
              <h2>{locale('common.uploadDocument')}</h2>
              <button className="invoices__modal-close" onClick={() => send({ type: 'TOGGLE_MODAL', show: false })}>&times;</button>
            </div>
            <form onSubmit={handleUploadSubmit} className="invoices__form">
              <div className="invoices__form-grid">
                <div className="invoices__form-field invoices__form-field--full">
                  <div 
                    className={`invoices__dropzone${formData.file ? ' invoices__dropzone--active' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file"
                      style={{ display: 'none' }}
                      onChange={e => send({ type: 'UPDATE_FORM', field: 'file', value: e.target.files?.[0] || null })}
                    />
                    <div className="invoices__dropzone-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4a2 2 0 0 1 2-2h14" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                    </div>
                    <div className="invoices__dropzone-text">
                      {formData.file ? formData.file.name : locale('common.uploadInvoice')}
                    </div>
                    <div className="invoices__dropzone-hint">
                      {formData.file ? `${(formData.file.size / 1024).toFixed(1)} KB` : 'Click to select or drag and drop document'}
                    </div>
                  </div>
                </div>

                <div className="invoices__form-field">
                  <label>{locale('common.sourceReference')}</label>
                  <input 
                    required 
                    value={formData.sourceReference}
                    onChange={e => send({ type: 'UPDATE_FORM', field: 'sourceReference', value: e.target.value })}
                    placeholder="e.g. REF-123"
                  />
                </div>
                <div className="invoices__form-field">
                  <label>{locale('common.customerName')}</label>
                  <input 
                    required 
                    value={formData.customer}
                    onChange={e => send({ type: 'UPDATE_FORM', field: 'customer', value: e.target.value })}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div className="invoices__form-field">
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
                <div className="invoices__form-field">
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
                <div className="invoices__form-field invoices__form-field--full">
                  <label>{locale('common.country')}</label>
                  <select 
                    value={formData.countryCode}
                    onChange={e => send({ type: 'UPDATE_FORM', field: 'countryCode', value: e.target.value })}
                  >
                    {countries.map(code => (
                      <option key={code} value={code}>{COUNTRY_NAMES[code] || code}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="invoices__modal-footer">
                <button type="button" className="invoices__btn-secondary" onClick={() => send({ type: 'TOGGLE_MODAL', show: false })}>{locale('common.cancel')}</button>
                <button type="submit" className="invoices__btn-primary" disabled={!formData.file || isUploading}>
                  {isUploading ? locale('common.loading') : locale('common.uploadDocument')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoices;