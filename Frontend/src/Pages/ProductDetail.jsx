import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { AppContext } from '../context/AppContext';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import styles from '../Styles/ProductDetail.module.css';

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useContext(AppContext);
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`${API_URL}/users/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!role) {
      navigate('/login');
      return;
    }
    setAdding(true);
    await dispatch(addToCart({ productId: product._id, quantity: 1 }));
    setAdding(false);
    navigate('/cart');
  };

  const handleBuyNow = async () => {
    if (!role) {
      navigate('/login');
      return;
    }
    setAdding(true);
    await dispatch(addToCart({ productId: product._id, quantity: 1 }));
    setAdding(false);
    navigate('/checkout');
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error || !product) return <div className={styles.error}>{error || "Product not found"}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.imageSection}>
          <img 
            src={product.imgOrg === 'url' ? product.image : `${API_URL}/${product.image.replace(/\\/g, '/')}`} 
            alt={product.name} 
            className={styles.mainImage}
            onError={(e) => { e.target.src = "https://via.placeholder.com/500?text=Image+Not+Found" }}
          />
        </div>
        
        <div className={styles.detailsSection}>
          <h1 className={styles.title}>{product.name}</h1>
          <h2 className={styles.brand}>{product.brand}</h2>
          
          <div className={styles.priceContainer}>
            <span className={styles.price}>₹ {product.price.toLocaleString('en-IN')}</span>
            {product.offer > 0 && <span className={styles.offer}>{product.offer}% OFF</span>}
          </div>

          <div className={styles.description}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className={styles.meta}>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Availability:</strong> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
          </div>

          <div className={styles.actions}>
            <button 
              className={styles.cartBtn} 
              onClick={handleAddToCart} 
              disabled={product.stock <= 0 || adding}
            >
              {adding ? 'Adding...' : 'ADD TO CART'}
            </button>
            <button 
              className={styles.buyBtn} 
              onClick={handleBuyNow} 
              disabled={product.stock <= 0 || adding}
            >
              BUY NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
