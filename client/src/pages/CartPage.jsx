import { Link } from 'react-router-dom';

const formatCurrency = (value) => `$${Number(value).toLocaleString()}`;

export default function CartPage({ cart, updateQuantity, removeFromCart, subtotal, shipping, total }) {
  if (cart.length === 0) {
    return <div className="empty-state">Your cart is empty. Add a few products to continue.</div>;
  }

  return (
    <section className="cart-layout">
      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item__thumb">
              <img src={item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'} alt={item.name} />
            </div>

            <div className="cart-item__content">
              <h3>{item.name}</h3>
              <p>{formatCurrency(item.price)}</p>
              <div className="cart-item__qty">
                <button type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>
            </div>

            <button type="button" className="text-button" onClick={() => removeFromCart(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <aside className="summary-card">
        <h3>Order summary</h3>
        <div className="summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
        <div className="summary-row"><span>Shipping</span><strong>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</strong></div>
        <div className="summary-row total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
        <Link to="/checkout" className="primary-button primary-button--full">Proceed to checkout</Link>
      </aside>
    </section>
  );
}
