export function AlertsPage({ alerts, onAlertAction }) {
  return (
    <div className="card section-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Operational Alerts</p>
          <h2>Alert queue</h2>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Entity</th>
              <th>Camera</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Timestamp</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id}>
                <td>{alert.id}</td>
                <td>{alert.matchedEntity}</td>
                <td>{alert.cameraId}</td>
                <td><span className="status-pill status-degraded">{alert.severity}</span></td>
                <td>{alert.status}</td>
                <td>{new Date(alert.timestamp).toLocaleString()}</td>
                <td>
                  <div className="button-row compact-row">
                    <button className="secondary-button" onClick={() => onAlertAction(alert.id, 'acknowledge')}>Ack</button>
                    <button className="secondary-button" onClick={() => onAlertAction(alert.id, 'resolve')}>Resolve</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
