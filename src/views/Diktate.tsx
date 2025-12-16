import { useApi } from '../hooks/useApi';
import { diktateApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import type { Diktat } from '../types';
import { formatDateTime } from '../utils/helpers';
import './Diktate.css';

const DiktateView = () => {
  const { data: diktate, loading, error, refetch } = useApi<Diktat[]>(
    () => diktateApi.getAll(),
    []
  );

  return (
    <div className="diktate-view">
      <div className="page-header">
        <div>
          <h1>Diktate & Notizen</h1>
          <p className="page-subtitle">Audio-Aufnahmen, Texte und Bilder aus der App</p>
        </div>
        <button className="refresh-button" onClick={refetch}>
          🔄 Aktualisieren
        </button>
      </div>

      <div className="content-section">
        {loading && <LoadingSpinner message="Diktate werden geladen..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}
        
        {!loading && !error && (!diktate || diktate.length === 0) && (
          <EmptyState message="Keine Diktate vorhanden" icon="🎤" />
        )}

        {!loading && !error && diktate && diktate.length > 0 && (
          <div className="diktate-grid">
            {diktate.map((diktat) => (
              <div key={diktat.id} className={`diktat-card diktat-${diktat.typ}`}>
                <div className="diktat-header">
                  <span className={`diktat-type-badge badge-${diktat.typ}`}>
                    {diktat.typ === 'audio' ? '🎤' : diktat.typ === 'text' ? '📝' : '📷'} {diktat.typ}
                  </span>
                  <span className="diktat-date">{formatDateTime(diktat.datum)}</span>
                </div>
                <div className="diktat-body">
                  <div className="diktat-info">
                    <strong>Mitarbeiter:</strong> {diktat.mitarbeiterName || diktat.mitarbeiterId}
                  </div>
                  {diktat.servicescheinId && (
                    <div className="diktat-info">
                      <strong>Serviceschein:</strong> {diktat.servicescheinId}
                    </div>
                  )}
                  {diktat.inhalt && (
                    <div className="diktat-content">
                      <strong>Inhalt:</strong>
                      <p>{diktat.inhalt}</p>
                    </div>
                  )}
                  {diktat.transkription && (
                    <div className="diktat-content">
                      <strong>Transkription:</strong>
                      <p>{diktat.transkription}</p>
                    </div>
                  )}
                  {diktat.dateiUrl && (
                    <div className="diktat-file">
                      {diktat.typ === 'audio' ? (
                        <audio controls className="audio-player">
                          <source src={diktat.dateiUrl} />
                          Ihr Browser unterstützt kein Audio.
                        </audio>
                      ) : diktat.typ === 'bild' ? (
                        <img src={diktat.dateiUrl} alt="Diktat" className="diktat-image" />
                      ) : (
                        <a href={diktat.dateiUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                          📎 Datei öffnen
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiktateView;
