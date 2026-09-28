import { useEffect, useState } from 'react';
import { Bell, UserRound } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { DashboardPage } from './pages/DashboardPage';
import { CamerasPage } from './pages/CamerasPage';
import { AlertsPage } from './pages/AlertsPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { MapPage } from './pages/MapPage';

const API = import.meta.env.VITE_API_URL || '/api/v1';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

function App() {
  const [page, setPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [email, setEmail] = useState('admin@okdriver.com');
  const [password, setPassword] = useState('admin123');
  const [stats, setStats] = useState({ totalCameras: 0, onlineCameras: 0, alerts: 0, detections: 0 });
  const [cameras, setCameras] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [detections, setDetections] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  const fetchData = async () => {
    try {
      const [statsRes, camerasRes, alertsRes, detectionsRes, watchlistRes] = await Promise.all([
        axios.get(`${API}/dashboard/stats`),
        axios.get(`${API}/cameras`),
        axios.get(`${API}/alerts`),
        axios.get(`${API}/events/detections`),
        axios.get(`${API}/watchlist`)
      ]);

      setStats(statsRes.data);
      setCameras(camerasRes.data);
      setAlerts(alertsRes.data);
      setDetections(detectionsRes.data);
      setWatchlist(watchlistRes.data);
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const client = io(SOCKET_URL);

    client.on('detection.created', (detection) => {
      setDetections((prev) => [detection, ...prev]);
    });

    client.on('alert.created', (alert) => {
      setAlerts((prev) => [alert, ...prev]);
      setStats((prev) => ({ ...prev, alerts: prev.alerts + 1 }));
    });

    client.on('alert.updated', (updatedAlert) => {
      setAlerts((prev) => prev.map((item) => item.id === updatedAlert.id ? updatedAlert : item));
    });

    return () => client.disconnect();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      if (response.data?.token) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleAlertAction = async (alertId, action) => {
    try {
      await axios.patch(`${API}/alerts/${alertId}/${action}`);
      await fetchData();
    } catch (error) {
      console.error('Alert update failed:', error);
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'cameras':
        return <CamerasPage cameras={cameras} />;
      case 'alerts':
        return <AlertsPage alerts={alerts} onAlertAction={handleAlertAction} />;
      case 'watchlist':
        return <WatchlistPage watchlist={watchlist} />;
      case 'map':
        return <MapPage cameras={cameras} />;
      default:
        return <DashboardPage stats={stats} cameras={cameras} alerts={alerts} detections={detections} onAlertAction={handleAlertAction} />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <div className="brand" style={{ justifyContent: 'center' }}>
              <div className="brand-badge">O</div>
              <span>okDriver</span>
            </div>
            <h2 style={{ marginTop: '1rem', marginBottom: '0.3rem' }}>CCTV Intelligence</h2>
          </div>
          <form className="login-body" onSubmit={handleLogin}>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="primary-button">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-badge">O</div>
          <span>okDriver</span>
        </div>
        <nav className="nav">
          <a className={page === 'dashboard' ? 'active' : ''} href="#" onClick={(e) => { e.preventDefault(); setPage('dashboard'); }}>Dashboard</a>
          <a className={page === 'cameras' ? 'active' : ''} href="#" onClick={(e) => { e.preventDefault(); setPage('cameras'); }}>Cameras</a>
          <a className={page === 'alerts' ? 'active' : ''} href="#" onClick={(e) => { e.preventDefault(); setPage('alerts'); }}>Alerts</a>
          <a className={page === 'watchlist' ? 'active' : ''} href="#" onClick={(e) => { e.preventDefault(); setPage('watchlist'); }}>Watchlist</a>
          <a className={page === 'map' ? 'active' : ''} href="#" onClick={(e) => { e.preventDefault(); setPage('map'); }}>Map</a>
        </nav>
        <div className="user-chip">
          <Bell size={16} />
          <UserRound size={16} />
          <span>Admin</span>
        </div>
      </header>

      <main className="page">{renderPage()}</main>
    </div>
  );
}

export default App;
