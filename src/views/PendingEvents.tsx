import { useState } from 'react';
import { useApi, useApiMutation } from '../hooks/useApi';
import { eventsApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import type { Event } from '../types';
import { formatDateTime } from '../utils/helpers';
import './PendingEvents.css';

const PendingEvents = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'failed'>('pending');

  const { data: pendingEvents, loading: pendingLoading, error: pendingError, refetch: refetchPending } = useApi<Event[]>(
    () => eventsApi.getPending(),
    [activeTab]
  );

  const { data: failedEvents, loading: failedLoading, error: failedError, refetch: refetchFailed } = useApi<Event[]>(
    () => eventsApi.getFailed(),
    [activeTab]
  );

  const { mutate: retryMutate, loading: retryLoading } = useApiMutation();
  const { mutate: acceptMutate, loading: acceptLoading } = useApiMutation();
  const { mutate: resendMutate, loading: resendLoading } = useApiMutation();

  const handleRetry = async (id: string) => {
    try {
      await retryMutate(eventsApi.retry, id);
      alert('Ereignis wird erneut versucht');
      refetchPending();
      refetchFailed();
    } catch {
      alert('Fehler beim Wiederholen des Ereignisses');
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await acceptMutate(eventsApi.accept, id);
      alert('Ereignis wurde akzeptiert');
      refetchPending();
      refetchFailed();
    } catch {
      alert('Fehler beim Akzeptieren des Ereignisses');
    }
  };

  const handleResend = async (id: string) => {
    try {
      await resendMutate(eventsApi.resend, id);
      alert('Ereignis wird erneut gesendet');
      refetchPending();
      refetchFailed();
    } catch {
      alert('Fehler beim erneuten Senden des Ereignisses');
    }
  };

  const events = activeTab === 'pending' ? pendingEvents : failedEvents;
  const loading = activeTab === 'pending' ? pendingLoading : failedLoading;
  const error = activeTab === 'pending' ? pendingError : failedError;
  const refetch = activeTab === 'pending' ? refetchPending : refetchFailed;

  const isActionLoading = retryLoading || acceptLoading || resendLoading;

  return (
    <div className="pending-events">
      <div className="page-header">
        <div>
          <h1>Pending & Fehler Events</h1>
          <p className="page-subtitle">Verwaltung von nicht synchronisierten und fehlerhaften Ereignissen</p>
        </div>
        <button className="refresh-button" onClick={refetch} disabled={loading}>
          🔄 Aktualisieren
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending ({pendingEvents?.length || 0})
        </button>
        <button
          className={`tab ${activeTab === 'failed' ? 'active' : ''}`}
          onClick={() => setActiveTab('failed')}
        >
          ❌ Fehler ({failedEvents?.length || 0})
        </button>
      </div>

      <div className="content-section">
        {loading && <LoadingSpinner message="Ereignisse werden geladen..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}
        
        {!loading && !error && (!events || events.length === 0) && (
          <EmptyState
            message={activeTab === 'pending' ? 'Keine ausstehenden Ereignisse' : 'Keine fehlerhaften Ereignisse'}
            icon={activeTab === 'pending' ? '✅' : '🎉'}
          />
        )}

        {!loading && !error && events && events.length > 0 && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Mitarbeiter</th>
                  <th>Typ</th>
                  <th>Zeitpunkt</th>
                  <th>Versuche</th>
                  {activeTab === 'failed' && <th>Fehler</th>}
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="id-cell">{event.id.substring(0, 8)}...</td>
                    <td>{event.mitarbeiterName || event.mitarbeiterId}</td>
                    <td>
                      <span className={`badge badge-${event.type.toLowerCase()}`}>
                        {event.type}
                      </span>
                    </td>
                    <td>{formatDateTime(event.timestamp)}</td>
                    <td>
                      <span className="retry-count">{event.retryCount || 0}</span>
                    </td>
                    {activeTab === 'failed' && (
                      <td className="error-cell">
                        <span className="error-text" title={event.error}>
                          {event.error || 'Unbekannter Fehler'}
                        </span>
                      </td>
                    )}
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn retry-btn"
                          onClick={() => handleRetry(event.id)}
                          disabled={isActionLoading}
                          title="Erneut versuchen"
                        >
                          🔄 Retry
                        </button>
                        <button
                          className="action-btn resend-btn"
                          onClick={() => handleResend(event.id)}
                          disabled={isActionLoading}
                          title="Erneut senden"
                        >
                          📤 Resend
                        </button>
                        <button
                          className="action-btn accept-btn"
                          onClick={() => handleAccept(event.id)}
                          disabled={isActionLoading}
                          title="Akzeptieren (als erledigt markieren)"
                        >
                          ✓ Accept
                        </button>
                      </div>
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

export default PendingEvents;
