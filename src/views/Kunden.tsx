import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { kundenApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import type { Kunde } from '../types';
import './Kunden.css';

const KundenView = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: kunden, loading, error, refetch } = useApi<Kunde[]>(
    () => searchQuery ? kundenApi.search(searchQuery) : kundenApi.getAll(),
    [searchQuery]
  );

  return (
    <div className="kunden-view">
      <div className="page-header">
        <div>
          <h1>Kunden</h1>
          <p className="page-subtitle">Kunden suchen und verwalten</p>
        </div>
      </div>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Kunden suchen (Name, Firma, Kundennummer...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button" onClick={refetch}>
          🔍 Suchen
        </button>
      </div>

      <div className="content-section">
        {loading && <LoadingSpinner message="Kunden werden geladen..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}
        
        {!loading && !error && (!kunden || kunden.length === 0) && (
          <EmptyState message="Keine Kunden gefunden" icon="🏢" />
        )}

        {!loading && !error && kunden && kunden.length > 0 && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Kundennummer</th>
                  <th>Name</th>
                  <th>Firma</th>
                  <th>Adresse</th>
                  <th>Telefon</th>
                  <th>E-Mail</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {kunden.map((kunde) => (
                  <tr key={kunde.id}>
                    <td className="kundennummer-cell">{kunde.kundennummer || '-'}</td>
                    <td className="name-cell">{kunde.name}</td>
                    <td>{kunde.firma || '-'}</td>
                    <td>
                      {kunde.strasse || kunde.plz || kunde.ort ? (
                        <>
                          {kunde.strasse && <div>{kunde.strasse}</div>}
                          {(kunde.plz || kunde.ort) && (
                            <div>{kunde.plz} {kunde.ort}</div>
                          )}
                        </>
                      ) : '-'}
                    </td>
                    <td>{kunde.telefon || '-'}</td>
                    <td>{kunde.email || '-'}</td>
                    <td>
                      <span className={`status-badge ${kunde.aktiv ? 'status-active' : 'status-inactive'}`}>
                        {kunde.aktiv ? 'Aktiv' : 'Inaktiv'}
                      </span>
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

export default KundenView;
