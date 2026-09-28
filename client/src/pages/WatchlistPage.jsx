export function WatchlistPage({ watchlist }) {
  return (
    <div className="card section-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Watchlist</p>
          <h2>Representative entity registry</h2>
        </div>
        <button className="primary-button compact">Add record</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Identifier</th>
              <th>Name</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.entityType}</td>
                <td>{item.identifier}</td>
                <td>{item.name}</td>
                <td>{item.priority}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
