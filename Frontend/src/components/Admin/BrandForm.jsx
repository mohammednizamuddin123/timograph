import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../api/axios";
import styles from "../../Styles/Admin.module.css";
import { FaTimes } from "react-icons/fa";

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const BrandForm = ({ onClose, brandToEdit }) => {
  const isEditing = !!brandToEdit;
  const formRef = useRef(null);
  
  const [brand, setBrand] = useState(isEditing ? {
    name: brandToEdit.name || "",
    imageUrl: brandToEdit.imageUrl || "",
    priority: brandToEdit.priority || 0,
  } : {
    name: "",
    imageUrl: "",
    priority: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Automatically scroll to the form when it opens
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Automatically replace any spaces with underscores for the brand name
    if (name === "name") {
      value = value.replace(/\s+/g, "_");
    }

    setBrand({ ...brand, [name]: value });
    
    if (name === "imageUrl") {
      setImgError(false); // Reset image error when URL changes
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;  
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!brand.name.trim()) {
      return setError("Brand name is required");
    }

    if (!isValidUrl(brand.imageUrl)) {
      return setError("Please enter a valid Image URL");
    }

    setLoading(true);

    try {
      const url = isEditing 
        ? `${API_URL}/admin/editBrand/${brandToEdit._id}`
        : `${API_URL}/admin/addBrand`;
      
      const method = isEditing ? 'put' : 'post';

      const res = await axiosInstance({
        method,
        url,
        data: brand
      });

      if (res.data.isAdded || res.data.isUpdated) {
        onClose();
      } else {
        setError(res.data.message || "Failed to save brand");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    setImgError(true);
    // You can use a local SVG or a reliable external placeholder
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3Cline x1='4' y1='4' x2='20' y2='20' stroke='red'%3E%3C/line%3E%3C/svg%3E";
  };

  return (
    <div className={styles.modalOverlay} ref={formRef}>
      <div className={styles.modalContent} style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem', backgroundColor: '#1a1a1a', borderRadius: '12px', border: '1px solid #333' }}>
        <button className={styles.closeBtn} onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.5rem' }}><FaTimes /></button>
        <h2 style={{ marginBottom: '1.5rem', color: '#fff' }}>{isEditing ? "Edit Brand" : "Add New Brand"}</h2>

        {error && <div className={styles.errorMsg} style={{ color: '#ff4d4d', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Brand Name</label>
            <input
              type="text"
              name="name"
              value={brand.name}
              onChange={handleChange}
              placeholder="e.g. Rolex"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Image URL</label>
            <input
              type="url"
              name="imageUrl"
              value={brand.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Priority (Higher number shows first)</label>
            <input
              type="number"
              name="priority"
              value={brand.priority}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>

          <div className={styles.imagePreviewContainer} style={{ marginTop: '20px', textAlign: 'center' }}>
            <label style={{ display: 'block', marginBottom: '10px' }}>Image Preview</label>
            {brand.imageUrl ? (
              <img 
                src={brand.imageUrl} 
                alt="Brand Preview" 
                onError={handleImageError}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  objectFit: 'contain',
                  border: imgError ? '2px solid red' : '1px solid #333',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#111'
                }}
              />
            ) : (
              <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #555', color: '#888', borderRadius: '8px' }}>
                No image URL provided
              </div>
            )}
            {imgError && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>Image failed to load. Check the URL.</p>}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading || imgError}>
            {loading ? "Saving..." : (isEditing ? "Update Brand" : "Add Brand")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BrandForm;
