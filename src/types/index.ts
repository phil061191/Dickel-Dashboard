// Employee Status Types
export type MitarbeiterStatus = 
  | 'Arbeitszeit' 
  | 'Kundenzeit' 
  | 'Fahrt' 
  | 'Pause' 
  | 'Feierabend';

// Employee Interface
export interface Mitarbeiter {
  id: string;
  name: string;
  vorname?: string;
  nachname?: string;
  email?: string;
  rolle?: string;
  pin?: string;
  nfcId?: string;
  status?: MitarbeiterStatus;
  aktiv: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Event Interface
export interface Event {
  id: string;
  mitarbeiterId: string;
  mitarbeiterName?: string;
  type: MitarbeiterStatus;
  timestamp: string;
  duration?: number; // in seconds
  synced: boolean;
  error?: string;
  retryCount?: number;
  latitude?: number;
  longitude?: number;
  notiz?: string;
}

// Customer Interface
export interface Kunde {
  id: string;
  name: string;
  firma?: string;
  strasse?: string;
  plz?: string;
  ort?: string;
  telefon?: string;
  email?: string;
  kundennummer?: string;
  aktiv: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Service Ticket Interface
export interface Serviceschein {
  id: string;
  nummer: string;
  kundeId: string;
  kundeName?: string;
  mitarbeiterId: string;
  mitarbeiterName?: string;
  datum: string;
  beschreibung: string;
  status: 'offen' | 'in_bearbeitung' | 'abgeschlossen';
  versandstatus?: 'gesendet' | 'fehlgeschlagen' | 'ausstehend';
  pdfUrl?: string;
  signaturUrl?: string;
  versandtAm?: string;
  versandError?: string;
  createdAt: string;
  updatedAt: string;
}

// Material/Inventory Interface
export interface Material {
  id: string;
  artikelnummer: string;
  bezeichnung: string;
  einheit: string;
  bestand: number;
  mindestbestand?: number;
  preis?: number;
  kategorie?: string;
}

// Material Movement Interface
export interface MaterialBewegung {
  id: string;
  materialId: string;
  materialBezeichnung?: string;
  mitarbeiterId?: string;
  mitarbeiterName?: string;
  servicescheinId?: string;
  menge: number;
  typ: 'eingang' | 'ausgang' | 'korrektur';
  datum: string;
  notiz?: string;
}

// Dictation/Note Interface
export interface Diktat {
  id: string;
  mitarbeiterId: string;
  mitarbeiterName?: string;
  servicescheinId?: string;
  typ: 'audio' | 'text' | 'bild';
  inhalt?: string; // text content
  dateiUrl?: string; // audio/image file URL
  datum: string;
  transkription?: string;
}

// API Health Interface
export interface ApiHealth {
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: string;
  responseTime?: number;
  errors?: ApiError[];
}

// Error Log Interface
export interface ApiError {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  statusCode?: number;
  message: string;
  stack?: string;
  resolved: boolean;
}

// Filter Options
export interface FilterOptions {
  mitarbeiterId?: string;
  kundeId?: string;
  startDatum?: string;
  endDatum?: string;
  status?: string;
  search?: string;
}

// Pagination
export interface Pagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: Pagination;
}
