import React from 'react';
import { Link } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import FeaturedProducts from '../components/FeaturedProducts';

const Home = () => {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <BannerCarousel />
      <FeaturedProducts />
      
      {/* Quick Links Chips for Mobile */}
      <div style={{ 
        padding: '20px', 
        marginTop: 'auto', 
        borderTop: '1px solid #222',
        backgroundColor: '#111'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: '#d4a24c', textAlign: 'center', letterSpacing: '1px' }}>QUICK EXPLORE</h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '10px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        className="chips-container"
        >
          <style>{`.chips-container::-webkit-scrollbar { display: none; }`}</style>
          
          <Link to="/shop" style={{ textDecoration: 'none' }}>
            <div style={{ whiteSpace: 'nowrap', padding: '10px 20px', backgroundColor: '#222', borderRadius: '30px', border: '1px solid #d4a24c', color: '#fff', fontSize: '0.9rem', fontWeight: 'bold' }}>
              Shop Watches
            </div>
          </Link>
          <Link to="/brands" style={{ textDecoration: 'none' }}>
            <div style={{ whiteSpace: 'nowrap', padding: '10px 20px', backgroundColor: '#222', borderRadius: '30px', border: '1px solid #444', color: '#ccc', fontSize: '0.9rem', fontWeight: 'bold' }}>
              Premium Brands
            </div>
          </Link>
          <Link to="/collections" style={{ textDecoration: 'none' }}>
            <div style={{ whiteSpace: 'nowrap', padding: '10px 20px', backgroundColor: '#222', borderRadius: '30px', border: '1px solid #444', color: '#ccc', fontSize: '0.9rem', fontWeight: 'bold' }}>
              Collections
            </div>
          </Link>
          <Link to="/about" style={{ textDecoration: 'none' }}>
            <div style={{ whiteSpace: 'nowrap', padding: '10px 20px', backgroundColor: '#222', borderRadius: '30px', border: '1px solid #444', color: '#ccc', fontSize: '0.9rem', fontWeight: 'bold' }}>
              Our Story
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
