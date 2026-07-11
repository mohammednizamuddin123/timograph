import React from 'react';
import BannerCarousel from '../components/BannerCarousel';
import FeaturedProducts from '../components/FeaturedProducts';

const Home = () => {
  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: 'white' }}>
      <BannerCarousel />
      <FeaturedProducts />
    </div>
  );
};

export default Home;
