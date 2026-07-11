import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { clearCart } from '../redux/slices/cartSlice';
import styles from '../Styles/Checkout.module.css';

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const Checkout = () => {
  const { items } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // If cart is empty, user shouldn't be here
  useEffect(() => {
    if (items.length === 0 && !success) {
      navigate('/cart');
    }
  }, [items, navigate, success]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post(`${API_URL}/users/order/place`, { shippingAddress: address });
      if (res.data.success) {
        dispatch(clearCart());
        setSuccess(true);
      }
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successContainer}>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for your purchase.</p>
        <button className={styles.homeBtn} onClick={() => navigate('/shop')}>Return to Shop</button>
      </div>
    );
  }

  const totalAmount = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <div className={styles.container}>
      <div className={styles.checkoutWrapper}>
        <div className={styles.formSection}>
          <h2>Shipping Information</h2>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handlePlaceOrder} className={styles.addressForm}>
            <div className={styles.inputGroup}>
              <label>Street Address</label>
              <input type="text" name="street" value={address.street} onChange={handleChange} required />
            </div>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>City</label>
                <input type="text" name="city" value={address.city} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>State</label>
                <input type="text" name="state" value={address.state} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>ZIP Code</label>
                <input type="text" name="zip" value={address.zip} onChange={handleChange} required />
              </div>
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Processing...' : 'CONFIRM & PAY'}
            </button>
          </form>
        </div>

        <div className={styles.summarySection}>
          <h2>Order Summary</h2>
          <div className={styles.itemsPreview}>
            {items.map(item => (
              <div key={item.product._id} className={styles.summaryItem}>
                <span className={styles.itemQty}>{item.quantity}x</span>
                <span className={styles.itemName}>{item.product.name}</span>
                <span className={styles.itemPrice}>₹ {(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <hr />
          <div className={styles.totalRow}>
            <span>Total</span>
            <span>₹ {totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
