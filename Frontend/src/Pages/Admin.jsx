import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import styles from "../Styles/Admin.module.css";

import Sidebar from "../components/Admin/Sidebar";
import ProductForm from "../components/Admin/ProductForm";
import ProductList from "../components/Admin/ProductList";
import Dashboard from "../components/Admin/Dashboard";
import ManageBanners from "../components/Admin/ManageBanners";
import AdminBrandList from "../components/Admin/AdminBrandList";
import AdminOrders from "../components/Admin/AdminOrders";
import AdminUsers from "../components/Admin/AdminUsers";
import { useLayoutEffect } from "react";

function Admin() {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("Analytics");
  const [productToEdit, setProductToEdit] = useState(null);
  useLayoutEffect(()=>{
    
  },[])

  useEffect(() => {
    // When navigating to Edit Product tab, reset the editing state to show the list
    if (activeTab === "Edit Product") {
      setProductToEdit(null);
    }
  }, [activeTab]);

  const handleEditClick = (prod) => {
    setProductToEdit(prod);
  };

  const handleFormSubmitSuccess = () => {
    if (activeTab === "Edit Product") {
      dispatch(fetchProducts({ page: 1, limit: 20 }));
      setProductToEdit(null);
    }
  };

  const handleCancelEdit = () => {
    setProductToEdit(null);
  };

  return (
    <div className={styles.adminContainer}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className={styles.mainContent}>
        {activeTab === "Analytics" && (
          <Dashboard />
        )}

        {activeTab === "Add Product" && (
          <ProductForm 
            key="add-product-form"
            productToEdit={null} 
            onSubmitSuccess={handleFormSubmitSuccess} 
            onCancel={null} 
          />
        )}

        {activeTab === "Edit Product" && (
          <>
            {productToEdit ? (
              <ProductForm 
                key={productToEdit._id}
                productToEdit={productToEdit} 
                onSubmitSuccess={handleFormSubmitSuccess} 
                onCancel={handleCancelEdit} 
              />
            ) : (
              <ProductList onEditClick={handleEditClick} />
            )}
          </>
        )}

        {activeTab === "Manage Banners" && (
          <ManageBanners />
        )}

        {activeTab === "Manage Brands" && (
          <AdminBrandList />
        )}

        {activeTab === "Orders" && (
          <AdminOrders />
        )}

        {activeTab === "Users" && (
          <AdminUsers />
        )}

        {activeTab !== "Add Product" && activeTab !== "Edit Product" && activeTab !== "Analytics" && activeTab !== "Manage Banners" && activeTab !== "Manage Brands" && activeTab !== "Orders" && activeTab !== "Users" && (
          <section className={styles.placeholderCard}>
            <h2>{activeTab} Section</h2>
            <p>Reserved for future functionality...</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default Admin;
