export function CamerasPage({ cameras }) {
  return (
    <div className="card section-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Camera Registry</p>
          <h2>Active camera inventory</h2>
        </div>
        <button className="primary-button compact">Add camera</button>
      </div>

      <div className="toolbar">
        <input className="search-box" placeholder="Search camera id or name" />
        <select className="search-box">
          <option>All statuses</option>
          <option>ONLINE</option>
          <option>DEGRADED</option>
          <option>OFFLINE</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Camera ID</th>
              <th>Name</th>
              <th>Zone</th>
              <th>Protocol</th>
              <th>Status</th>
              <th>Last Heartbeat</th>
            </tr>
          </thead>
          <tbody>
            {cameras.map((camera) => (
              <tr key={camera.id}>
                <td>{camera.id}</td>
                <td>{camera.name}</td>
                <td>{camera.zone}</td>
                <td>{camera.protocol}</td>
                <td><span className={`status-pill status-${camera.status.toLowerCase()}`}>{camera.status}</span></td>
                <td>{new Date(camera.lastHeartbeat).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
