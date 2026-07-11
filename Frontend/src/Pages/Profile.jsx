import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../api/axios';
import styles from '../Styles/Profile.module.css';
import { FaUserCircle, FaShoppingBag, FaSignOutAlt, FaHistory } from 'react-icons/fa';

const Profile = () => {
  const { role, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const cartItemCount = items ? items.reduce((total, item) => total + item.quantity, 0) : 0;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get(`${import.meta.env.REACT_API_URL || 'http://localhost:3000'}/users/order`);
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <FaUserCircle className={styles.avatar} />
          <h1 className={styles.title}>My Profile</h1>
          <span className={styles.roleBadge}>{role === 'admin' ? 'Administrator' : 'Customer'}</span>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.statBox} onClick={() => navigate('/cart')}>
            <FaShoppingBag className={styles.statIcon} />
            <h3>{cartItemCount}</h3>
            <p>Items in Cart</p>
          </div>
          <div className={styles.statBox} onClick={() => {
            document.getElementById('orders-section').scrollIntoView({ behavior: 'smooth' });
          }}>
            <FaHistory className={styles.statIcon} />
            <h3>{loadingOrders ? '...' : orders.length}</h3>
            <p>Past Orders</p>
          </div>
        </div>

        <div className={styles.infoSection}>
          <h2>Account Details</h2>
          <div className={styles.infoRow}>
            <strong>Status:</strong> Active
          </div>
          <div className={styles.infoRow}>
            <strong>Role:</strong> {role}
          </div>
        </div>

        <div id="orders-section" className={styles.ordersSection}>
          <h2>Order History</h2>
          {loadingOrders ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className={styles.tentativeText}>You have no past orders yet.</p>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <div key={order._id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <span><strong>Order ID:</strong> {order._id.substring(0, 8)}</span>
                    <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.orderDetails}>
                    <span><strong>Total:</strong> ₹ {order.totalAmount.toLocaleString('en-IN')}</span>
                    <span className={styles.orderStatus}>{order.status}</span>
                  </div>
                  <div className={styles.orderItems}>
                    {order.items.map((item, idx) => (
                      <div key={idx} className={styles.orderItemRow}>
                        <span>{item.product?.name || 'Product'} (x{item.quantity})</span>
                        <span>₹ {(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FaSignOutAlt /> LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
