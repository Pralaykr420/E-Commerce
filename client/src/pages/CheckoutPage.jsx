import { Link } from 'react-router-dom';

const formatCurrency = (value) => `$${Number(value).toLocaleString()}`;

export default function CheckoutPage({ cart, total, subtotal, shipping, user, onCheckout, message, customerProfile, setCustomerProfile }) {
  const profile = customerProfile || { fullName: '', phone: '', address: '', city: '', postcode: '' };

  if (!user && !profile.fullName) {
    return (
      <div className="empty-state">
        Please sign in to place your order. <Link to="/auth">Continue here</Link>
      </div>
    );
  }

  return (
    <section className="checkout-layout">
      <div className="summary-card summary-card--wide">
        <h3>Shipping & payment</h3>
        <div className="checkout-grid">
          <div>
            <p className="light-label">Delivery</p>
            <strong>Standard shipping</strong>
          </div>
          <div>
            <p className="light-label">Customer</p>
            <strong>{user ? user.name : profile.fullName}</strong>
          </div>
          <div>
            <p className="light-label">Items</p>
            <strong>{cart.reduce((sum, item) => sum + item.quantity, 0)}</strong>
          </div>
        </div>

        <div className="checkout-form">
          <input value={profile.fullName} onChange={(event) => setCustomerProfile((current) => ({ ...current, fullName: event.target.value }))} placeholder="Full name" />
          <input value={profile.phone} onChange={(event) => setCustomerProfile((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone number" />
          <input value={profile.address} onChange={(event) => setCustomerProfile((current) => ({ ...current, address: event.target.value }))} placeholder="Street address" />
          <div className="two-col">
            <input value={profile.city} onChange={(event) => setCustomerProfile((current) => ({ ...current, city: event.target.value }))} placeholder="City" />
            <input value={profile.postcode} onChange={(event) => setCustomerProfile((current) => ({ ...current, postcode: event.target.value }))} placeholder="Postcode" />
          </div>
        </div>

        <button type="button" className="primary-button primary-button--full" onClick={onCheckout}>
          Pay {formatCurrency(total)}
        </button>
        {message && <p className="status-message">{message}</p>}
      </div>

      <div className="summary-card">
        <h3>Order total</h3>
        <div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
        <div className="summary-row"><span>Shipping</span><strong>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</strong></div>
        <div className="summary-row total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
        <Link to="/cart" className="secondary-button">Review cart</Link>
      </div>
    </section>
  );
}
