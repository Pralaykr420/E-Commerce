import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DeliveryPage from './pages/DeliveryPage';
import OffersPage from './pages/OffersPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

const API_URL = import.meta.env.VITE_API_URL;
const isAdminUser = (user) => !!user && (user.role === 'admin' || user.email === 'pralaykr20@gmail.com' || user.email === 'admin@luxecart.com');

const readLocalStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState(() => readLocalStorage('luxecart-cart', []));
  const [wishlist, setWishlist] = useState(() => readLocalStorage('luxecart-wishlist', []));
  const [user, setUser] = useState(() => readLocalStorage('luxecart-user', null));
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerProfile, setCustomerProfile] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postcode: ''
  });
  const [orders, setOrders] = useState([
    { id: 'ord-1001', customer: 'Ava Stone', email: 'ava@example.com', status: 'In Transit', payment: 'Card', total: 578, address: '42 Oxley Street, Perth', expectedDate: '2026-08-22', trackingId: 'TRK-8391', items: [{ name: 'Nova Smartwatch', quantity: 1, price: 329 }] },
    { id: 'ord-1002', customer: 'Liam Walsh', email: 'liam@example.com', status: 'Delivered', payment: 'UPI', total: 429, address: '18 Lakeview Road, Brisbane', expectedDate: '2026-08-18', trackingId: 'TRK-2048', items: [{ name: 'Core Pro Speaker', quantity: 1, price: 199 }] }
  ]);
  const [deliveryJobs, setDeliveryJobs] = useState([
    { id: 'dlv-1', customer: 'Ava Stone', address: '42 Oxley Street, Perth', status: 'In Transit', expectedDate: '2026-08-22', trackingId: 'TRK-8391' },
    { id: 'dlv-2', customer: 'Liam Walsh', address: '18 Lakeview Road, Brisbane', status: 'Delivered', expectedDate: '2026-08-18', trackingId: 'TRK-2048' }
  ]);
  const [offers, setOffers] = useState([
    { id: 'offer-1', title: 'Summer 18% Off', percent: 18, scope: 'all-products' },
    { id: 'offer-2', title: 'Audio Boost', percent: 12, scope: 'selected-products' }
  ]);
  const [adminSummary, setAdminSummary] = useState(null);
  const [adminProducts, setAdminProducts] = useState([]);
  const [adminForm, setAdminForm] = useState({
    name: '',
    category: 'Tech',
    price: '',
    stock: '',
    badge: 'New',
    description: '',
    colors: 'Black, White',
    features: 'Premium quality, Fast delivery',
    images: '',
    imageFile: null
  });

  const productMap = useMemo(() => Object.fromEntries(products.map((product) => [product.id, product])), [products]);
  const subtotal = cart.reduce((total, item) => total + Number(item.price || productMap[item.id]?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 0 ? 18 : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    localStorage.setItem('luxecart-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('luxecart-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('luxecart-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('luxecart-user');
    }
  }, [user]);

  const loadAdminData = async (token = localStorage.getItem('luxecart-token')) => {
    if (!token) return;

    try {
      const [summaryResult, productsResult] = await Promise.all([
        fetch(`${API_URL}/admin/summary`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/admin/products`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const summaryData = await summaryResult.json();
      const productsData = await productsResult.json();

      if (summaryData.success) setAdminSummary(summaryData.summary);
      if (productsData.success) setAdminProducts(productsData.products || []);
    } catch (error) {
      console.error('Admin data failed to load:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        if (data.success) setProducts(data.products || []);
      } catch (error) {
        console.error('Product fetch failed:', error);
      }
    };

    fetchProducts();

    const token = localStorage.getItem('luxecart-token');
    if (!token) return;

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          if (isAdminUser(data.user)) await loadAdminData(token);
        }
      } catch (error) {
        console.error('Session validation failed:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...current, { id: product.id, name: product.name, price: product.price, quantity, image: product.image || product.images?.[0] }];
    });

    setCheckoutMessage(`${product.name} added to your cart.`);
  };

  const updateQuantity = (id, change) => {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) return current.filter((item) => item.id !== product.id);
      return [...current, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((current) => current.filter((item) => item.id !== productId));
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setCheckoutMessage('');

    try {
      if (authMode === 'forgot') {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authForm.email })
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Password reset failed.');

        setCheckoutMessage('A password reset link has been sent to your email.');
        setAuthMode('login');
        setAuthForm((current) => ({ ...current, email: '' }));
        return;
      }

      const endpoint = authMode === 'login' ? 'auth/login' : 'auth/register';
      const payload = authMode === 'login'
        ? { email: authForm.email, password: authForm.password }
        : { name: authForm.name, email: authForm.email, password: authForm.password };

      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Authentication failed.');

      localStorage.setItem('luxecart-token', data.token);
      setUser(data.user);
      setAuthForm({ name: '', email: '', password: '' });
      setCheckoutMessage(authMode === 'login' ? 'Welcome back. You are now signed in.' : 'Account created successfully.');
      if (isAdminUser(data.user)) await loadAdminData(data.token);
    } catch (error) {
      setCheckoutMessage(error.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    const activeUser = user || { name: customerProfile.fullName || authForm.name || 'Guest customer', email: authForm.email || 'guest@example.com' };

    if (!activeUser || !activeUser.email) {
      setCheckoutMessage('Please sign in before placing your order.');
      return;
    }

    if (!customerProfile.fullName && !user) {
      setCheckoutMessage('Add your full name so the delivery can be arranged.');
      return;
    }

    if (!customerProfile.phone || !customerProfile.address || !customerProfile.city || !customerProfile.postcode) {
      setCheckoutMessage('Please complete your shipping details before ordering.');
      return;
    }

    if (cart.length === 0) {
      setCheckoutMessage('Add a few products before checkout.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('luxecart-token')}`
        },
        body: JSON.stringify({ items: cart, total })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Checkout failed.');

      const newOrder = {
        id: `ord-${Date.now()}`,
        customer: user ? user.name : customerProfile.fullName,
        email: activeUser.email,
        status: 'Pending',
        payment: 'Card',
        total,
        address: `${customerProfile.address}, ${customerProfile.city} ${customerProfile.postcode}`,
        expectedDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
        trackingId: `TRK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        items: cart.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price }))
      };

      const newDelivery = {
        id: `dlv-${Date.now()}`,
        customer: newOrder.customer,
        address: newOrder.address,
        status: 'Pending',
        expectedDate: newOrder.expectedDate,
        trackingId: newOrder.trackingId
      };

      setOrders((current) => [newOrder, ...current]);
      setDeliveryJobs((current) => [newDelivery, ...current]);
      setCheckoutMessage(`${data.message} Payment reference: ${data.paymentReference}. Tracking ID: ${newOrder.trackingId}`);
      setCart([]);
      setCustomerProfile({ fullName: '', phone: '', address: '', city: '', postcode: '' });
    } catch (error) {
      setCheckoutMessage(error.message || 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminProductSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('luxecart-token');
    if (!token) return;

    try {
      let primaryImage = '';
      const imageUrls = (adminForm.images || '').split(',').map((item) => item.trim()).filter(Boolean);

      if (adminForm.imageFile) {
        const fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(adminForm.imageFile);
        });

        primaryImage = String(fileData);
      } else if (imageUrls.length > 0) {
        primaryImage = imageUrls[0];
      }

      const payload = {
        ...adminForm,
        image: primaryImage,
        images: [...imageUrls, primaryImage].filter(Boolean),
        colors: (adminForm.colors || '').split(',').map((item) => item.trim()).filter(Boolean),
        features: (adminForm.features || '').split(',').map((item) => item.trim()).filter(Boolean),
        price: Number(adminForm.price),
        stock: Number(adminForm.stock)
      };

      const response = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Unable to add product.');

      setAdminForm({
        name: '',
        category: 'Tech',
        price: '',
        stock: '',
        badge: 'New',
        description: '',
        colors: 'Black, White',
        features: 'Premium quality, Fast delivery',
        images: '',
        imageFile: null
      });

      await loadAdminData(token);
      setCheckoutMessage('Product published successfully.');
    } catch (error) {
      setCheckoutMessage(error.message || 'Inventory update failed.');
    }
  };

  const adjustInventory = async (productId, delta) => {
    const token = localStorage.getItem('luxecart-token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stockDelta: delta })
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Stock update failed.');
      await loadAdminData(token);
    } catch (error) {
      setCheckoutMessage(error.message || 'Stock update failed.');
    }
  };

  const deleteProduct = async (productId) => {
    const token = localStorage.getItem('luxecart-token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Delete failed.');
      await loadAdminData(token);
      setCheckoutMessage('Inventory item removed.');
    } catch (error) {
      setCheckoutMessage(error.message || 'Delete failed.');
    }
  };

  const logout = () => {
    localStorage.removeItem('luxecart-token');
    setUser(null);
    setCheckoutMessage('You have been signed out.');
  };

  return (
    <BrowserRouter>
      <Layout
        search={search}
        setSearch={setSearch}
        cart={cart}
        wishlist={wishlist}
        user={user}
        onLogout={logout}
        checkoutMessage={checkoutMessage}
      >
        <Routes>
          <Route path="/" element={<HomePage products={products} activeCategory={activeCategory} setActiveCategory={setActiveCategory} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
          <Route path="/search" element={<SearchPage products={products} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />} />
          <Route path="/product/:id" element={<ProductDetailPage products={products} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} offers={offers} />} />
          <Route path="/cart" element={<CartPage cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} subtotal={subtotal} shipping={shipping} total={total} />} />
          <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} addToCart={addToCart} removeFromWishlist={removeFromWishlist} />} />
          <Route path="/orders" element={<OrderHistoryPage orders={orders} user={user} />} />
          <Route path="/auth" element={<AuthPage authMode={authMode} setAuthMode={setAuthMode} authForm={authForm} setAuthForm={setAuthForm} loading={loading} onSubmit={handleAuth} message={checkoutMessage} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} total={total} subtotal={subtotal} shipping={shipping} user={user} onCheckout={handleCheckout} message={checkoutMessage} customerProfile={customerProfile} setCustomerProfile={setCustomerProfile} />} />
          <Route path="/admin" element={user && isAdminUser(user) ? <AdminPage adminSummary={adminSummary} adminProducts={adminProducts} adminForm={adminForm} setAdminForm={setAdminForm} onAddProduct={handleAdminProductSubmit} onAdjustStock={adjustInventory} onDeleteProduct={deleteProduct} /> : <Navigate to="/" replace />} />
          <Route path="/admin/dashboard" element={user && isAdminUser(user) ? <AdminDashboardPage products={products} orders={orders} deliveryJobs={deliveryJobs} offers={offers} /> : <Navigate to="/" replace />} />
          <Route path="/admin/delivery" element={user && isAdminUser(user) ? <DeliveryPage deliveries={deliveryJobs} /> : <Navigate to="/" replace />} />
          <Route path="/admin/offers" element={user && isAdminUser(user) ? <OffersPage offers={offers} setOffers={setOffers} /> : <Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

