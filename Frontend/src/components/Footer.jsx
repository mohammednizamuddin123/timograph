import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../Styles/Footer.module.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerSection}>
          <div className={styles.logo}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <svg width="100%" height="auto" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth: '180px', display: 'block' }}>
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
          <p className={styles.description}>
            Discover the perfect timepiece to match your style. We offer a curated selection of premium watches for every occasion.
          </p>
          <div className={styles.socialIcons}>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/collections">Collections</Link></li>
            <li><Link to="/brands">Brands</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Customer Service</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Shipping & Returns</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Contact Info</h3>
          <ul className={styles.contactInfo}>
            <li>Email: timographqatar@gmail.com</li>
            <li>Phone: +974 3150 1001</li>
            <li>Address: Al Asmakh Mall,AlSadd <br />
                         Gulf Mall,Gharafa
            </li>
          </ul>
        </div>
      </div>
      
      <div className={styles.bottomFooter}>
        <p>&copy; {new Date().getFullYear()} Timograph Watches. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
