import { useState } from 'react';
import { useApi, useApiMutation } from '../hooks/useApi';
import { servicescheineApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import type { Serviceschein, FilterOptions } from '../types';
import { formatDate, downloadFile } from '../utils/helpers';
import './Servicescheine.css';

const ServicescheineView = () => {
  const [filters, setFilters] = useState<FilterOptions>({});

  const { data: servicescheine, loading, error, refetch } = useApi<Serviceschein[]>(
    () => servicescheineApi.getAll(filters),
    [filters]
  );

  const { mutate: resendMutate, loading: resendLoading } = useApiMutation();

  const handleDownloadPDF = async (id: string, nummer: string) => {
    try {
      const blob = await servicescheineApi.downloadPdf(id);
      downloadFile(blob, `Serviceschein_${nummer}.pdf`);
    } catch {
      alert('Fehler beim Herunterladen des PDFs');
    }
  };

  const handleResend = async (id: string) => {
    try {
      await resendMutate(servicescheineApi.resend, id);
      alert('Serviceschein wird erneut gesendet');
      refetch();
    } catch {
      alert('Fehler beim erneuten Senden');
    }
  };

  return (
    <div className="servicescheine-view">
      <div className="page-header">
        <div>
          <h1>Servicescheine</h1>
          <p className="page-subtitle">Service-Tickets mit PDF-Download und Versandstatus</p>
        </div>
        <button className="refresh-button" onClick={refetch}>
          🔄 Aktualisieren
        </button>
      </div>

      <div className="filter-section">
        <select
          className="filter-select"
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
        >
          <option value="">Alle Status</option>
          <option value="offen">Offen</option>
          <option value="in_bearbeitung">In Bearbeitung</option>
          <option value="abgeschlossen">Abgeschlossen</option>
        </select>
      </div>

      <div className="content-section">
        {loading && <LoadingSpinner message="Servicescheine werden geladen..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}
        
        {!loading && !error && (!servicescheine || servicescheine.length === 0) && (
          <EmptyState message="Keine Servicescheine gefunden" icon="📋" />
        )}

        {!loading && !error && servicescheine && servicescheine.length > 0 && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nummer</th>
                  <th>Kunde</th>
                  <th>Mitarbeiter</th>
                  <th>Datum</th>
                  <th>Status</th>
                  <th>Versandstatus</th>
                  <th>PDF</th>
                  <th>Signatur</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {servicescheine.map((schein) => (
                  <tr key={schein.id}>
                    <td className="nummer-cell">{schein.nummer}</td>
                    <td>{schein.kundeName || schein.kundeId}</td>
                    <td>{schein.mitarbeiterName || schein.mitarbeiterId}</td>
                    <td>{formatDate(schein.datum)}</td>
                    <td>
                      <span className={`badge badge-${schein.status}`}>
                        {schein.status}
                      </span>
                    </td>
                    <td>
                      {schein.versandstatus ? (
                        <span className={`status-badge status-${schein.versandstatus}`}>
                          {schein.versandstatus}
                        </span>
                      ) : (
                        <span className="status-badge status-ausstehend">ausstehend</span>
                      )}
                    </td>
                    <td>
                      {schein.pdfUrl ? (
                        <span className="icon-check">✓</span>
                      ) : (
                        <span className="icon-cross">✗</span>
                      )}
                    </td>
                    <td>
                      {schein.signaturUrl ? (
                        <span className="icon-check">✓</span>
                      ) : (
                        <span className="icon-cross">✗</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {schein.pdfUrl && (
                          <button
                            className="action-btn download-btn"
                            onClick={() => handleDownloadPDF(schein.id, schein.nummer)}
                          >
                            📥 PDF
                          </button>
                        )}
                        {schein.versandstatus === 'fehlgeschlagen' && (
                          <button
                            className="action-btn resend-btn"
                            onClick={() => handleResend(schein.id)}
                            disabled={resendLoading}
                          >
                            📤 Erneut senden
                          </button>
                        )}
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

export default ServicescheineView;
