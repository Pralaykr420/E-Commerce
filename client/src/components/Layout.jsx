import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

export default function Layout({
  search,
  setSearch,
  cart,
  wishlist,
  user,
  onLogout,
  checkoutMessage,
  children
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isAdmin = user && user.role === 'admin';

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) {
      navigate('/');
      return;
    }
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/" className="brand-mark">
  <img
    src="/logo.png"
    alt="Luxe Cart Logo"
    className="brand-mark__logo"
  />
  <span>Luxe Cart</span>
</Link>

          <form className="topbar__search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search premium products..."
            />
          </form>

          <nav className="topbar__nav" aria-label="Main navigation">
            {!isAdmin ? (
              <>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Home</NavLink>
                <NavLink to="/orders" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Orders</NavLink>
                <NavLink to="/wishlist" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  Wishlist {wishlist.length > 0 ? `(${wishlist.length})` : ''}
                </NavLink>
                <NavLink to="/cart" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  Cart {cartCount > 0 ? `(${cartCount})` : ''}
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Dashboard</NavLink>
                <NavLink to="/admin/delivery" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Delivery</NavLink>
                <NavLink to="/admin/offers" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>Offers</NavLink>
              </>
            )}
          </nav>

          <div className="topbar__actions">
            {user ? (
              <>
                <span className="user-pill">{user.name || user.email}</span>
                <button type="button" className="secondary-button" onClick={onLogout}>Logout</button>
              </>
            ) : (
              <Link to="/auth" className="secondary-button">Login</Link>
            )}
          </div>
        </div>
      </header>

      {checkoutMessage && <div className="status-banner">{checkoutMessage}</div>}

      <main className="page-shell">{children}</main>

      {location.pathname !== '/auth' && (
        <footer className="footer">
  <div className="footer-container">

    {/* Brand */}
    <div className="footer-brand">
      <div className="footer-logo">E-Mall</div>

      <p>
        Premium essentials for everyday life.
        <br />
        Curated for quality, comfort & convenience.
      </p>

      <div className="footer-socials">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>

        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>

        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </div>

    {/* Shop */}
    <div className="footer-column">
      <h4>Shop</h4>

      <a href="#products">
        All Products
      </a>

      <a href="#featured">
        Featured
      </a>

      <a href="#new-arrivals">
        New Arrivals
      </a>

      <a href="#deals">
        Deals & Offers
      </a>
    </div>

    {/* Help */}
    <div className="footer-column">
      <h4>Help & Support</h4>

      <a href="#contact">
        Contact Us
      </a>

      <a href="#shipping">
        Shipping & Delivery
      </a>

      <a href="#returns">
        Returns & Refunds
      </a>

      <a href="#faq">
        Frequently Asked Questions
      </a>
    </div>

    {/* Contact */}
    <div className="footer-column footer-contact">
      <h4>Get in touch</h4>

      <a href="mailto:pralaykr20@gmail.com">
        ✉️ pralaykr20@gmail.com
      </a>

      <a href="tel:+91811685801">
        ☎️ +91 8116885801
      </a>

      <span>
        📍 India
      </span>

      <a
        href="mailto:pralaykr20@gmail.com?subject=E-Mall%20Feedback"
        className="feedback-link"
      >
        Share Feedback →
      </a>
    </div>

  </div>

  {/* Newsletter */}
  <div className="footer-newsletter">
    <div>
      <h3>Stay in the loop.</h3>

      <p>
        Get new arrivals, exclusive offers and important updates.
      </p>
    </div>

    <form
      className="newsletter-form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <input
        type="email"
        placeholder="Enter your email"
        aria-label="Email address"
        required
      />

      <button type="submit">
        Subscribe →
      </button>
    </form>
  </div>

  {/* Bottom */}
  <div className="footer-bottom">

    <span>
      © {new Date().getFullYear()} E-Mall. All rights reserved.
    </span>

    <div>
      <a href="#privacy">
        Privacy Policy
      </a>

      <a href="#terms">
        Terms of Service
      </a>
    </div>

  </div>
</footer>
      )}
    </div>
  );
}
