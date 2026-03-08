import { useMachine } from '@xstate/react';
import { useState } from 'react';
import createInvoicesMachine from './machine';
import { locale } from '../../locale/locale';
import type { Invoice } from './machine/types';
import './Invoices.scss';

const STATUS_LABEL: Record<Invoice['status'], string> = {
  accepted: locale('common.acceptedByAgt'),
  rejected: locale('common.rejectedByAgt'),
  pending: 'Pending',
};

const COUNTRIES = [
  { code: 'all', name: 'All Countries' },
  { code: 'AO', name: 'Angola' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'PT', name: 'Portugal' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'GR', name: 'Greece' },
];

const STATUSES = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

const INITIAL_FORM = {
  sourceReference: '',
  customer: '',
  grossAmount: '',
  docType: 'Standard Invoice',
  countryCode: 'AO',
  countryName: 'Angola',
};

function Invoices() {
  const [state, send] = useMachine(createInvoicesMachine());
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  if (state.matches('loading')) {
    return <div className="invoices__loading">{locale('common.loading')}</div>;
  }

  if (state.matches('error')) {
    return (
      <div className="invoices__error">
        <p>{locale('common.error')}</p>
        <button onClick={() => send({ type: 'REFRESH' })}>{locale('common.retry')}</button>
      </div>
    );
  }

  const { invoices, selectedCountry, selectedStatus, searchQuery } = state.context;
  const isUploading = state.matches('uploading');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      grossAmount: parseFloat(formData.grossAmount),
      countryName: COUNTRIES.find(c => c.code === formData.countryCode)?.name || formData.countryName
    };
    send({ type: 'UPLOAD_INVOICE', data });
    setShowModal(false);
    setFormData(INITIAL_FORM);
  };

  const filtered = invoices.filter((inv) => {
    if (selectedCountry !== 'all' && inv.countryCode !== selectedCountry) return false;
    if (selectedStatus !== 'all' && inv.status !== selectedStatus) return false;
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

  return (
    <div className="invoices">
      <div className="invoices__header">
        <div>
          <h1 className="invoices__title">{locale('invoices.title')}</h1>
          <p className="invoices__subtitle">{locale('invoices.subtitle')}</p>
        </div>
        <button 
          className="invoices__upload-btn"
          onClick={() => setShowModal(true)}
          disabled={isUploading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
          </svg>
          {isUploading ? 'Uploading...' : locale('invoices.upload')}
        </button>
      </div>

      {showModal && (
        <div className="invoices__modal-overlay">
          <div className="invoices__modal">
            <div className="invoices__modal-header">
              <h2>Upload Invoice</h2>
              <button className="invoices__modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleUploadSubmit} className="invoices__form">
              <div className="invoices__form-grid">
                <div className="invoices__form-field">
                  <label>Source Reference</label>
                  <input 
                    required 
                    value={formData.sourceReference}
                    onChange={e => setFormData({...formData, sourceReference: e.target.value})}
                    placeholder="e.g. REF-123"
                  />
                </div>
                <div className="invoices__form-field">
                  <label>Customer Name</label>
                  <input 
                    required 
                    value={formData.customer}
                    onChange={e => setFormData({...formData, customer: e.target.value})}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                <div className="invoices__form-field">
                  <label>Gross Amount</label>
                  <input 
                    required 
                    type="number"
                    step="0.01"
                    value={formData.grossAmount}
                    onChange={e => setFormData({...formData, grossAmount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
                <div className="invoices__form-field">
                  <label>Document Type</label>
                  <select 
                    value={formData.docType}
                    onChange={e => setFormData({...formData, docType: e.target.value})}
                  >
                    <option value="Standard Invoice">Standard Invoice</option>
                    <option value="Credit Note">Credit Note</option>
                    <option value="Debit Note">Debit Note</option>
                  </select>
                </div>
                <div className="invoices__form-field">
                  <label>Country</label>
                  <select 
                    value={formData.countryCode}
                    onChange={e => setFormData({...formData, countryCode: e.target.value})}
                  >
                    {COUNTRIES.filter(c => c.code !== 'all').map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="invoices__modal-footer">
                <button type="button" className="invoices__btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="invoices__btn-primary">Upload Document</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="invoices__filters">
        <div className="invoices__filter-group">
          <div className="invoices__status-tabs">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                className={`invoices__status-tab${selectedStatus === s.value ? ' invoices__status-tab--active' : ''}`}
                onClick={() => send({ type: 'SELECT_STATUS', status: s.value })}
              >
                {s.label}
              </button>
            ))}
          </div>

          <select
            className="invoices__country-select"
            value={selectedCountry}
            onChange={(e) => send({ type: 'SELECT_COUNTRY', country: e.target.value })}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </div>

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
        {filtered.length === 0 ? (
          <div className="invoices__empty">{locale('invoices.noInvoices')}</div>
        ) : (
          <table className="invoices__table">
            <thead>
              <tr>
                <th>{locale('table.docId')}</th>
                <th>{locale('table.sourceReference')}</th>
                <th>{locale('table.customer')}</th>
                <th>{locale('table.grossAmount')}</th>
                <th>{locale('table.created')}</th>
                <th>{locale('table.status')}</th>
                <th>{locale('table.docType')}</th>
                <th>{locale('table.country')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.docId}>
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
                  <td>{inv.docType}</td>
                  <td>
                    <span className="invoices__country-badge">{inv.countryCode}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Invoices;
