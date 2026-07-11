import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import styles from '../Styles/Brands.module.css';

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axiosInstance.get(`${API_URL}/users/brands`);
        if (res.data.success) {
          setBrands(res.data.brands);
        }
      } catch (err) {
        console.error("Failed to fetch brands", err);
        setError("Failed to load brands. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleCardClick = (brandName) => {
    navigate(`/shop?brand=${encodeURIComponent(brandName)}`);
  };

  const handleImageError = (e) => {
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
  };

  if (loading) return <div className={styles.loading}>Loading Brands...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <p className={styles.subtitle}>Our Partners</p>
        <h1 className={styles.title}>PREMIUM BRANDS</h1>
      </header>

      <div className={styles.grid}>
        {brands.map((brand) => (
          <div 
            key={brand._id} 
            className={styles.card} 
            onClick={() => handleCardClick(brand.name)}
          >
            <div className={styles.logoContainer}>
              <img 
                src={brand.imageUrl} 
                alt={brand.name.replace(/_/g, ' ')} 
                className={styles.image}
                onError={handleImageError}
              />
            </div>
            <h3 className={styles.brandName}>{brand.name.replace(/_/g, ' ')}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
