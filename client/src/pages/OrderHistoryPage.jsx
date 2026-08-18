const formatCurrency = (value) => `$${Number(value || 0).toLocaleString()}`;

export default function OrderHistoryPage({ orders, user }) {
  if (!orders || orders.length === 0) {
    return <div className="empty-state">No orders yet. Your order history will appear here.</div>;
  }

  return (
    <section className="admin-shell">
      <div className="section-header">
        <div>
          <span className="eyebrow">Order tracking</span>
          <h2>{user ? `${user.name}'s order history` : 'Order history'}</h2>
        </div>
      </div>

      <div className="admin-product-list">
        {orders.map((order) => (
          <div key={order.id} className="delivery-card">
            <div>
              <strong>{order.id}</strong>
              <p>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p>
            </div>
            <div>
              <small>Status</small>
              <strong>{order.status}</strong>
            </div>
            <div>
              <small>Tracking</small>
              <strong>{order.trackingId}</strong>
            </div>
            <div>
              <small>Total</small>
              <strong>{formatCurrency(order.total)}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
