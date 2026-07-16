import React, { useEffect } from 'react';
import styles from '../Styles/Contact.module.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.subtitle}>Get in Touch</span>
        <h1 className={styles.title}>We're Here for You</h1>
        <p className={styles.text}>
          [TIMOGRAPH] Whether you have a question about our timepieces, need assistance with an order, or require servicing for your watch, our dedicated concierge team is at your disposal.
        </p>
      </header>

      <div className={styles.contentWrapper}>
        
        {/* Left Side: Contact Form */}
        <div className={styles.formBox}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input type="text" className={styles.input} placeholder="John Doe" />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input type="email" className={styles.input} placeholder="john@example.com" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Subject</label>
              <input type="text" className={styles.input} placeholder="Inquiry about a specific model" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Message</label>
              <textarea className={styles.textarea} placeholder="How can we help you?"></textarea>
            </div>

            <button type="submit" className={styles.submitBtn}>Send Message</button>
          </form>
        </div>

        {/* Right Side: Information */}
        <div className={styles.infoBox}>
          
          <div className={styles.infoItem}>
            <div className={styles.iconWrapper}>
              <FaMapMarkerAlt />
            </div>
            <div>
              <h3 className={styles.infoTitle}>Our Boutique</h3>
              <p className={styles.infoText}>
                [TIMOGRAPH] Al Asmakh Mall,AlSadd<br />
                Gulf Mall,Garafa<br />
                Qatar
              </p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.iconWrapper}>
              <FaPhoneAlt />
            </div>
            <div>
              <h3 className={styles.infoTitle}>Phone</h3>
              <p className={styles.infoText}>
                [TIMOGRAPH] +974 3150 1001<br />
              
              </p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <div className={styles.iconWrapper}>
              <FaEnvelope />
            </div>
            <div>
              <h3 className={styles.infoTitle}>Email</h3>
              <p className={styles.infoText}>
                [TIMOGRAPH] timographqatar@gmail.com<br />
                support@yourwatchstore.com
              </p>
            </div>
          </div>

          {/* Simple Map Placeholder */}
          <div className={styles.mapContainer}>
             <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" alt="Location Map" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
