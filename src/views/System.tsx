import { useEffect } from 'react';
import { useApi, useApiMutation } from '../hooks/useApi';
import { systemApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import type { ApiHealth, ApiError } from '../types';
import { formatDateTime, formatRelativeTime } from '../utils/helpers';
import './System.css';

const SystemView = () => {
  const { data: health, loading: healthLoading, error: healthError, refetch: refetchHealth } = useApi<ApiHealth>(
    () => systemApi.getHealth(),
    []
  );

  const { data: errors, loading: errorsLoading, error: errorsError, refetch: refetchErrors } = useApi<ApiError[]>(
    () => systemApi.getErrors(),
    []
  );

  const { mutate: retrySyncMutate, loading: retrySyncLoading } = useApiMutation();

  useEffect(() => {
    const interval = setInterval(() => {
      refetchHealth();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [refetchHealth]);

  const handleRetrySync = async () => {
    try {
      await retrySyncMutate(systemApi.retrySync, {});
      alert('Synchronisation wird wiederholt');
      refetchHealth();
      refetchErrors();
    } catch (err) {
      alert('Fehler beim Wiederholen der Synchronisation');
    }
  };

  const unresolvedErrors = errors?.filter(e => !e.resolved) || [];

  return (
    <div className="system-view">
      <div className="page-header">
        <div>
          <h1>System & Logs</h1>
          <p className="page-subtitle">API-Gesundheit, Fehler und Synchronisation</p>
        </div>
        <button
          className="retry-sync-button"
          onClick={handleRetrySync}
          disabled={retrySyncLoading}
        >
          🔄 Sync wiederholen
        </button>
      </div>

      {/* Health Status */}
      <div className="health-section">
        <h2>API Gesundheit</h2>
        {healthLoading && <LoadingSpinner message="Status wird geladen..." />}
        {healthError && <ErrorMessage message={healthError} onRetry={refetchHealth} />}
        
        {!healthLoading && !healthError && health && (
          <div className={`health-card health-${health.status}`}>
            <div className="health-icon">
              {health.status === 'healthy' ? '✅' : health.status === 'degraded' ? '⚠️' : '❌'}
            </div>
            <div className="health-details">
              <div className="health-status">
                Status: <strong>{health.status}</strong>
              </div>
              <div className="health-info">
                Letzter Check: {formatDateTime(health.lastCheck)}
              </div>
              {health.responseTime && (
                <div className="health-info">
                  Antwortzeit: {health.responseTime}ms
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Errors */}
      <div className="errors-section">
        <div className="section-header">
          <h2>Fehlerprotokoll</h2>
          <div className="error-stats">
            <span className="error-count">
              Offene Fehler: <strong>{unresolvedErrors.length}</strong>
            </span>
            <button className="refresh-button" onClick={refetchErrors}>
              🔄 Aktualisieren
            </button>
          </div>
        </div>

        {errorsLoading && <LoadingSpinner message="Fehler werden geladen..." />}
        {errorsError && <ErrorMessage message={errorsError} onRetry={refetchErrors} />}
        
        {!errorsLoading && !errorsError && (!errors || errors.length === 0) && (
          <EmptyState message="Keine Fehler vorhanden" icon="🎉" />
        )}

        {!errorsLoading && !errorsError && errors && errors.length > 0 && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Zeitpunkt</th>
                  <th>Vor</th>
                  <th>Endpoint</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Nachricht</th>
                  <th>Gelöst</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((error) => (
                  <tr key={error.id} className={error.resolved ? 'resolved-row' : ''}>
                    <td>{formatDateTime(error.timestamp)}</td>
                    <td>{formatRelativeTime(error.timestamp)}</td>
                    <td className="endpoint-cell">{error.endpoint}</td>
                    <td>
                      <span className="method-badge">{error.method}</span>
                    </td>
                    <td>
                      <span className={`status-code ${error.statusCode && error.statusCode >= 500 ? 'status-server-error' : 'status-client-error'}`}>
                        {error.statusCode || 'N/A'}
                      </span>
                    </td>
                    <td className="message-cell" title={error.message}>
                      {error.message}
                    </td>
                    <td>
                      {error.resolved ? (
                        <span className="status-badge status-resolved">✓ Ja</span>
                      ) : (
                        <span className="status-badge status-unresolved">✗ Nein</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemView;
