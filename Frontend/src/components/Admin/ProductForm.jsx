import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import { AppContext } from '../../context/AppContext';
import styles from '../../Styles/Admin.module.css';
import axiosInstance from '../../api/axios';

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const ProductForm = ({ productToEdit, onSubmitSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { showConfirm } = useContext(AppContext);
  
  const isEditing = !!productToEdit;

  const initialProductState = {
    name: "",
    brand: "",
    category: "Analog",
    price: "",
    offer: "",
    stock: "",
    description: "",
    imageUrl: "",
    featured: false,
    featuredOrder: 0,
    available: true,
  };

  const [product, setProduct] = useState(isEditing ? {
    name: productToEdit.name || "",
    brand: productToEdit.brand || "",
    category: productToEdit.category || "Analog",
    price: productToEdit.price || "",
    offer: productToEdit.offer || "",
    stock: productToEdit.stock || "",
    description: productToEdit.description || "",
    imageUrl: productToEdit.imgOrg === "url" ? productToEdit.image : productToEdit.image,
    featured: productToEdit.featured || false,
    featuredOrder: productToEdit.featuredOrder || 0,
    available: productToEdit.isAvailable ?? true,
  } : initialProductState);

  const [status, setStatus] = useState(isEditing ? (productToEdit.imgOrg || (productToEdit.image && productToEdit.image.startsWith('http') ? 'url' : 'file')) : "file");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [urlError, setUrlError] = useState("");

  useEffect(() => {
    if (status === "file" && imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (status === "url" && product.imageUrl) {
      try {
        new URL(product.imageUrl);
        setUrlError("");
        setPreviewUrl(product.imageUrl);
      } catch (err) {
        setUrlError("Please enter a valid URL.");
        setPreviewUrl(null);
      }
    } else if (status === "file" && !imageFile && isEditing) {
       if(product.imageUrl && product.imageUrl.startsWith("uploads")) {
         setPreviewUrl(`${API_URL}/${product.imageUrl.replace(/\\/g, '/')}`);
       }
    } else {
      setPreviewUrl(null);
      setUrlError("");
    }
  }, [status, imageFile, product.imageUrl, isEditing, API_URL]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({
      ...product,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleDelete = () => {
    showConfirm("Are you sure you want to delete this product? This action cannot be undone.", async () => {
      try {
        const response = await axiosInstance.delete(`${API_URL}/admin/deleteProduct/${productToEdit._id}`);
        if(response.data.isDeleted) {
           onSubmitSuccess();
        }
      } catch (error) {
        alert(error.response?.data?.message || error.message);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === "url" && urlError) {
      alert("Cannot submit: " + urlError);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("brand", product.brand);
      formData.append("category", product.category);
      formData.append("price", product.price);
      formData.append("offer", product.offer);
      formData.append("stock", product.stock);
      formData.append("description", product.description);
      formData.append("featured", product.featured);
      formData.append("featuredOrder", product.featuredOrder);
      formData.append("isAvailable", product.available);
      formData.append("imgOrg", status);
      
      if (status === "file") {
        if (imageFile) {
          formData.append("image", imageFile);
        }
      } else {
        formData.append("imageUrl", product.imageUrl);
      }

      let res;
      if (isEditing) {
        res = await axiosInstance.put(`${API_URL}/admin/editProduct/${productToEdit._id}`, formData);
      } else {
        res = await axiosInstance.post(`${API_URL}/admin/addProduct`, formData);
      }

      if (res.data.isAdded || res.data.isUpdated) {
        alert(res.data.message);
        if (!isEditing) {
          setProduct(initialProductState);
          setImageFile(null);
          setPreviewUrl(null);
        }
        onSubmitSuccess();
      }
      
    } catch (error) {
      if (error.response?.data) {
        return alert(error.response.data.message);
      }
      alert(error.message);
    }
  };

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/50?text=Image+Not+Found";
  };

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <h1>{isEditing ? "Edit Watch Product" : "Add Watch Product"}</h1>
        <p>Manage and organize your watch inventory</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.sectionTitle}>Basic Information</div>
        <div className={styles.grid}>
          <div className={styles.inputGroup}>
            <label>Product Name</label>
            <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Rolex Submariner" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Brand</label>
            <input type="text" name="brand" value={product.brand} onChange={handleChange} placeholder="Rolex" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Watch Category</label>
            <select name="category" value={product.category} onChange={handleChange}>
              <option value="Analog">Analog</option>
              <option value="Digital">Digital</option>
              <option value="Smart-Watch">Smart Watch</option>
              <option value="Luxury">Luxury</option>
              <option value="Sports">Sports</option>
              <option value="Chronograph">Chronograph</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>
        </div>

        <div className={styles.sectionTitle}>Pricing & Inventory</div>
        <div className={styles.grid}>
          <div className={styles.inputGroup}>
            <label>Price</label>
            <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="₹ 12,999" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Offer (%)</label>
            <input type="number" name="offer" value={product.offer} onChange={handleChange} placeholder="10" />
          </div>
          <div className={styles.inputGroup}>
            <label>Stock Quantity</label>
            <input type="number" name="stock" value={product.stock} onChange={handleChange} placeholder="50" required />
          </div>
        </div>

        <div className={styles.sectionTitle}>Product Description</div>
        <div className={styles.inputGroup}>
          <textarea name="description" value={product.description} onChange={handleChange} placeholder="Write detailed product description..." required />
        </div>

        <div style={{marginTop: "1rem"}}>
          <label style={{marginRight: "1rem"}}>Image Source:</label>
          <label style={{marginRight: "1rem"}}><input type="radio" value="file" onChange={(e) => setStatus(e.target.value)} checked={status === "file"} /> File Upload</label>
          <label><input type="radio" value="url" onChange={(e) => setStatus(e.target.value)} checked={status === "url"} /> Image URL</label>
        </div>

        <div className={styles.sectionTitle}>Product Images</div>
        <div className={styles.grid}>
          {status === "url" && (
            <div className={styles.inputGroup}>
              <label>Image URL</label>
              <input type="text" name="imageUrl" value={product.imageUrl} onChange={handleChange} placeholder="https://example.com/watch.jpg" />
              {urlError && <p style={{color: 'red', fontSize: '0.8rem', marginTop: '0.5rem'}}>{urlError}</p>}
            </div>
          )}
          {status === "file" && (
            <div className={styles.inputGroup}>
              <label>Upload Image (Multer)</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {imageFile && <p className={styles.fileName}>{imageFile.name}</p>}
            </div>
          )}
        </div>

        {previewUrl && (
          <div style={{marginTop: '1rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', maxWidth: '300px', textAlign: 'center'}}>
            <p style={{fontSize: '0.9rem', marginBottom: '0.5rem', color: '#666'}}>Image Preview</p>
            <img src={previewUrl} onError={handleImageError} alt="Preview" style={{maxWidth: '100%', maxHeight: '200px', objectFit: 'contain'}} />
          </div>
        )}

        <div className={styles.sectionTitle}>Product Status</div>
        <div className={styles.toggleSection}>
          <label className={styles.toggle}>
            <input type="checkbox" name="featured" checked={product.featured} onChange={handleChange} />
            <span>Featured Product</span>
          </label>
          <label className={styles.toggle}>
            <input type="checkbox" name="available" checked={product.available} onChange={handleChange} />
            <span>Available for Sale</span>
          </label>
        </div>

        {product.featured && (
          <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
            <label>Featured Priority (Higher number = Shows up first)</label>
            <input 
              type="number" 
              name="featuredOrder" 
              value={product.featuredOrder} 
              onChange={handleChange} 
              placeholder="e.g. 10" 
              style={{ maxWidth: '200px' }}
            />
          </div>
        )}

        <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
          <button type="submit" className={styles.submitBtn}>
            {isEditing ? "Update Product" : "Add Product"}
          </button>
          {isEditing && (
            <>
              <button type="button" onClick={handleDelete} className={styles.submitBtn} style={{backgroundColor: '#dc3545'}}>
                Delete Product
              </button>
              <button type="button" onClick={onCancel} className={styles.submitBtn} style={{backgroundColor: '#6c757d'}}>
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </section>
  );
};

export default ProductForm;
