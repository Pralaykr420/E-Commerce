const formatCurrency = (value) => `$${Number(value).toLocaleString()}`;

export default function AdminPage({ adminSummary, adminProducts, adminForm, setAdminForm, onAddProduct, onAdjustStock, onDeleteProduct }) {
  return (
    <section className="admin-shell">
      <div className="metrics-grid">
        <div className="metric-card"><span>Total Products</span><strong>{adminSummary?.totalProducts ?? 0}</strong></div>
        <div className="metric-card"><span>Total Orders</span><strong>{adminSummary?.totalOrders ?? 0}</strong></div>
        <div className="metric-card"><span>Revenue</span><strong>{formatCurrency(adminSummary?.totalRevenue ?? 0)}</strong></div>
        <div className="metric-card"><span>Low stock</span><strong>{adminSummary?.lowStock ?? 0}</strong></div>
      </div>

      <div className="admin-layout">
        <form className="admin-form" onSubmit={onAddProduct}>
          <h3>Add a new product</h3>

          <input value={adminForm.name} onChange={(event) => setAdminForm((current) => ({ ...current, name: event.target.value }))} placeholder="Product name" required />

          <div className="two-col">
            <select value={adminForm.category} onChange={(event) => setAdminForm((current) => ({ ...current, category: event.target.value }))}>
              {['Audio', 'Wearables', 'Home', 'Travel', 'Tech'].map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input value={adminForm.badge} onChange={(event) => setAdminForm((current) => ({ ...current, badge: event.target.value }))} placeholder="Badge" />
          </div>

          <div className="two-col">
            <input type="number" min="0" value={adminForm.price} onChange={(event) => setAdminForm((current) => ({ ...current, price: event.target.value }))} placeholder="Price" required />
            <input type="number" min="0" value={adminForm.stock} onChange={(event) => setAdminForm((current) => ({ ...current, stock: event.target.value }))} placeholder="Stock" required />
          </div>

          <textarea value={adminForm.description} onChange={(event) => setAdminForm((current) => ({ ...current, description: event.target.value }))} rows="3" placeholder="Short product description" />
          <input value={adminForm.colors} onChange={(event) => setAdminForm((current) => ({ ...current, colors: event.target.value }))} placeholder="Colors, comma separated" />

          <label className="upload-box">
            <span>Upload product image</span>
            <input type="file" accept="image/*" onChange={(event) => setAdminForm((current) => ({ ...current, imageFile: event.target.files?.[0] || null }))} />
          </label>

          <input value={adminForm.images} onChange={(event) => setAdminForm((current) => ({ ...current, images: event.target.value }))} placeholder="Image URLs, comma separated" />
          <textarea value={adminForm.features} onChange={(event) => setAdminForm((current) => ({ ...current, features: event.target.value }))} rows="3" placeholder="Features, comma separated" />

          <button type="submit" className="primary-button primary-button--full">Publish product</button>
        </form>

        <div className="admin-product-list">
          {adminProducts.map((product) => (
            <div key={product.id} className="admin-product-item">
              <img src={product.image || product.images?.[0]} alt={product.name} />
              <div>
                <h4>{product.name}</h4>
                <p>{product.category}</p>
                <small>{product.stock} in stock</small>
              </div>
              <div className="admin-actions">
                <button type="button" onClick={() => onAdjustStock(product.id, 5)}>+5</button>
                <button type="button" onClick={() => onAdjustStock(product.id, -5)}>-5</button>
                <button type="button" className="danger" onClick={() => onDeleteProduct(product.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
