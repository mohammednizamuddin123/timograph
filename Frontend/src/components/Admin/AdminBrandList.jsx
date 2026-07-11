import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import styles from "../../Styles/AdminBrandList.module.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import BrandForm from "./BrandForm";

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const AdminBrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState(null);

  const fetchBrands = async () => {
    try {
      const res = await axiosInstance.get(`${API_URL}/admin/getBrands`);
      if (res.data.success) {
        setBrands(res.data.brands);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load brands.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        const res = await axiosInstance.delete(`${API_URL}/admin/deleteBrand/${id}`);
        if (res.data.isDeleted) {
          fetchBrands();
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete brand");
      }
    }
  };

  const openAddForm = () => {
    setBrandToEdit(null);
    setShowForm(true);
  };

  const openEditForm = (brand) => {
    setBrandToEdit(brand);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setBrandToEdit(null);
    fetchBrands();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <h2>Brand Management Hub</h2>
        <button className={styles.addButton} onClick={openAddForm}>
          + Add New Brand
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Brand Logo</th>
              <th>Brand Name</th>
              <th>Display Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id}>
                <td>
                  <img
                    src={brand.imageUrl}
                    alt={brand.name}
                    className={styles.brandImage}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/120x80?text=Error" }}
                  />
                </td>
                <td className={styles.brandName}>{brand.name.replace(/_/g, ' ')}</td>
                <td><span className={styles.priorityBadge}>{brand.priority}</span></td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => openEditForm(brand)}>
                      <FaEdit />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(brand._id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "3rem", color: "#888" }}>
                  No brands found. Create your first brand to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <BrandForm 
          key={brandToEdit ? brandToEdit._id : 'new'}
          onClose={closeForm} 
          brandToEdit={brandToEdit} 
        />
      )}
    </div>
  );
};

export default AdminBrandList;
