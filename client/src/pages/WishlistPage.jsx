import { Link } from 'react-router-dom';

const formatCurrency = (value) => `$${Number(value).toLocaleString()}`;

export default function WishlistPage({ wishlist, addToCart, removeFromWishlist }) {
  if (wishlist.length === 0) {
    return <div className="empty-state">Your wishlist is empty. Save a few favorites to compare later.</div>;
  }

  return (
    <section className="wishlist-page">
      <div className="search-page__header">
        <div>
          <span className="eyebrow">Saved favorites</span>
          <h2>Wishlist</h2>
        </div>
        <Link to="/" className="secondary-button">Continue shopping</Link>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((product) => (
          <article key={product.id} className="wishlist-item">
            <img src={product.image || product.images?.[0]} alt={product.name} />
            <div>
              <h3>{product.name}</h3>
              <p>{product.category}</p>
              <strong>{formatCurrency(product.price)}</strong>
            </div>
            <div className="wishlist-item__actions">
              <button type="button" className="primary-button" onClick={() => addToCart(product)}>Add to cart</button>
              <button type="button" className="text-button" onClick={() => removeFromWishlist(product.id)}>Remove</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
