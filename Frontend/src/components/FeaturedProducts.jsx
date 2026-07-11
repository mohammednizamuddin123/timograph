import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import styles from '../Styles/FeaturedProducts.module.css';
import ProductCard from './ProductCard';

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await axiosInstance.get(`${API_URL}/users/products/featured?limit=12`);
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        setError('Failed to load featured products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading featured collection...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (products.length === 0) {
    return null; 
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionSubTitle}>OUR COLLECTION</h3>
      <h2 className={styles.sectionTitle}>FEATURED WATCHES</h2>

      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
