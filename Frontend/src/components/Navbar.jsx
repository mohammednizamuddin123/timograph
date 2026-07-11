import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "../Styles/Navbar.module.css";
import { AppContext } from "../context/AppContext";
import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = () => {
  const { role, logout } = useContext(AppContext);
  const navigate = useNavigate();
  
  const { items } = useSelector((state) => state.cart);
  const cartItemCount = items ? items.reduce((total, item) => total + item.quantity, 0) : 0;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* Top Bar */}
      

      {/* Main Navbar */}
      <nav className={styles.navbar}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <svg width="100%" height="auto" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '200px', display: 'block' }}>
              <text x="100" y="28" fontFamily="'Times New Roman', Times, serif" fontSize="26" fontWeight="bold" fill="#ffffff" textAnchor="middle" letterSpacing="2">
                TIMO<tspan fill="#d4a24c">GRAPH</tspan>
              </text>
              <g transform="translate(0, 35)">
                <line x1="20" y1="4" x2="65" y2="4" stroke="#d4a24c" strokeWidth="1" opacity="0.8" />
                <text x="100" y="7" fontFamily="'Times New Roman', Times, serif" fontSize="9" fill="#d4a24c" textAnchor="middle" letterSpacing="3">WATCHES</text>
                <line x1="135" y1="4" x2="180" y2="4" stroke="#d4a24c" strokeWidth="1" opacity="0.8" />
              </g>
            </svg>
          </Link>
        </div>

        {/* Nav Links */}
        <ul className={styles.navLinks}>
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/shop">SHOP</Link></li>
          <li><Link to="/collections">COLLECTIONS</Link></li>
          <li><Link to="/brands">BRANDS</Link></li>
          <li><Link to="/about">ABOUT US</Link></li>
          <li><Link to="/contact">CONTACT</Link></li>
          
          {/* Conditionally render Admin link based on role from context */}
          {role === 'admin' && (
            <li><Link to="/admin" style={{ color: '#d4af37', fontWeight: 'bold' }}>ADMIN DASHBOARD</Link></li>
          )}
        </ul>

        {/* Icons */}
        <div className={styles.icons}>
          <Link to="/shop?search=open" style={{ color: 'inherit', textDecoration: 'none' }}>
            <FaSearch style={{ cursor: 'pointer' }} />
          </Link>
          
          {role ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link to="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>
                <FaUser title="Profile" />
              </Link>
              <FaSignOutAlt title="Logout" style={{ cursor: 'pointer', color: '#ff4d4d' }} onClick={handleLogout} />
            </div>
          ) : (
            <Link to="/login" style={{ fontSize: '0.9rem', fontWeight: 'bold', textDecoration: 'none', color: '#fff', border: '1px solid #333', padding: '5px 10px', borderRadius: '4px' }}>
              LOGIN
            </Link>
          )}

          <Link to="/cart" style={{ color: 'inherit', textDecoration: 'none' }}>
            <div className={styles.cart}>
              <FaShoppingBag />
              <span>{cartItemCount}</span>
            </div>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;