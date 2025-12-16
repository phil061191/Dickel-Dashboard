import { useState } from 'react';
import { useApi, useApiMutation } from '../hooks/useApi';
import { mitarbeiterApi } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import type { Mitarbeiter } from '../types';
import './Mitarbeiter.css';

const MitarbeiterView = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Mitarbeiter>>({
    name: '',
    vorname: '',
    nachname: '',
    email: '',
    rolle: '',
    pin: '',
    nfcId: '',
    aktiv: true,
  });

  const { data: mitarbeiter, loading, error, refetch } = useApi<Mitarbeiter[]>(
    () => mitarbeiterApi.getAll(),
    []
  );

  const { mutate: createMutate, loading: createLoading } = useApiMutation();
  const { mutate: updateMutate, loading: updateLoading } = useApiMutation();
  const { mutate: deleteMutate, loading: deleteLoading } = useApiMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutate((params: any) => mitarbeiterApi.update(params.id, params.data), { id: editingId, data: formData });
        alert('Mitarbeiter erfolgreich aktualisiert');
      } else {
        await createMutate(mitarbeiterApi.create, formData);
        alert('Mitarbeiter erfolgreich erstellt');
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      refetch();
    } catch (err) {
      alert('Fehler beim Speichern des Mitarbeiters');
    }
  };

  const handleEdit = (m: Mitarbeiter) => {
    setEditingId(m.id);
    setFormData({
      name: m.name,
      vorname: m.vorname,
      nachname: m.nachname,
      email: m.email,
      rolle: m.rolle,
      pin: m.pin,
      nfcId: m.nfcId,
      aktiv: m.aktiv,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diesen Mitarbeiter wirklich löschen?')) return;
    try {
      await deleteMutate(mitarbeiterApi.delete, id);
      alert('Mitarbeiter erfolgreich gelöscht');
      refetch();
    } catch (err) {
      alert('Fehler beim Löschen des Mitarbeiters');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      vorname: '',
      nachname: '',
      email: '',
      rolle: '',
      pin: '',
      nfcId: '',
      aktiv: true,
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const isFormLoading = createLoading || updateLoading || deleteLoading;

  return (
    <div className="mitarbeiter-view">
      <div className="page-header">
        <div>
          <h1>Mitarbeiter-Verwaltung</h1>
          <p className="page-subtitle">Mitarbeiter verwalten, erstellen und bearbeiten</p>
        </div>
        <button
          className="create-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Abbrechen' : '+ Neuer Mitarbeiter'}
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <h2>{editingId ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Vorname</label>
                <input
                  type="text"
                  value={formData.vorname}
                  onChange={(e) => setFormData({ ...formData, vorname: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Nachname</label>
                <input
                  type="text"
                  value={formData.nachname}
                  onChange={(e) => setFormData({ ...formData, nachname: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>E-Mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Rolle</label>
                <input
                  type="text"
                  value={formData.rolle}
                  onChange={(e) => setFormData({ ...formData, rolle: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>PIN</label>
                <input
                  type="text"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>NFC ID</label>
                <input
                  type="text"
                  value={formData.nfcId}
                  onChange={(e) => setFormData({ ...formData, nfcId: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.aktiv}
                    onChange={(e) => setFormData({ ...formData, aktiv: e.target.checked })}
                  />
                  <span>Aktiv</span>
                </label>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={handleCancel}>
                Abbrechen
              </button>
              <button type="submit" className="submit-button" disabled={isFormLoading}>
                {isFormLoading ? 'Speichern...' : 'Speichern'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="content-section">
        {loading && <LoadingSpinner message="Mitarbeiter werden geladen..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}
        
        {!loading && !error && (!mitarbeiter || mitarbeiter.length === 0) && (
          <EmptyState message="Keine Mitarbeiter vorhanden" icon="👥" />
        )}

        {!loading && !error && mitarbeiter && mitarbeiter.length > 0 && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Vorname</th>
                  <th>Nachname</th>
                  <th>E-Mail</th>
                  <th>Rolle</th>
                  <th>PIN</th>
                  <th>NFC ID</th>
                  <th>Status</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {mitarbeiter.map((m) => (
                  <tr key={m.id}>
                    <td className="name-cell">{m.name}</td>
                    <td>{m.vorname || '-'}</td>
                    <td>{m.nachname || '-'}</td>
                    <td>{m.email || '-'}</td>
                    <td>{m.rolle || '-'}</td>
                    <td className="pin-cell">{m.pin || '-'}</td>
                    <td className="nfc-cell">{m.nfcId || '-'}</td>
                    <td>
                      <span className={`status-badge ${m.aktiv ? 'status-active' : 'status-inactive'}`}>
                        {m.aktiv ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(m)}
                          disabled={isFormLoading}
                        >
                          ✏️ Bearbeiten
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(m.id)}
                          disabled={isFormLoading}
                        >
                          🗑️ Löschen
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

export default MitarbeiterView;
