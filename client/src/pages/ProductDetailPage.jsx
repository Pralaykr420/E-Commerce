import { useParams } from 'react-router-dom';

const formatCurrency = (value) => `$${Number(value).toLocaleString()}`;

export default function ProductDetailPage({ products, addToCart, wishlist, toggleWishlist, offers = [] }) {
  const { id } = useParams();
  const product = products.find((entry) => entry.id === id);

  if (!product) {
    return <div className="empty-state">This product is no longer available.</div>;
  }

  const offerPercent = offers.reduce((sum, offer) => sum + (offer.scope === 'all-products' ? Number(offer.percent || 0) : 0), 0);
  const discountedPrice = Number(product.price) * (1 - offerPercent / 100);
  const gallery = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image].filter(Boolean);
  const similarProducts = products.filter((entry) => entry.id !== product.id && entry.category === product.category).slice(0, 3);

  return (
    <section className="product-page">
      <div className="product-page__gallery">
        <img src={gallery[0]} alt={product.name} className="product-page__main-image" />
        <div className="product-page__thumbs">
          {gallery.map((image, index) => (
            <img key={`${product.id}-${index}`} src={image} alt={`${product.name} preview ${index + 1}`} />
          ))}
        </div>
      </div>

      <div className="product-page__details">
        <span className="eyebrow">{product.badge}</span>
        <h1>{product.name}</h1>
        <div className="product-page__rating">★ {product.rating} · {product.stock} in stock</div>
        <p className="product-page__price">{formatCurrency(discountedPrice)}</p>
        <p className="product-page__description">{product.description}</p>

        <div className="product-page__actions">
          <button type="button" className="primary-button" onClick={() => addToCart(product)}>Add to cart</button>
          <button type="button" className="secondary-button" onClick={() => toggleWishlist(product)}>
            {wishlist.some((item) => item.id === product.id) ? 'Saved to wishlist' : 'Save to wishlist'}
          </button>
        </div>

        <div className="product-page__meta">
          <h3>Included features</h3>
          <ul>
            {(product.features || []).map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
