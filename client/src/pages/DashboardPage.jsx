import { Bell, Camera, Gauge, MapPinned, ShieldCheck } from 'lucide-react';
import { MapContainer, Marker, Popup, Polyline, TileLayer } from 'react-leaflet';

const defaultRoute = [
  [23.0225, 72.5714],
  [23.0270, 72.5660],
  [23.0196, 72.5781]
];

export function DashboardPage({ stats, cameras, alerts, detections, onAlertAction }) {
  const recentAlerts = alerts.slice(0, 3);
  const recentDetections = detections.slice(0, 3);

  return (
    <>
      <section className="grid stats-grid">
        <div className="card stat-card">
          <div className="stat-label">Cameras</div>
          <div className="stat-value"><span>{stats.totalCameras || cameras.length}</span><Camera size={20} color="#7dd3fc" /></div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Online</div>
          <div className="stat-value"><span>{stats.onlineCameras || cameras.filter((c) => c.status === 'ONLINE').length}</span><Gauge size={20} color="#4ade80" /></div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Alerts</div>
          <div className="stat-value"><span>{stats.alerts || alerts.length}</span><Bell size={20} color="#fbbf24" /></div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Detections</div>
          <div className="stat-value"><span>{stats.detections || detections.length}</span><ShieldCheck size={20} color="#a78bfa" /></div>
        </div>
      </section>

      <section className="grid main-grid">
        <div className="card camera-grid">
          <h3>Live Camera Grid</h3>
          <div className="camera-list">
            {cameras.map((camera) => (
              <div key={camera.id} className="camera-tile">
                <div className="tile-header">
                  <strong>{camera.id}</strong>
                  <span className={`status-pill status-${camera.status.toLowerCase()}`}>{camera.status}</span>
                </div>
                <div className="camera-feed">{camera.name}</div>
                <div className="meta">
                  <span>{camera.zone}</span>
                  <span>{camera.protocol}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="card alert-panel">
          <h3>Alert Panel</h3>
          <div className="list">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="alert-item">
                <div className="row-between">
                  <strong>{alert.matchedEntity}</strong>
                  <span className="status-pill status-degraded">{alert.severity}</span>
                </div>
                <div className="muted">Camera {alert.cameraId}</div>
                <div className="button-row">
                  <button className="secondary-button" onClick={() => onAlertAction(alert.id, 'acknowledge')}>Acknowledge</button>
                  <button className="secondary-button" onClick={() => onAlertAction(alert.id, 'resolve')}>Resolve</button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="card map-card">
        <div className="row-between">
          <h3>Scenario Map</h3>
          <span style={{ color: '#7dd3fc' }}><MapPinned size={18} /></span>
        </div>
        <div className="map-wrap">
          <MapContainer center={[23.0235, 72.5715]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {cameras.map((camera) => (
              <Marker key={camera.id} position={[camera.latitude, camera.longitude]}>
                <Popup>
                  <div>
                    <strong>{camera.name}</strong><br />
                    {camera.id} · {camera.status}
                  </div>
                </Popup>
              </Marker>
            ))}
            <Polyline positions={defaultRoute} color="#38bdf8" weight={4} opacity={0.9} />
          </MapContainer>
        </div>
      </section>

      <section className="grid main-grid" style={{ marginTop: '1rem' }}>
        <div className="card camera-grid">
          <h3>Movement History</h3>
          <div className="route-list">
            <div><span className="muted">Entity:</span> GJ01XX0001</div>
            <div>10:02 · C001 · Ahmedabad</div>
            <div>10:18 · C002 · Ahmedabad</div>
            <div>10:41 · C003 · Ahmedabad</div>
          </div>
        </div>

        <div className="card alert-panel">
          <h3>Recent Detections</h3>
          <div className="list">
            {recentDetections.map((detection) => (
              <div key={detection.id} className="alert-item">
                <div className="row-between">
                  <strong>{detection.vehicleNumber}</strong>
                  <span className="status-pill status-online">{detection.eventType}</span>
                </div>
                <div className="muted">Camera {detection.cameraId} · {Math.round(detection.confidence * 100)}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
