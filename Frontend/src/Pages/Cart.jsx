import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeFromCart, updateCartQuantity } from '../redux/slices/cartSlice';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../Styles/Cart.module.css';

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCart());
    }
  }, [status, dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      dispatch(updateCartQuantity({ productId, quantity: newQuantity }));
    }
  };

  if (status === 'loading') return <div className={styles.container}><h2>Loading cart...</h2></div>;
  if (status === 'failed') return <div className={styles.container}><h2>Error: {error}</h2></div>;

  const totalAmount = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.heading}>Your Shopping Cart</h1>
        
        {items.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Your cart is currently empty.</p>
            <Link to="/shop" className={styles.continueShoppingBtn}>Continue Shopping</Link>
          </div>
        ) : (
        <div className={styles.cartContent}>
          <div className={styles.itemsList}>
            {items.map((item) => (
              <div key={item.product._id} className={styles.cartItem}>
                <img 
                  src={item.product.imgOrg === 'url' ? item.product.image : `${API_URL}/${item.product.image.replace(/\\/g, '/')}`} 
                  alt={item.product.name} 
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <Link to={`/product/${item.product._id}`} className={styles.itemName}>{item.product.name}</Link>
                  <p className={styles.itemBrand}>{item.product.brand}</p>
                  <p className={styles.itemPrice}>₹ {item.product.price.toLocaleString('en-IN')}</p>
                  
                  <div className={styles.quantityControl}>
                    <button 
                      className={styles.qtyBtn} 
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity, -1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button 
                      className={styles.qtyBtn} 
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button className={styles.removeBtn} onClick={() => handleRemove(item.product._id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className={styles.orderSummary}>
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>₹ {totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <hr />
            <div className={styles.summaryTotal}>
              <span>Total:</span>
              <span>₹ {totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <button 
              className={styles.checkoutBtn} 
              onClick={() => navigate('/checkout')}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Cart;
