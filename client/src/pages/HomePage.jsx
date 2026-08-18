import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, RoundedBox } from '@react-three/drei';

import ProductCard from '../components/ProductCard';

const categoryData = ['All', 'Audio', 'Wearables', 'Home', 'Travel', 'Tech'];

function HeroVisual() {
  return (
    <div className="hero-visual">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[3, 3, 2]} intensity={1.8} color="#ffffff" />
        <Float speed={2.5} rotationIntensity={1.7} floatIntensity={1.8}>
          <RoundedBox args={[2.3, 2.3, 2.3]} radius={0.3} smoothness={8}>
            <meshStandardMaterial color="#2563eb" emissive="#1d4ed8" emissiveIntensity={0.25} />
          </RoundedBox>
        </Float>
        <Float speed={2.2} rotationIntensity={1.5} floatIntensity={1.3} position={[2.3, 1.2, -1]}>
          <mesh>
            <torusKnotGeometry args={[0.8, 0.25, 160, 24]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.4} />
          </mesh>
        </Float>
        <Float speed={1.8} rotationIntensity={1.4} floatIntensity={1.2} position={[-2.2, -1.5, -0.7]}>
          <mesh>
            <icosahedronGeometry args={[0.85, 1]} />
            <meshStandardMaterial color="#14b8a6" emissive="#0f766e" emissiveIntensity={0.35} />
          </mesh>
        </Float>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  );
}

export default function HomePage({ products, activeCategory, setActiveCategory, addToCart, toggleWishlist, wishlist }) {
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    return matchesCategory;
  });

  return (
    <>
      <section className="hero-panel">
        <div className="hero-panel__copy">
          <span className="eyebrow">New seasonal collection</span>
          <h1>Upgrade your everyday essentials.</h1>
          <p>
            Premium tech, elevated travel gear, and curated essentials designed for a smarter,
            more polished lifestyle.
          </p>

          <div className="hero-panel__actions">
            <a href="#shop" className="primary-button">Shop now</a>
            <Link to="/wishlist" className="secondary-button">Explore wishlist</Link>
          </div>

          <div className="stats-grid">
            <div>
              <strong>12k+</strong>
              <span>happy buyers</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>average rating</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>support</span>
            </div>
          </div>
        </div>

        <motion.div className="hero-panel__visual" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }}>
          <HeroVisual />
        </motion.div>
      </section>

      <section className="category-row">
        {categoryData.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`category-pill ${activeCategory === category ? 'selected' : ''}`}
          >
            {category}
          </button>
        ))}
      </section>

      <section id="shop" className="section-header">
        <div>
          <span className="eyebrow">Curated picks</span>
          <h2>Popular this week</h2>
        </div>
      </section>

      <section className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
            toggleWishlist={toggleWishlist}
            isWishlisted={wishlist.some((item) => item.id === product.id)}
          />
        ))}
      </section>

      <section className="feature-grid">
        {filteredProducts.slice(0, 4).map((product) => (
          <div key={product.id} className="feature-panel">
            <div className="feature-panel__image-wrap">
              <img src={product.image || product.images?.[0]} alt={product.name} />
            </div>
            <div>
              <p>{product.badge}</p>
              <h3>{product.name}</h3>
              <small>{product.category}</small>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
