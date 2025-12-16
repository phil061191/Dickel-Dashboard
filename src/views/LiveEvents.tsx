import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { eventsApi, mitarbeiterApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import type { Event, Mitarbeiter } from '../types';
import { formatDateTime, formatRelativeTime, calculateDuration, formatDuration } from '../utils/helpers';
import './LiveEvents.css';

const LiveEvents = () => {
  const [filter, setFilter] = useState<string>('all');
  const [now, setNow] = useState(new Date());

  const { data: events, loading, error, refetch } = useApi<Event[]>(
    () => eventsApi.getRecent(100),
    []
  );

  const { data: mitarbeiter } = useApi<Mitarbeiter[]>(
    () => mitarbeiterApi.getAll(),
    []
  );

  // Update time every second for duration calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh events
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [refetch]);

  // Group events by Mitarbeiter and get latest status
  const getMitarbeiterStatus = () => {
    if (!events || !mitarbeiter) return [];

    const statusMap = new Map<string, Event>();
    
    // Get latest event for each Mitarbeiter
    events.forEach(event => {
      const existing = statusMap.get(event.mitarbeiterId);
      if (!existing || new Date(event.timestamp) > new Date(existing.timestamp)) {
        statusMap.set(event.mitarbeiterId, event);
      }
    });

    // Map to Mitarbeiter objects with status
    return Array.from(statusMap.values()).map(event => {
      const mitarbeiterData = mitarbeiter.find(m => m.id === event.mitarbeiterId);
      return {
        ...event,
        mitarbeiterName: mitarbeiterData?.name || event.mitarbeiterName || event.mitarbeiterId,
        duration: calculateDuration(event.timestamp, now),
      };
    });
  };

  const filteredEvents = events?.filter(event => {
    if (filter === 'all') return true;
    return event.type.toLowerCase() === filter.toLowerCase();
  }) || [];

  const mitarbeiterStatuses = getMitarbeiterStatus();

  return (
    <div className="live-events">
      <div className="page-header">
        <div>
          <h1>Live Events</h1>
          <p className="page-subtitle">Aktuelle Status und Ereignisse der Mitarbeiter</p>
        </div>
        <button className="refresh-button" onClick={refetch}>
          🔄 Aktualisieren
        </button>
      </div>

      {/* Mitarbeiter Status Cards */}
      <div className="status-section">
        <h2>Aktueller Mitarbeiter-Status</h2>
        {loading && <LoadingSpinner message="Status wird geladen..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}
        
        {!loading && !error && mitarbeiterStatuses.length === 0 && (
          <EmptyState message="Keine Mitarbeiter-Status vorhanden" />
        )}

        {!loading && !error && mitarbeiterStatuses.length > 0 && (
          <div className="status-grid">
            {mitarbeiterStatuses.map((status) => (
              <div key={status.id} className={`status-card status-${status.type.toLowerCase()}`}>
                <div className="status-card-header">
                  <div className="mitarbeiter-name">{status.mitarbeiterName}</div>
                  <div className={`status-badge-live badge-${status.type.toLowerCase()}`}>
                    {status.type}
                  </div>
                </div>
                <div className="status-card-body">
                  <div className="status-info">
                    <span className="info-label">Seit:</span>
                    <span className="info-value">{formatDateTime(status.timestamp)}</span>
                  </div>
                  <div className="status-info">
                    <span className="info-label">Dauer:</span>
                    <span className="info-value running-duration">{formatDuration(status.duration)}</span>
                  </div>
                  {status.notiz && (
                    <div className="status-info">
                      <span className="info-label">Notiz:</span>
                      <span className="info-value">{status.notiz}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event History */}
      <div className="events-section">
        <div className="section-header">
          <h2>Ereignis-Verlauf</h2>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Alle
            </button>
            <button
              className={`filter-btn ${filter === 'arbeitszeit' ? 'active' : ''}`}
              onClick={() => setFilter('arbeitszeit')}
            >
              Arbeitszeit
            </button>
            <button
              className={`filter-btn ${filter === 'kundenzeit' ? 'active' : ''}`}
              onClick={() => setFilter('kundenzeit')}
            >
              Kundenzeit
            </button>
            <button
              className={`filter-btn ${filter === 'fahrt' ? 'active' : ''}`}
              onClick={() => setFilter('fahrt')}
            >
              Fahrt
            </button>
            <button
              className={`filter-btn ${filter === 'pause' ? 'active' : ''}`}
              onClick={() => setFilter('pause')}
            >
              Pause
            </button>
            <button
              className={`filter-btn ${filter === 'feierabend' ? 'active' : ''}`}
              onClick={() => setFilter('feierabend')}
            >
              Feierabend
            </button>
          </div>
        </div>

        {loading && <LoadingSpinner message="Ereignisse werden geladen..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}
        
        {!loading && !error && filteredEvents.length === 0 && (
          <EmptyState message="Keine Ereignisse gefunden" />
        )}

        {!loading && !error && filteredEvents.length > 0 && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mitarbeiter</th>
                  <th>Typ</th>
                  <th>Zeitpunkt</th>
                  <th>Vor</th>
                  <th>Dauer</th>
                  <th>Status</th>
                  <th>Notiz</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.mitarbeiterName || event.mitarbeiterId}</td>
                    <td>
                      <span className={`badge badge-${event.type.toLowerCase()}`}>
                        {event.type}
                      </span>
                    </td>
                    <td>{formatDateTime(event.timestamp)}</td>
                    <td>{formatRelativeTime(event.timestamp)}</td>
                    <td>{event.duration ? formatDuration(event.duration) : '-'}</td>
                    <td>
                      <span className={`status-badge ${event.synced ? 'status-synced' : 'status-pending'}`}>
                        {event.synced ? 'Synchronisiert' : 'Ausstehend'}
                      </span>
                    </td>
                    <td className="notiz-cell">{event.notiz || '-'}</td>
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

export default LiveEvents;
