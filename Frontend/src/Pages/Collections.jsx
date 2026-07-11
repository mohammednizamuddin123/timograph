import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import styles from '../Styles/Collections.module.css';
import { formatCategory } from '../utils/formatters';

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await axiosInstance.get(`${API_URL}/users/collections`);
        if (res.data.success) {
          setCollections(res.data.collections);
        }
      } catch (err) {
        console.error("Failed to fetch collections", err);
        setError("Failed to load collections. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleCardClick = (category) => {
    // Navigate to the shop page with the category filter pre-applied
    navigate(`/shop?category=${category}`);
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
  };

  if (loading) return <div className={styles.loading}>Loading Collections...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <p className={styles.subtitle}>Curated For You</p>
        <h1 className={styles.title}>OUR COLLECTIONS</h1>
      </header>

      <div className={styles.grid}>
        {collections.map((col) => {
          const imageUrl = col.imgOrg === 'url' 
            ? col.image 
            : `${API_URL}/${col.image.replace(/\\/g, '/')}`;

          return (
            <div 
              key={col._id} 
              className={styles.card} 
              onClick={() => handleCardClick(col._id)}
            >
              <img 
                src={imageUrl} 
                alt={col._id} 
                className={styles.image}
                onError={handleImageError}
              />
              <div className={styles.overlay}>
                <h3 className={styles.categoryName}>{formatCategory(col._id)}</h3>
                <p className={styles.itemCount}>{col.count} {col.count === 1 ? 'Watch' : 'Watches'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Collections;
