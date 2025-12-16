# Dickel Dashboard

Web-basiertes Dashboard für die Dickel-Anwendung zur Verwaltung von Mitarbeitern, Kunden, Servicescheinen und Zeiterfassung.

## Übersicht

Das Dickel Dashboard ist eine React-basierte Webanwendung, die eine umfassende Verwaltungsoberfläche für die Dickel-App bietet. Es ermöglicht die Verwaltung von Mitarbeiterdaten, Kundendaten, Servicescheinen, Materialbestand und bietet Echtzeit-Einblicke in Mitarbeiteraktivitäten.

## Features

### ✅ Implementierte Funktionen

- **Dashboard (Übersicht)**
  - Statistiken zu aktiven Mitarbeitern, offenen Servicescheinen und aktuellen Events
  - API-Gesundheitsstatus in Echtzeit
  - Übersicht der letzten Ereignisse

- **Live Events**
  - Aktueller Status aller Mitarbeiter (Arbeitszeit, Kundenzeit, Fahrt, Pause, Feierabend)
  - Laufende Dauern in Echtzeit
  - Ereignis-Verlauf mit Filteroptionen
  - Auto-Refresh alle 10 Sekunden

- **Pending & Fehler Events**
  - Verwaltung nicht synchronisierter Einträge
  - Fehlerhafte Events mit detaillierter Fehleranzeige
  - Retry, Resend und Accept Aktionen

- **Mitarbeiter-Verwaltung**
  - Liste aller Mitarbeiter
  - Erstellen und Bearbeiten von Mitarbeiterdaten
  - Verwaltung von Rollen, PIN und NFC-IDs
  - Aktivieren/Deaktivieren von Mitarbeitern

- **Kunden-Verwaltung**
  - Kundenliste mit Suchfunktion
  - Anzeige von Kundennummer, Firma, Adresse, Kontaktdaten
  - Statusverwaltung (aktiv/inaktiv)

- **Servicescheine**
  - Liste aller Servicescheine mit Filteroptionen
  - Versandstatus-Anzeige (gesendet/fehlgeschlagen/ausstehend)
  - PDF-Download-Funktion
  - Signatur- und PDF-Referenzen
  - "Erneut senden" Funktion für fehlgeschlagene Versendungen

- **Material & Verbrauch**
  - Materialbestandsübersicht
  - Materialbewegungen (Eingang/Ausgang/Korrektur)
  - Mindestbestandswarnungen

- **Diktate & Notizen**
  - Anzeige von Audio-Aufnahmen, Texten und Bildern
  - Audio-Player für Sprachnotizen
  - Bildanzeige für visuelle Dokumentation
  - Transkriptionen anzeigen

- **System & Logs**
  - API-Gesundheitsüberwachung
  - Fehlerprotokoll mit Details
  - Sync-Wiederholungsfunktion
  - Automatische Aktualisierung alle 30 Sekunden

### 🔧 Technische Features

- **API-Integration**
  - Verbindung zum Google Apps Script Backend
  - Base URL: `https://script.google.com/macros/s/AKfycbyDamcZLDF-CDCzRy_xdgIBBs71rNK_XbQLE9CbTVfY/exec/`
  - API-Key Authentifizierung via Header `X-API-Key`
  - Umfassendes Fehlerhandling
  - Request/Response Logging

- **UI/UX**
  - Responsive Design (Desktop-first)
  - Clean und moderne Benutzeroberfläche
  - Loading, Error und Empty States
  - Konsistentes Styling
  - Intuitive Navigation

- **Entwicklung**
  - TypeScript für Type Safety
  - React 19 mit Hooks
  - Vite für schnelles Building
  - ESLint für Code-Qualität
  - Hot Module Replacement (HMR)

## Installation

### Voraussetzungen

- Node.js (Version 18 oder höher)
- npm (kommt mit Node.js)

### Setup

1. Repository klonen:
```bash
git clone https://github.com/phil061191/Dickel-Dashboard.git
cd Dickel-Dashboard
```

2. Abhängigkeiten installieren:
```bash
npm install
```

## Verwendung

### Entwicklung

Starten Sie den Development Server:

```bash
npm run dev
```

Die Anwendung ist dann unter `http://localhost:5173` erreichbar.

### Production Build

Erstellen Sie einen Production Build:

```bash
npm run build
```

Die Build-Dateien werden im `dist/` Ordner erstellt.

### Preview

Vorschau des Production Builds:

```bash
npm run preview
```

### Linting

Code-Qualität überprüfen:

```bash
npm run lint
```

## Projektstruktur

```
dickel-dashboard/
├── src/
│   ├── api/              # API Client und Service-Funktionen
│   │   ├── client.ts     # Axios-Konfiguration mit Interceptors
│   │   └── index.ts      # API-Methoden für alle Endpoints
│   ├── components/       # Wiederverwendbare UI-Komponenten
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── EmptyState.tsx
│   ├── hooks/            # Custom React Hooks
│   │   └── useApi.ts     # Hook für API-Aufrufe und Mutations
│   ├── layouts/          # Layout-Komponenten
│   │   └── MainLayout.tsx
│   ├── types/            # TypeScript Type Definitionen
│   │   └── index.ts
│   ├── utils/            # Hilfsfunktionen
│   │   └── helpers.ts    # Datum, Export, Download, etc.
│   ├── views/            # Haupt-Seiten-Komponenten
│   │   ├── Dashboard.tsx
│   │   ├── LiveEvents.tsx
│   │   ├── PendingEvents.tsx
│   │   ├── Mitarbeiter.tsx
│   │   ├── Kunden.tsx
│   │   ├── Servicescheine.tsx
│   │   ├── Material.tsx
│   │   ├── Diktate.tsx
│   │   └── System.tsx
│   ├── App.tsx           # Haupt-App-Komponente mit Routing
│   ├── main.tsx          # App Entry Point
│   ├── App.css           # Globale Styles
│   └── index.css         # Base Styles
├── public/               # Statische Assets
├── dist/                 # Production Build (generiert)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## API-Endpunkte

Die Anwendung kommuniziert mit folgenden Backend-Endpunkten:

### Mitarbeiter
- `GET /mitarbeiter` - Alle Mitarbeiter abrufen
- `GET /mitarbeiter/:id` - Einzelnen Mitarbeiter abrufen
- `POST /mitarbeiter` - Neuen Mitarbeiter erstellen
- `PUT /mitarbeiter/:id` - Mitarbeiter aktualisieren
- `DELETE /mitarbeiter/:id` - Mitarbeiter löschen

### Events
- `GET /events` - Alle Events mit Filtern
- `GET /events/recent` - Letzte Events
- `GET /events/pending` - Ausstehende Events
- `GET /events/failed` - Fehlgeschlagene Events
- `POST /events/:id/retry` - Event wiederholen
- `POST /events/:id/accept` - Event akzeptieren
- `POST /events/:id/resend` - Event erneut senden

### Kunden
- `GET /kunden` - Alle Kunden mit Filtern
- `GET /kunden/:id` - Einzelnen Kunden abrufen
- `GET /kunden/search` - Kunden suchen
- `POST /kunden` - Neuen Kunden erstellen
- `PUT /kunden/:id` - Kunden aktualisieren

### Servicescheine
- `GET /servicescheine` - Alle Servicescheine mit Filtern
- `GET /servicescheine/:id` - Einzelnen Serviceschein abrufen
- `GET /servicescheine/:id/pdf` - PDF herunterladen
- `POST /servicescheine` - Neuen Serviceschein erstellen
- `PUT /servicescheine/:id` - Serviceschein aktualisieren
- `POST /servicescheine/:id/resend` - Serviceschein erneut senden

### Material
- `GET /material` - Alle Materialien
- `GET /material/:id` - Einzelnes Material
- `GET /material/bewegungen` - Materialbewegungen

### Diktate
- `GET /diktate` - Alle Diktate mit Filtern
- `GET /diktate/:id` - Einzelnes Diktat

### System
- `GET /system/health` - API-Gesundheitsstatus
- `GET /system/errors` - Fehlerprotokoll
- `POST /system/retry-sync` - Synchronisation wiederholen

## Konfiguration

### API-Konfiguration

Die API-Konfiguration befindet sich in `src/api/client.ts`:

```typescript
const BASE_URL = 'https://script.google.com/macros/s/AKfycbyDamcZLDF-CDCzRy_xdgIBBs71rNK_XbQLE9CbTVfY/exec/';
const API_KEY = 'AIzaSyBIP6a9voiLVpQ8s2gWlxjeiAMJlE20l7o';
```

**Hinweis:** Diese Werte sind für die Produktion konfiguriert. Für die Entwicklung mit einem anderen Backend passen Sie diese Werte entsprechend an.

## Technologie-Stack

- **Frontend Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Sprache:** TypeScript 5.9.3
- **Routing:** React Router DOM 7.1.3
- **HTTP Client:** Axios 1.7.9
- **Datum/Zeit:** date-fns 4.1.0
- **Linting:** ESLint 9.39.1
- **Styling:** Vanilla CSS (kein Framework)

## Browser-Unterstützung

Die Anwendung unterstützt moderne Browser:
- Chrome (neueste 2 Versionen)
- Firefox (neueste 2 Versionen)
- Safari (neueste 2 Versionen)
- Edge (neueste 2 Versionen)

## Screenshots

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/82de2478-4c80-41e3-a626-02f99f60cf3e)

### Live Events
![Live Events](https://github.com/user-attachments/assets/4dfe179a-cc64-42ea-ba51-c7003ca2500c)

### Servicescheine
![Servicescheine](https://github.com/user-attachments/assets/04fdcc69-15a4-43d3-a335-d339357be32d)

## Bekannte Einschränkungen

- **NFC-Tag-Reading:** Nicht auf Web verfügbar (wie im Scope ausgeschlossen)
- **Browser-Netzwerk-Blocker:** Einige Browser-Extensions können API-Aufrufe blockieren
- **CORS:** Stellen Sie sicher, dass das Backend CORS korrekt konfiguriert hat

## Lizenz

Dieses Projekt ist privat und für die interne Nutzung bestimmt.

## Support

Bei Fragen oder Problemen wenden Sie sich bitte an das Entwicklungsteam.
