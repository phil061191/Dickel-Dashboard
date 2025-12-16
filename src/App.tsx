import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './views/Dashboard';
import LiveEvents from './views/LiveEvents';
import PendingEvents from './views/PendingEvents';
import MitarbeiterView from './views/Mitarbeiter';
import KundenView from './views/Kunden';
import ServicescheineView from './views/Servicescheine';
import MaterialView from './views/Material';
import DiktateView from './views/Diktate';
import SystemView from './views/System';
import './App.css';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<LiveEvents />} />
          <Route path="/pending" element={<PendingEvents />} />
          <Route path="/mitarbeiter" element={<MitarbeiterView />} />
          <Route path="/kunden" element={<KundenView />} />
          <Route path="/servicescheine" element={<ServicescheineView />} />
          <Route path="/material" element={<MaterialView />} />
          <Route path="/diktate" element={<DiktateView />} />
          <Route path="/system" element={<SystemView />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
