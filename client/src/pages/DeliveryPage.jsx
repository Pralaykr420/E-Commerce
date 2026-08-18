const statusPalette = {
  'Pending': '#f59e0b',
  'In Transit': '#3b82f6',
  'Delivered': '#16a34a',
  'Delayed': '#ef4444'
};

export default function DeliveryPage({ deliveries }) {
  return (
    <section className="admin-shell">
      <div className="section-header">
        <div>
          <span className="eyebrow">Delivery control</span>
          <h2>Delivery history & live status</h2>
        </div>
      </div>

      <div className="admin-product-list">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="delivery-card">
            <div>
              <strong>{delivery.customer}</strong>
              <p>{delivery.address}</p>
            </div>
            <div>
              <span className="delivery-badge" style={{ background: statusPalette[delivery.status] || '#64748b', color: '#fff' }}>
                {delivery.status}
              </span>
            </div>
            <div>
              <small>Expected date</small>
              <strong>{delivery.expectedDate}</strong>
            </div>
            <div>
              <small>Tracking</small>
              <strong>{delivery.trackingId}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
