import { Link, useSearchParams } from 'react-router-dom';

import ProductCard from '../components/ProductCard';

export default function SearchPage({ products, addToCart, wishlist, toggleWishlist }) {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim().toLowerCase();

  const results = products.filter((product) => {
    if (!query) return false;
    const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    return haystack.includes(query);
  });

  return (
    <section className="search-page">
      <div className="search-page__header">
        <div>
          <span className="eyebrow">Search results</span>
          <h2>{query ? `Showing results for “${query}”` : 'Search products'}</h2>
        </div>
        <Link to="/" className="secondary-button">Back home</Link>
      </div>

      {query && results.length === 0 ? (
        <div className="empty-state">No products match your search yet. Try another keyword.</div>
      ) : (
        <div className="product-grid product-grid--search">
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
              toggleWishlist={toggleWishlist}
              isWishlisted={wishlist.some((item) => item.id === product.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
