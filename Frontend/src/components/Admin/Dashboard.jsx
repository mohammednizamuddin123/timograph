import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import axiosInstance from '../../api/axios';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.products);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, products: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 1 }));
    fetchStats();
  }, [dispatch]);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/admin/dashboard-stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.dashboardContainer}><h2>Loading analytics...</h2></div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Analytics Overview</h1>
        <p>Welcome back! Here's what's happening with your store today.</p>
      </div>

      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.cardRevenue}`}>
          <div className={styles.cardTitle}>Total Revenue</div>
          <div className={styles.cardValue}>₹{stats.revenue.toLocaleString()}</div>
          <div className={styles.cardSubtitle}>
            <span>Lifetime</span>
          </div>
        </div>

        <div className={`${styles.kpiCard} ${styles.cardOrders}`}>
          <div className={styles.cardTitle}>Total Orders</div>
          <div className={styles.cardValue}>{stats.orders}</div>
          <div className={styles.cardSubtitle}>
            <span>Lifetime</span>
          </div>
        </div>

        <div className={`${styles.kpiCard} ${styles.cardProducts}`}>
          <div className={styles.cardTitle}>Total Products</div>
          <div className={styles.cardValue}>{stats.products}</div>
          <div className={`${styles.cardSubtitle} ${styles.negative}`}>
            <span>Storefront</span>
          </div>
        </div>

        <div className={`${styles.kpiCard} ${styles.cardUsers}`}>
          <div className={styles.cardTitle}>Active Users</div>
          <div className={styles.cardValue}>{stats.users}</div>
          <div className={styles.cardSubtitle}>
            <span>Registered</span>
          </div>
        </div>
      </div>

      <div className={styles.recentSection}>
        <h2>Recent Activity</h2>
        <div className={styles.emptyState}>
          Detailed analytics and charts will appear here as your data grows.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
