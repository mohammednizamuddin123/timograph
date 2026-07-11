import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import styles from '../Styles/BannerCarousel.module.css';

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveBanners = async () => {
      try {
        const res = await axiosInstance.get(`${API_URL}/users/banners?active=true`);
        if (res.data.success) {
          setBanners(res.data.banners);
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBanners();
  }, []);

  if (loading) {
    return <div className={styles.swiperContainer} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white'}}>Loading...</div>;
  }

  if (banners.length === 0) {
    return null; // Don't render anything if there are no active banners
  }

  return (
    <div className={styles.swiperContainer}>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        className="mySwiper"
        style={{ width: '100%', height: '100%' }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div className={styles.slide}>
              <img
                src={banner.imgOrg === 'url' ? banner.image : `${API_URL}/${banner.image.replace(/\\/g, '/')}`}
                alt={banner.title || 'Promotional Banner'}
                className={styles.slideImage}
              />
              <div className={styles.contentOverlay}>
                {banner.title && <h2 className={styles.title}>{banner.title}</h2>}
                {banner.subtitle && <p className={styles.subtitle}>{banner.subtitle}</p>}
                
                {/* Render button conditionally based on link */}
                {banner.link ? (
                   banner.link.startsWith('http') ? (
                       <a href={banner.link} target="_blank" rel="noopener noreferrer" className={styles.shopBtn}>
                         Explore Now
                       </a>
                   ) : (
                       <Link to={banner.link} className={styles.shopBtn}>
                         Explore Now
                       </Link>
                   )
                ) : (
                   /* If no link, render a visual-only button or nothing. We will render a disabled-looking button or nothing. Let's do nothing if there's no link */
                   null
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerCarousel;
