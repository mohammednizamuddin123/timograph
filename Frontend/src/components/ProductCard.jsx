import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Styles/ProductCard.module.css';
import { formatCategory } from '../utils/formatters';

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const ProductCard = ({ product }) => {
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/250?text=Image+Not+Found";
  };

  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className={styles.card} style={{ flex: 1 }}>
        <div className={styles.imageContainer}>
          <img 
            src={product.imgOrg === 'url' ? product.image : `${API_URL}/${product.image.replace(/\\/g, '/')}`} 
            alt={product.name} 
            className={styles.productImage}
            onError={handleImageError}
          />
        </div>
        <div className={styles.infoContainer}>
          <h4 className={styles.productName}>{product.name}</h4>
          <p className={styles.productPrice}>₹ {product.price.toLocaleString('en-IN')}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
