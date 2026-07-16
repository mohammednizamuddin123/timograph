import React, { useEffect } from 'react';
import styles from '../Styles/About.module.css';
import { FaClock, FaGem, FaHandshake } from 'react-icons/fa';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

const watchImg1="https://i.pinimg.com/736x/43/3b/24/433b24566720fce0daac8003f342c070.jpg"
const watchInside="https://static.vecteezy.com/system/resources/thumbnails/045/759/592/small/close-up-of-an-intricate-mechanical-watch-movement-photo.jpg"
const watchMaker="https://media.istockphoto.com/id/937088398/photo/watchmaker-is-repairing-the-mechanical-watches-in-his-workshop.jpg?s=612x612&w=0&k=20&c=xxJP9S4ziJ2tUNn6zlvxlItZ3MsWv-iEN3f0a0mj11w="

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <span className={styles.subtitle}>Our Story</span>
        <h1 className={styles.title}>Crafting Timepieces of Excellence Since 2026</h1>
        <p className={styles.heroText}>
          [TIMOGRAPH] We believe that a watch is more than just an instrument to tell time. It is a statement of style, a testament to craftsmanship, and an heirloom passed down through generations. Our journey began with a simple passion for horology and has grown into a premier destination for luxury and everyday timepieces.
        </p>
      </section>

      <section className={styles.imageGrid}>
        <div className={styles.imageWrapper} style={{ height: '400px' }}>
          <img src={watchMaker} alt="Watch Maker" />
        </div>
        <div className={styles.imageWrapper} style={{ height: '400px' }}>
          <img src={watchImg1} alt="Watch Collection" />
        </div>
      </section>

      <section className={styles.contentSection}>
        <div>
          <h2 className={styles.sectionTitle}>The Art of Precision</h2>
          <p className={styles.sectionText}>
            [TIMOGRAPH] Every collection we curate is selected with the utmost care. We partner with the world's most renowned brands and boutique watchmakers to bring you timepieces that perfectly balance aesthetics with mechanical perfection. Whether you seek a rugged sports watch for your next adventure or an elegant dress watch for formal occasions, we have the perfect piece for your wrist.
          </p>
        </div>
        <div className={styles.imageWrapper} style={{ height: '500px' }}>
          <img src={watchInside} alt="Precision Watch" />
        </div>
      </section>

      <section className={styles.valuesGrid}>
        <div className={styles.valueCard}>
          <FaGem className={styles.valueIcon} />
          <h3 className={styles.valueTitle}>Authenticity</h3>
          <p className={styles.valueText}>
            [TIMOGRAPH] We guarantee the authenticity of every watch we sell. Our rigorous inspection process ensures you receive exactly what you paid for.
          </p>
        </div>
        <div className={styles.valueCard}>
          <FaHandshake className={styles.valueIcon} />
          <h3 className={styles.valueTitle}>Customer First</h3>
          <p className={styles.valueText}>
            [TIMOGRAPH] Our relationship with you doesn't end at the sale. We provide exceptional after-sales support and guidance for all your horological needs.
          </p>
        </div>
        <div className={styles.valueCard}>
          <FaClock className={styles.valueIcon} />
          <h3 className={styles.valueTitle}>Heritage</h3>
          <p className={styles.valueText}>
            [TIMOGRAPH] We respect the deep history of watchmaking, curating pieces that carry significant heritage and timeless design language.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
