import { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { eventsApi, mitarbeiterApi, servicescheineApi, systemApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { Event, Mitarbeiter, Serviceschein, ApiHealth } from '../types';
import { formatDateTime, formatRelativeTime } from '../utils/helpers';
import './Dashboard.css';

const Dashboard = () => {
  const { data: recentEvents, loading: eventsLoading, error: eventsError, refetch: refetchEvents } = useApi<Event[]>(
    () => eventsApi.getRecent(10),
    []
  );

  const { data: mitarbeiter, loading: mitarbeiterLoading } = useApi<Mitarbeiter[]>(
    () => mitarbeiterApi.getAll(),
    []
  );

  const { data: servicescheine, loading: servicescheineLoading } = useApi<Serviceschein[]>(
    () => servicescheineApi.getAll({ status: 'offen' }),
    []
  );

  const { data: health, loading: healthLoading, refetch: refetchHealth } = useApi<ApiHealth>(
    () => systemApi.getHealth(),
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      refetchHealth();
    }, 30000); // Refresh health every 30 seconds

    return () => clearInterval(interval);
  }, [refetchHealth]);

  const activeMitarbeiter = mitarbeiter?.filter(m => m.aktiv) || [];
  const offeneScheine = servicescheine?.length || 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-time">
          {formatDateTime(new Date())}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-label">Aktive Mitarbeiter</div>
            <div className="stat-value">{mitarbeiterLoading ? '...' : activeMitarbeiter.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-label">Offene Servicescheine</div>
            <div className="stat-value">{servicescheineLoading ? '...' : offeneScheine}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🕐</div>
          <div className="stat-content">
            <div className="stat-label">Aktuelle Events</div>
            <div className="stat-value">{eventsLoading ? '...' : (recentEvents?.length || 0)}</div>
          </div>
        </div>

        <div className={`stat-card ${health?.status === 'healthy' ? 'stat-success' : health?.status === 'degraded' ? 'stat-warning' : 'stat-error'}`}>
          <div className="stat-icon">
            {health?.status === 'healthy' ? '✅' : health?.status === 'degraded' ? '⚠️' : '❌'}
          </div>
          <div className="stat-content">
            <div className="stat-label">API Status</div>
            <div className="stat-value">{healthLoading ? '...' : (health?.status || 'Unknown')}</div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Letzte Ereignisse</h2>
          <button className="refresh-button" onClick={refetchEvents}>
            🔄 Aktualisieren
          </button>
        </div>

        {eventsLoading && <LoadingSpinner message="Ereignisse werden geladen..." />}
        {eventsError && <ErrorMessage message={eventsError} onRetry={refetchEvents} />}
        
        {!eventsLoading && !eventsError && recentEvents && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mitarbeiter</th>
                  <th>Typ</th>
                  <th>Zeitpunkt</th>
                  <th>Vor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-row">Keine Ereignisse vorhanden</td>
                  </tr>
                ) : (
                  recentEvents.map((event) => (
                    <tr key={event.id}>
                      <td>{event.mitarbeiterName || event.mitarbeiterId}</td>
                      <td>
                        <span className={`badge badge-${event.type.toLowerCase()}`}>
                          {event.type}
                        </span>
                      </td>
                      <td>{formatDateTime(event.timestamp)}</td>
                      <td>{formatRelativeTime(event.timestamp)}</td>
                      <td>
                        <span className={`status-badge ${event.synced ? 'status-synced' : 'status-pending'}`}>
                          {event.synced ? 'Synchronisiert' : 'Ausstehend'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
