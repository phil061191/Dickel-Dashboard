import { useApi } from '../hooks/useApi';
import { materialApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import type { Material, MaterialBewegung } from '../types';
import { formatDateTime } from '../utils/helpers';
import './Material.css';

const MaterialView = () => {
  const { data: material, loading: materialLoading, error: materialError, refetch: refetchMaterial } = useApi<Material[]>(
    () => materialApi.getAll(),
    []
  );

  const { data: bewegungen, loading: bewegungenLoading, error: bewegungenError, refetch: refetchBewegungen } = useApi<MaterialBewegung[]>(
    () => materialApi.getBewegungen(),
    []
  );

  return (
    <div className="material-view">
      <div className="page-header">
        <div>
          <h1>Material & Verbrauch</h1>
          <p className="page-subtitle">Bestandsverwaltung und Bewegungsübersicht (Platzhalter)</p>
        </div>
      </div>

      <div className="content-section">
        <h2>Materialbestand</h2>
        {materialLoading && <LoadingSpinner message="Material wird geladen..." />}
        {materialError && <ErrorMessage message={materialError} onRetry={refetchMaterial} />}
        
        {!materialLoading && !materialError && (!material || material.length === 0) && (
          <EmptyState message="Keine Materialdaten verfügbar" icon="📦" />
        )}

        {!materialLoading && !materialError && material && material.length > 0 && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Artikelnummer</th>
                  <th>Bezeichnung</th>
                  <th>Bestand</th>
                  <th>Einheit</th>
                  <th>Mindestbestand</th>
                  <th>Kategorie</th>
                </tr>
              </thead>
              <tbody>
                {material.map((item) => (
                  <tr key={item.id}>
                    <td className="artikelnummer-cell">{item.artikelnummer}</td>
                    <td>{item.bezeichnung}</td>
                    <td>
                      <span className={item.mindestbestand && item.bestand < item.mindestbestand ? 'low-stock' : ''}>
                        {item.bestand}
                      </span>
                    </td>
                    <td>{item.einheit}</td>
                    <td>{item.mindestbestand || '-'}</td>
                    <td>{item.kategorie || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="content-section">
        <h2>Materialbewegungen</h2>
        {bewegungenLoading && <LoadingSpinner message="Bewegungen werden geladen..." />}
        {bewegungenError && <ErrorMessage message={bewegungenError} onRetry={refetchBewegungen} />}
        
        {!bewegungenLoading && !bewegungenError && (!bewegungen || bewegungen.length === 0) && (
          <EmptyState message="Keine Bewegungen vorhanden" icon="📊" />
        )}

        {!bewegungenLoading && !bewegungenError && bewegungen && bewegungen.length > 0 && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Material</th>
                  <th>Typ</th>
                  <th>Menge</th>
                  <th>Mitarbeiter</th>
                  <th>Notiz</th>
                </tr>
              </thead>
              <tbody>
                {bewegungen.map((bewegung) => (
                  <tr key={bewegung.id}>
                    <td>{formatDateTime(bewegung.datum)}</td>
                    <td>{bewegung.materialBezeichnung || bewegung.materialId}</td>
                    <td>
                      <span className={`badge badge-${bewegung.typ}`}>
                        {bewegung.typ}
                      </span>
                    </td>
                    <td className={bewegung.typ === 'eingang' ? 'text-green' : bewegung.typ === 'ausgang' ? 'text-red' : ''}>
                      {bewegung.typ === 'eingang' ? '+' : bewegung.typ === 'ausgang' ? '-' : ''}{bewegung.menge}
                    </td>
                    <td>{bewegung.mitarbeiterName || bewegung.mitarbeiterId || '-'}</td>
                    <td>{bewegung.notiz || '-'}</td>
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

export default MaterialView;
