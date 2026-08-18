import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const formatCurrency = (value) => `$${Number(value).toLocaleString()}`;

export default function ProductCard({ product, addToCart, toggleWishlist, isWishlisted, offerPercent = 0 }) {
  const gallery = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image].filter(Boolean);
  const discountedPrice = Number(product.price) * (1 - offerPercent / 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="product-card"
    >
      <div className="product-card__media">
        <Link to={`/product/${product.id}`} className="product-card__link">
          <img src={gallery[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'} alt={product.name} className="product-card__image" />
        </Link>
        <button type="button" onClick={() => toggleWishlist(product)} className={`product-card__favorite ${isWishlisted ? 'active' : ''}`} aria-label="Toggle wishlist">
          ♥
        </button>
        <span className="product-card__badge">{product.badge}</span>
      </div>

      <div className="product-card__body">
        <div className="product-card__meta">
          <span className="product-card__category">{product.category}</span>
          <span className="product-card__rating">★ {product.rating}</span>
        </div>

        <Link to={`/product/${product.id}`} className="product-card__name">
          {product.name}
        </Link>

        <p className="product-card__description">{product.description}</p>

        <div className="product-card__footer">
          <div>
            <p className="product-card__price">{formatCurrency(discountedPrice)}</p>
            <p className="product-card__stock">{product.stock} left</p>
          </div>

          <button type="button" className="primary-button" onClick={() => addToCart(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}
