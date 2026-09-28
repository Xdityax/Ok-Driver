import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';

const route = [
  [23.0225, 72.5714],
  [23.0270, 72.5660],
  [23.0196, 72.5781]
];

export function MapPage({ cameras }) {
  return (
    <div className="card section-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">GIS View</p>
          <h2>Camera and alert locations</h2>
        </div>
      </div>

      <div className="map-wrap large-map">
        <MapContainer center={[23.0235, 72.5715]} zoom={12} style={{ height: '100%', width: '100%' }}>
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
          <Polyline positions={route} color="#38bdf8" weight={4} opacity={0.9} />
        </MapContainer>
      </div>
    </div>
  );
}
