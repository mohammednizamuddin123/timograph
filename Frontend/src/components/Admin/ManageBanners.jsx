import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import styles from '../../Styles/Admin.module.css';
import axiosInstance from '../../api/axios';

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const ManageBanners = () => {
  const { showConfirm } = useContext(AppContext);
  
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const initialBannerState = {
    title: "",
    subtitle: "",
    link: "",
    imageUrl: "",
    isActive: true,
    order: 0,
  };

  const [banner, setBanner] = useState(initialBannerState);
  const [bannerToEdit, setBannerToEdit] = useState(null);
  const isEditing = !!bannerToEdit;

  const [status, setStatus] = useState("file");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [urlError, setUrlError] = useState("");

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`${API_URL}/admin/banners`);
      if (res.data.success) {
        setBanners(res.data.banners);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Update preview URL based on state
  useEffect(() => {
    if (status === "file" && imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (status === "url" && banner.imageUrl) {
      try {
        new URL(banner.imageUrl);
        setUrlError("");
        setPreviewUrl(banner.imageUrl);
      } catch (err) {
        setUrlError("Please enter a valid URL.");
        setPreviewUrl(null);
      }
    } else if (status === "file" && !imageFile && isEditing) {
       if(banner.imageUrl && banner.imageUrl.startsWith("uploads")) {
         setPreviewUrl(`${API_URL}/${banner.imageUrl.replace(/\\/g, '/')}`);
       } else if (banner.imageUrl) {
         setPreviewUrl(banner.imageUrl);
       }
    } else {
      setPreviewUrl(null);
      setUrlError("");
    }
  }, [status, imageFile, banner.imageUrl, isEditing, API_URL]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBanner({
      ...banner,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEditClick = (bn) => {
    setBannerToEdit(bn);
    setBanner({
      title: bn.title || "",
      subtitle: bn.subtitle || "",
      link: bn.link || "",
      imageUrl: bn.imgOrg === "url" ? bn.image : bn.image,
      isActive: bn.isActive ?? true,
      order: bn.order || 0,
    });
    setStatus(bn.imgOrg || (bn.image && bn.image.startsWith('http') ? 'url' : 'file'));
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setBannerToEdit(null);
    setBanner(initialBannerState);
    setImageFile(null);
    setStatus("file");
  };

  const handleDelete = (id) => {
    showConfirm("Are you sure you want to delete this banner?", async () => {
      try {
        const response = await axiosInstance.delete(`${API_URL}/admin/deleteBanner/${id}`);
        if(response.data.isDeleted) {
           fetchBanners();
           if(isEditing && bannerToEdit._id === id) {
               handleCancelEdit();
           }
        }
      } catch (error) {
        alert(error.response?.data?.message || error.message);
      }
    });
  };

  const handleToggleActive = async (id, currentStatus) => {
     try {
         await axiosInstance.put(`${API_URL}/admin/editBanner/${id}`, { isActive: !currentStatus });
         fetchBanners();
     } catch (error) {
         alert("Failed to update status");
     }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === "url" && urlError) {
      alert("Cannot submit: " + urlError);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", banner.title);
      formData.append("subtitle", banner.subtitle);
      formData.append("link", banner.link);
      formData.append("isActive", banner.isActive);
      formData.append("order", banner.order);
      formData.append("imgOrg", status);
      
      if (status === "file") {
        if (imageFile) {
          formData.append("image", imageFile);
        } else if (!isEditing) {
           return alert("Please upload an image");
        }
      } else {
        if (!banner.imageUrl) return alert("Please enter an image URL");
        formData.append("imageUrl", banner.imageUrl);
      }

      let res;
      if (isEditing) {
        res = await axiosInstance.put(`${API_URL}/admin/editBanner/${bannerToEdit._id}`, formData);
      } else {
        res = await axiosInstance.post(`${API_URL}/admin/addBanner`, formData);
      }

      if (res.data.isAdded || res.data.isUpdated) {
        alert(res.data.message);
        handleCancelEdit();
        fetchBanners();
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
    <div>
        <section className={styles.card} style={{ marginBottom: '2rem' }}>
          <div className={styles.cardHeader}>
            <h1>{isEditing ? "Edit Banner" : "Add New Banner"}</h1>
            <p>{isEditing ? "Update banner details" : "Create a new banner for your storefront"}</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label>Title (Optional)</label>
                <input type="text" name="title" value={banner.title} onChange={handleChange} placeholder="Summer Sale" />
              </div>
              <div className={styles.inputGroup}>
                <label>Subtitle (Optional)</label>
                <input type="text" name="subtitle" value={banner.subtitle} onChange={handleChange} placeholder="Up to 50% off on all watches" />
              </div>
              <div className={styles.inputGroup}>
                <label>Redirection Link (Optional)</label>
                <input type="text" name="link" value={banner.link} onChange={handleChange} placeholder="/shop?category=sports" />
              </div>
              <div className={styles.inputGroup}>
                <label>Display Order</label>
                <input type="number" name="order" value={banner.order} onChange={handleChange} />
              </div>
            </div>

            <div style={{marginTop: "1rem"}}>
              <label style={{marginRight: "1rem"}}>Image Source:</label>
              <label style={{marginRight: "1rem"}}><input type="radio" value="file" onChange={(e) => setStatus(e.target.value)} checked={status === "file"} /> File Upload</label>
              <label><input type="radio" value="url" onChange={(e) => setStatus(e.target.value)} checked={status === "url"} /> Image URL</label>
            </div>

            <div className={styles.grid}>
              {status === "url" && (
                <div className={styles.inputGroup}>
                  <label>Image URL *</label>
                  <input type="text" name="imageUrl" value={banner.imageUrl} onChange={handleChange} placeholder="https://example.com/banner.jpg" />
                  {urlError && <p style={{color: 'red', fontSize: '0.8rem', marginTop: '0.5rem'}}>{urlError}</p>}
                </div>
              )}
              {status === "file" && (
                <div className={styles.inputGroup}>
                  <label>Upload Image *</label>
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

            <div className={styles.sectionTitle}>Banner Status</div>
            <div className={styles.toggleSection}>
              <label className={styles.toggle}>
                <input type="checkbox" name="isActive" checked={banner.isActive} onChange={handleChange} />
                <span>Active (Visible on Frontend)</span>
              </label>
            </div>

            <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
              <button type="submit" className={styles.submitBtn}>
                {isEditing ? "Update Banner" : "Add Banner"}
              </button>
              {isEditing && (
                <button type="button" onClick={handleCancelEdit} className={styles.submitBtn} style={{backgroundColor: '#6c757d'}}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className={styles.card}>
            <div className={styles.cardHeader}>
                <h1>Existing Banners</h1>
                <p>Manage your current banners</p>
            </div>
            
            {loading ? (
                <p>Loading banners...</p>
            ) : banners.length === 0 ? (
                <p>No banners found.</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ padding: '10px' }}>Image</th>
                                <th style={{ padding: '10px' }}>Details</th>
                                <th style={{ padding: '10px' }}>Order</th>
                                <th style={{ padding: '10px' }}>Status</th>
                                <th style={{ padding: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.map((bn) => (
                                <tr key={bn._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>
                                        <img 
                                            src={bn.imgOrg === "url" ? bn.image : `${API_URL}/${bn.image?.replace(/\\/g, '/')}`} 
                                            onError={handleImageError}
                                            alt={bn.title || "Banner"} 
                                            style={{ width: '100px', height: 'auto', borderRadius: '4px' }} 
                                        />
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        <strong>{bn.title || "No Title"}</strong><br/>
                                        <span style={{ fontSize: '0.85rem', color: '#666' }}>{bn.subtitle || "No Subtitle"}</span><br/>
                                        <span style={{ fontSize: '0.85rem', color: '#0066cc' }}>{bn.link || "No Link"}</span>
                                    </td>
                                    <td style={{ padding: '10px' }}>{bn.order}</td>
                                    <td style={{ padding: '10px' }}>
                                        <label className={styles.toggle}>
                                            <input type="checkbox" checked={bn.isActive} onChange={() => handleToggleActive(bn._id, bn.isActive)} />
                                            <span></span>
                                        </label>
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        <button onClick={() => handleEditClick(bn)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Edit</button>
                                        <button onClick={() => handleDelete(bn._id)} style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    </div>
  );
};

export default ManageBanners;
