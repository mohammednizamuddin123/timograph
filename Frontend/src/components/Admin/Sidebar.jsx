import React from 'react';
import styles from '../../Styles/Admin.module.css';
import { FaTags } from 'react-icons/fa';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className={styles.sidebar}>
      <h2>Watch Admin</h2>
      <ul>
        <li className={activeTab === "Add Product" ? styles.active : ""} onClick={() => setActiveTab("Add Product")}>Add Product</li>
        <li className={activeTab === "Edit Product" ? styles.active : ""} onClick={() => setActiveTab("Edit Product")}>Edit Product</li>
        <li className={activeTab === "Manage Banners" ? styles.active : ""} onClick={() => setActiveTab("Manage Banners")}>Manage Banners</li>
        <li 
          className={activeTab === 'Manage Brands' ? styles.active : ''}
          onClick={() => setActiveTab('Manage Brands')}
        >
          <FaTags className={styles.icon} />
          Manage Brands
        </li>
        <li 
          className={activeTab === 'Orders' ? styles.active : ''}
          onClick={() => setActiveTab('Orders')}
        >Orders</li>
        <li 
          className={activeTab === 'Users' ? styles.active : ''}
          onClick={() => setActiveTab('Users')}
        >Users</li>
        <li 
          className={activeTab === 'Analytics' ? styles.active : ''}
          onClick={() => setActiveTab('Analytics')}
        >Analytics</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
