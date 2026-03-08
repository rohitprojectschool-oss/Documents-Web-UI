import { useState } from 'react';
import { useMachine } from '@xstate/react';
import createSettingsMachine from './machine';
import { locale } from '../../locale/locale';
import './Settings.scss';

function Settings() {
  const [state] = useMachine(createSettingsMachine());

  const [showApiKey, setShowApiKey] = useState(false);
  const [autoSubmit, setAutoSubmit] = useState<boolean | null>(null);
  const [editingTerms, setEditingTerms] = useState(false);

  if (state.matches('loading')) {
    return <div className="settings__loading">{locale('common.loading')}</div>;
  }
  if (state.matches('error')) {
    return <div className="settings__error">{locale('common.error')}</div>;
  }

  const { data } = state.context;
  if (!data) return null;

  const { profile, invoiceTerms, apiKey } = data;
  const effectiveAutoSubmit = autoSubmit ?? data.autoSubmit;
  const maskedApiKey = apiKey.replace(/./g, '•').slice(0, 32);

  return (
    <div className="settings">
      <div className="settings__header">
        <h1 className="settings__title">{locale('settings.title')}</h1>
        <p className="settings__subtitle">{locale('settings.subtitle')}</p>
      </div>

      <div className="settings__body">
        {/* Left column */}
        <div className="settings__col">
          {/* Profile Information */}
          <div className="settings__card">
            <div className="settings__card-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <h2>{locale('settings.profileInfo')}</h2>
            </div>

            <div className="settings__field">
              <label>{locale('settings.name')}</label>
              <input type="text" defaultValue={profile.name} />
            </div>
            <div className="settings__field">
              <label>{locale('settings.nif')}</label>
              <input type="text" defaultValue={profile.nif} />
            </div>
            <div className="settings__field">
              <label>{locale('settings.emailAddress')}</label>
              <div className="settings__input-with-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <input type="email" defaultValue={profile.email} />
              </div>
            </div>
            <div className="settings__field">
              <label>{locale('settings.addressLine1')}</label>
              <input type="text" defaultValue={profile.addressLine1} />
            </div>
            <div className="settings__field">
              <label>{locale('settings.addressLine2')}</label>
              <input type="text" defaultValue={profile.addressLine2} />
            </div>
            <div className="settings__row">
              <div className="settings__field">
                <label>{locale('settings.city')}</label>
                <input type="text" defaultValue={profile.city} />
              </div>
              <div className="settings__field">
                <label>{locale('settings.state')}</label>
                <input type="text" defaultValue={profile.state} />
              </div>
            </div>
            <div className="settings__row">
              <div className="settings__field">
                <label>{locale('settings.country')}</label>
                <input type="text" defaultValue={profile.country} />
              </div>
              <div className="settings__field">
                <label>{locale('settings.postalCode')}</label>
                <input type="text" defaultValue={profile.postalCode} />
              </div>
            </div>

            <div className="settings__field">
              <label>{locale('settings.brandImage')}</label>
              <div className="settings__logo-upload">
                <div className="settings__logo-preview">
                  <span>{locale('settings.noLogo')}</span>
                </div>
                <div className="settings__logo-info">
                  <span>{locale('settings.uploadLogo')}</span>
                  <span className="settings__logo-format">{locale('settings.logoFormat')}</span>
                </div>
                <button className="settings__btn settings__btn--outline">{locale('settings.choose')}</button>
              </div>
            </div>

            <div className="settings__card-actions">
              <button className="settings__btn settings__btn--outline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
                </svg>
                {locale('settings.saveProfile')}
              </button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="settings__col">
          {/* Invoice Terms */}
          <div className="settings__card">
            <div className="settings__card-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
              </svg>
              <h2>{locale('settings.invoiceTerms')}</h2>
              <button
                className="settings__btn settings__btn--outline settings__btn--sm settings__card-edit-btn"
                onClick={() => setEditingTerms(!editingTerms)}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
                {locale('settings.edit')}
              </button>
            </div>
            <p className="settings__terms-desc">{locale('settings.invoiceTermsDesc')}</p>
            <textarea
              className="settings__textarea"
              defaultValue={invoiceTerms}
              readOnly={!editingTerms}
              rows={3}
            />
          </div>

          {/* Change Password */}
          <div className="settings__card">
            <div className="settings__card-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              <h2>{locale('settings.changePassword')}</h2>
            </div>

            <div className="settings__field">
              <label>{locale('settings.currentPassword')}</label>
              <div className="settings__password-wrap">
                <input type="password" />
                <button className="settings__eye-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="settings__field">
              <label>{locale('settings.newPassword')}</label>
              <div className="settings__password-wrap">
                <input type="password" />
                <button className="settings__eye-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="settings__field">
              <label>{locale('settings.confirmNewPassword')}</label>
              <div className="settings__password-wrap">
                <input type="password" />
                <button className="settings__eye-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="settings__card-actions">
              <button className="settings__btn settings__btn--outline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z" />
                </svg>
                {locale('settings.updatePassword')}
              </button>
            </div>
          </div>

          {/* API Credentials */}
          <div className="settings__card">
            <div className="settings__card-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
              </svg>
              <h2>{locale('settings.apiCredentials')}</h2>
            </div>

            <div className="settings__field">
              <label>{locale('settings.apiKey')}</label>
              <div className="settings__api-key-wrap">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={showApiKey ? apiKey : maskedApiKey}
                  readOnly
                />
                <button className="settings__eye-btn" onClick={() => setShowApiKey(!showApiKey)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                </button>
                <button
                  className="settings__eye-btn"
                  title="Copy"
                  onClick={() => navigator.clipboard.writeText(apiKey)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="settings__api-warning">{locale('settings.generateNewWarning')}</p>

            <div className="settings__card-actions">
              <button className="settings__btn settings__btn--outline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                </svg>
                {locale('settings.generateNew')}
              </button>
            </div>
          </div>

          {/* Auto Submit */}
          <div className="settings__card">
            <div className="settings__card-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
              <h2>{locale('settings.autoSubmit')}</h2>
            </div>

            <div className="settings__toggle-row">
              <div>
                <div className="settings__toggle-label">{locale('settings.autoSubmitLabel')}</div>
                <div className="settings__toggle-desc">{locale('settings.autoSubmitDesc')}</div>
              </div>
              <button
                className={`settings__toggle${effectiveAutoSubmit ? ' settings__toggle--on' : ''}`}
                onClick={() => setAutoSubmit(!effectiveAutoSubmit)}
                role="switch"
                aria-checked={effectiveAutoSubmit}
              >
                <span className="settings__toggle-thumb" />
              </button>
            </div>

            <div className="settings__card-actions">
              <button className="settings__btn settings__btn--outline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4z" />
                </svg>
                {locale('settings.saveSettings')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings__danger-card">
        <div className="settings__danger-header">
          <div className="settings__danger-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
          </div>
          <div>
            <div className="settings__danger-title">{locale('settings.purgeWorkspace')}</div>
            <div className="settings__danger-desc">{locale('settings.purgeDesc')}</div>
            <div className="settings__danger-warning">{locale('settings.purgeWarning')}</div>
          </div>
        </div>
        <div className="settings__danger-footer">
          <span className="settings__danger-last-chance">{locale('settings.purgeLastChance')}</span>
          <button className="settings__btn settings__btn--danger">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
            {locale('settings.clearInvoices')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
