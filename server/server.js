import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { calculateOrderSummary } from './lib/orderSummary.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret';
const SHIPPING_THRESHOLD = Number(process.env.SHIPPING_THRESHOLD || 250);

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));

const productCatalog = [
  {
    id: 'p-1001',
    name: 'Aero Pulse Headphones',
    category: 'Audio',
    price: 249,
    rating: 4.8,
    stock: 18,
    badge: 'Bestseller',
    colors: ['Graphite', 'Silver'],
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Noise-cancelling wireless headphones with room-filling sound and all-day comfort.',
    features: ['40h battery', 'Adaptive ANC', 'Bluetooth 5.3']
  },
  {
    id: 'p-1002',
    name: 'Nova Smartwatch',
    category: 'Wearables',
    price: 329,
    rating: 4.7,
    stock: 14,
    badge: 'New',
    colors: ['Midnight', 'Rose'],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Track your goals, notifications, and workouts with a premium edge-to-edge display.',
    features: ['AMOLED display', '7-day battery', 'GPS + health tracking']
  },
  {
    id: 'p-1003',
    name: 'Luma Desk Lamp',
    category: 'Home',
    price: 129,
    rating: 4.6,
    stock: 25,
    badge: 'Popular',
    colors: ['Sand', 'White'],
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Elegant ambient lighting with touch controls and warm, adjustable brightness.',
    features: ['Touch dimmer', 'Warm-to-cool lighting', 'USB-C power']
  },
  {
    id: 'p-1004',
    name: 'Summit Backpack',
    category: 'Travel',
    price: 179,
    rating: 4.9,
    stock: 12,
    badge: 'Top Rated',
    colors: ['Forest', 'Black'],
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Weather-ready carry-all for daily commutes and weekend adventures.',
    features: ['Water resistant', 'Laptop sleeve', 'Expandable storage']
  },
  {
    id: 'p-1005',
    name: 'Core Pro Speaker',
    category: 'Audio',
    price: 199,
    rating: 4.8,
    stock: 21,
    badge: 'Featured',
    colors: ['Charcoal', 'Cream'],
    image: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Portable Bluetooth speaker with deep bass, 360° sound, and water resistance.',
    features: ['360° audio', 'IPX7 protection', '12h playback']
  },
  {
    id: 'p-1006',
    name: 'Orbit Camera',
    category: 'Tech',
    price: 699,
    rating: 4.9,
    stock: 9,
    badge: 'Limited',
    colors: ['Black', 'White'],
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Ultra-clear compact camera built for creators who want crisp capture anywhere.',
    features: ['4K capture', 'AI stabilization', 'Fast autofocus']
  }
];

const users = [];
const orders = [];

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  stock: { type: Number, required: true },
  badge: { type: String },
  colors: [String],
  image: { type: String },
  images: [String],
  description: { type: String },
  features: [String]
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  paymentReference: { type: String, required: true },
  customer: { type: String, required: true },
  status: { type: String, default: 'paid' },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  items: [{
    id: String,
    name: String,
    price: Number,
    quantity: Number
  }],
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

const dbConnect = async () => {
  if (!process.env.MONGO_URI) {
    console.log('MongoDB not configured. Running with in-memory fallback data.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await seedProductsIfNeeded();
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
};

const createToken = (user) => jwt.sign({ id: user.id || user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

const getUserRecord = async (email) => {
  if (mongoose.connection.readyState === 1) {
    return User.findOne({ email: email.toLowerCase() }).lean();
  }

  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

const seedProductsIfNeeded = async () => {
  if (mongoose.connection.readyState !== 1) return;
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(productCatalog.map((product) => ({ ...product, colors: product.colors || [], features: product.features || [] })));
  }
};

const getProductCatalogData = async () => {
  if (mongoose.connection.readyState === 1) {
    const docs = await Product.find().lean();
    return docs.map((product) => {
      const normalizedImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images.filter(Boolean)
        : product.image
          ? [product.image]
          : [];

      return {
        ...product,
        id: product.id || String(product._id),
        image: product.image || normalizedImages[0] || '',
        images: normalizedImages,
        _id: undefined
      };
    });
  }

  return productCatalog.map((product) => ({
    ...product,
    images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image].filter(Boolean),
    image: product.image || product.images?.[0] || ''
  }));
};

const getOrdersForUser = async (email) => {
  if (mongoose.connection.readyState === 1) {
    return Order.find({ customer: email.toLowerCase() }).lean();
  }

  return orders.filter((order) => order.customer === email.toLowerCase());
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token expired or invalid.' });
  }
};

const shouldStartServer = () => {
  if (process.env.NODE_ENV === 'test') return false;
  return typeof process.argv[1] === 'string' && process.argv[1].toLowerCase().endsWith('server.js');
};

const adminMiddleware = (req, res, next) => {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@luxecart.com').toLowerCase();
  if (!req.user || req.user.email.toLowerCase() !== adminEmail) {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  next();
};

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.get('/api/products', async (req, res) => {
  const products = await getProductCatalogData();
  res.json({ success: true, products });
});

app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const products = await getProductCatalogData();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  res.json({ success: true, product });
});

app.get('/api/me', authMiddleware, async (req, res) => {
  const user = await getUserRecord(req.user.email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const isAdmin = (user.email || '').toLowerCase() === (process.env.ADMIN_EMAIL || 'admin@luxecart.com').toLowerCase();

  res.json({
    success: true,
    user: {
      id: user.id || user._id,
      name: user.name,
      email: user.email,
      role: isAdmin ? 'admin' : 'customer'
    }
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
  }

  const existingUser = await getUserRecord(email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'User already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const payload = {
    id: `u-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    password: hashedPassword
  };

  if (mongoose.connection.readyState === 1) {
    const savedUser = await User.create({ name, email: email.toLowerCase(), password: hashedPassword });
    payload.id = String(savedUser._id);
    payload._id = savedUser._id;
  } else {
    users.push(payload);
  }

  const isAdmin = payload.email.toLowerCase() === (process.env.ADMIN_EMAIL || 'admin@luxecart.com').toLowerCase();

  res.status(201).json({
    success: true,
    user: { id: payload.id, name: payload.name, email: payload.email, role: isAdmin ? 'admin' : 'customer' },
    token: createToken({ ...payload, role: isAdmin ? 'admin' : 'customer' })
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = await getUserRecord(email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const isAdmin = (user.email || '').toLowerCase() === (process.env.ADMIN_EMAIL || 'admin@luxecart.com').toLowerCase();

  res.json({
    success: true,
    user: { id: user.id || String(user._id), name: user.name, email: user.email, role: isAdmin ? 'admin' : 'customer' },
    token: createToken({ ...user, email: user.email, role: isAdmin ? 'admin' : 'customer' })
  });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  const user = await getUserRecord(email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'No account found for that email.' });
  }

  res.json({
    success: true,
    message: 'Password reset instructions have been sent to your email.'
  });
});

app.get('/api/orders', authMiddleware, async (req, res) => {
  const email = req.user.email.toLowerCase();
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@luxecart.com').toLowerCase();
  const allOrders = mongoose.connection.readyState === 1
    ? await Order.find(email === adminEmail ? {} : { customer: email }).lean()
    : orders.filter((order) => order.customer === email || email === adminEmail);

  res.json({ success: true, orders: allOrders });
});

app.get('/api/admin/summary', authMiddleware, adminMiddleware, async (req, res) => {
  const products = await getProductCatalogData();
  const allOrders = mongoose.connection.readyState === 1 ? await Order.find().lean() : orders;
  const totalRevenue = allOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const lowStock = products.filter((product) => Number(product.stock) < 10).length;

  res.json({
    success: true,
    summary: {
      totalProducts: products.length,
      totalOrders: allOrders.length,
      totalRevenue,
      lowStock
    }
  });
});

app.get('/api/admin/products', authMiddleware, adminMiddleware, async (req, res) => {
  const products = await getProductCatalogData();
  res.json({ success: true, products });
});

app.post('/api/admin/products', authMiddleware, adminMiddleware, async (req, res) => {
  const body = req.body || {};
  const rawImages = Array.isArray(body.images)
    ? body.images
    : typeof body.images === 'string'
      ? body.images.split(',').map((item) => item.trim()).filter(Boolean)
      : [];

  const primaryImage = body.image || rawImages[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80';
  const product = {
    id: body.id || `p-${Date.now()}`,
    name: body.name,
    category: body.category || 'General',
    price: Number(body.price || 0),
    rating: Number(body.rating || 4.5),
    stock: Number(body.stock || 0),
    badge: body.badge || 'New',
    colors: Array.isArray(body.colors) ? body.colors : [body.colors || 'Default'],
    image: primaryImage,
    images: rawImages.length > 0 ? rawImages : [primaryImage],
    description: body.description || 'Premium product crafted for modern living.',
    features: Array.isArray(body.features) ? body.features : [body.features || 'Premium quality']
  };

  if (mongoose.connection.readyState === 1) {
    const doc = await Product.create(product);
    const normalized = {
      ...doc.toObject(),
      image: doc.image || doc.images?.[0] || primaryImage,
      images: Array.isArray(doc.images) && doc.images.length > 0 ? doc.images : [doc.image || primaryImage]
    };
    return res.status(201).json({ success: true, product: normalized });
  }

  productCatalog.push(product);
  res.status(201).json({ success: true, product });
});

app.put('/api/admin/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { stockDelta = 0 } = req.body || {};

  if (mongoose.connection.readyState === 1) {
    const product = await Product.findOne({ id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    product.stock = Math.max(0, Number(product.stock) + Number(stockDelta || 0));
    await product.save();
    return res.json({ success: true, product: product.toObject() });
  }

  const productIndex = productCatalog.findIndex((item) => item.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  productCatalog[productIndex].stock = Math.max(0, Number(productCatalog[productIndex].stock || 0) + Number(stockDelta || 0));
  res.json({ success: true, product: productCatalog[productIndex] });
});

app.delete('/api/admin/products/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;

  if (mongoose.connection.readyState === 1) {
    const deleted = await Product.deleteOne({ id });
    if (deleted.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    return res.json({ success: true });
  }

  const productIndex = productCatalog.findIndex((item) => item.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  productCatalog.splice(productIndex, 1);
  res.json({ success: true });
});

app.post('/api/checkout', authMiddleware, async (req, res) => {
  const { items, total } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart is empty.' });
  }

  const products = await getProductCatalogData();
  const validItems = items.map((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) {
      throw new Error(`Product ${item.id} could not be validated.`);
    }
    return {
      id: item.id,
      name: product.name,
      price: Number(product.price),
      quantity: Number(item.quantity || 1)
    };
  });

  const summary = calculateOrderSummary(validItems, SHIPPING_THRESHOLD);
  const paymentReference = `PAY-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  const orderRecord = {
    id: `ord-${Date.now()}`,
    paymentReference,
    customer: req.user.email.toLowerCase(),
    createdAt: new Date().toISOString(),
    status: 'paid',
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    total: Number(total) || summary.total,
    items: validItems
  };

  if (mongoose.connection.readyState === 1) {
    const savedOrder = await Order.create(orderRecord);
    return res.json({
      success: true,
      message: 'Checkout secure simulation approved.',
      paymentReference: savedOrder.paymentReference,
      total: Number(savedOrder.total),
      subtotal: Number(savedOrder.subtotal),
      shipping: Number(savedOrder.shipping),
      customer: savedOrder.customer,
      items: savedOrder.items
    });
  }

  orders.push(orderRecord);

  res.json({
    success: true,
    message: 'Checkout secure simulation approved.',
    paymentReference,
    total: Number(total) || summary.total,
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    customer: req.user.email,
    items: validItems
  });
});

if (shouldStartServer()) {
  app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await dbConnect();
  });
}

export { app, calculateOrderSummary };
