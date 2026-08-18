const formatCurrency = (value) => `$${Number(value || 0).toLocaleString()}`;

export default function AdminDashboardPage({ products, orders, deliveryJobs, offers }) {
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const lowStockProducts = products.filter((product) => Number(product.stock) < 10);
  const bestProducts = [...products]
    .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
    .slice(0, 4);

  return (
    <section className="admin-shell">
      <div className="metrics-grid">
        <div className="metric-card"><span>Total revenue</span><strong>{formatCurrency(totalRevenue)}</strong></div>
        <div className="metric-card"><span>Orders</span><strong>{orders.length}</strong></div>
        <div className="metric-card"><span>Low stock</span><strong>{lowStockProducts.length}</strong></div>
        <div className="metric-card"><span>Offers active</span><strong>{offers.length}</strong></div>
      </div>

      <div className="admin-layout">
        <div className="admin-form">
          <h3>Performance overview</h3>
          <div className="metric-stack">
            <div className="mini-panel">
              <span>Best product</span>
              <strong>{bestProducts[0]?.name || 'N/A'}</strong>
            </div>
            <div className="mini-panel">
              <span>Needs attention</span>
              <strong>{lowStockProducts.length ? lowStockProducts[0].name : 'All healthy'}</strong>
            </div>
            <div className="mini-panel">
              <span>Delivery health</span>
              <strong>{deliveryJobs.filter((job) => job.status === 'Delivered').length}/{deliveryJobs.length}</strong>
            </div>
            <div className="mini-panel">
              <span>Customer feedback</span>
              <strong>4.8 avg rating</strong>
            </div>
          </div>
        </div>

        <div className="admin-product-list">
          <div className="admin-form">
            <h3>Best-selling products</h3>
            {bestProducts.map((product) => (
              <div key={product.id} className="list-row">
                <div>
                  <strong>{product.name}</strong>
                  <small>{product.category}</small>
                </div>
                <span>{product.stock} stock</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel-grid">
        <div className="panel-box">
          <h3>Need improvement</h3>
          {lowStockProducts.length > 0 ? lowStockProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="list-row">
              <strong>{product.name}</strong>
              <span>{product.stock} left</span>
            </div>
          )) : <p>All products are in a healthy stock range.</p>}
        </div>

        <div className="panel-box">
          <h3>Product feedback trend</h3>
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="list-row">
              <strong>{product.name}</strong>
              <span>{product.rating}/5</span>
            </div>
          ))}
        </div>

        <div className="panel-box">
          <h3>Most active order time</h3>
          <p>Peak ordering window: 6:00 PM - 9:00 PM</p>
          <p>Conversion lift: +18.3% over the last 7 days</p>
        </div>
      </div>
    </section>
  );
}
