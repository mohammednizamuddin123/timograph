import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLimit, setPage, deleteProduct, fetchProducts } from '../../redux/slices/productSlice';
import { AppContext } from '../../context/AppContext';
import styles from '../../Styles/Admin.module.css';

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const ProductList = ({ onEditClick }) => {
  const dispatch = useDispatch();
  const { showConfirm } = useContext(AppContext);
  const { items: products, total, page, pages, limit, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit }));
  }, [dispatch, page, limit]);

  const getImageUrl = (prod) => {
    if (!prod.image) return "https://via.placeholder.com/50?text=No+Image";
    const pImgOrg = prod.imgOrg || (prod.image.startsWith('http') ? 'url' : 'file');
    if (pImgOrg === "file") {
      return `${API_URL}/${prod.image.replace(/\\/g, '/')}`;
    }
    return prod.image;
  };

  const handleImageError = (e) => {
    e.target.src = "/notFound.png";
  };

  const handleDelete = (id) => {
    showConfirm("Are you sure you want to delete this product? This action cannot be undone.", () => {
      dispatch(deleteProduct(id));
    });
  };

  return (
    <section className={styles.card}>
      <div className={styles.cardHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1>Edit Products</h1>
          <p>Select a product to edit or delete</p>
        </div>
        <div>
          <label style={{marginRight: '0.5rem'}}>Limit:</label>
          <select value={limit} onChange={(e) => {
            dispatch(setLimit(Number(e.target.value)));
            dispatch(setPage(1));
          }} style={{padding: '0.3rem'}}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div style={{marginTop: '1rem', position: 'relative', minHeight: '300px'}}>
        {loading && (
          <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '2rem', zIndex: 10}}>
            <span style={{fontWeight: 'bold', color: '#007bff', background: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
              Loading products...
            </span>
          </div>
        )}
        
        <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
          <thead>
            <tr style={{borderBottom: '1px solid #ddd'}}>
              <th style={{padding: '0.5rem'}}>Image</th>
              <th style={{padding: '0.5rem'}}>Name</th>
              <th style={{padding: '0.5rem'}}>Brand</th>
              <th style={{padding: '0.5rem'}}>Price</th>
              <th style={{padding: '0.5rem'}}>Stock</th>
              <th style={{padding: '0.5rem'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && !loading ? (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '1rem'}}>No products found</td></tr>
            ) : (
              products.map(prod => (
                <tr key={prod._id} style={{borderBottom: '1px solid #eee'}}>
                  <td style={{padding: '0.5rem', width: '60px'}}>
                    <img 
                      src={getImageUrl(prod)} 
                      onError={handleImageError} 
                      alt={prod.name} 
                      style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', display: 'block'}} 
                    />
                  </td>
                  <td style={{padding: '0.5rem'}}>{prod.name}</td>
                  <td style={{padding: '0.5rem'}}>{prod.brand}</td>
                  <td style={{padding: '0.5rem'}}>₹{prod.price}</td>
                  <td style={{padding: '0.5rem'}}>{prod.stock}</td>
                  <td style={{padding: '0.5rem'}}>
                    <button onClick={() => onEditClick(prod)} style={{padding: '0.3rem 0.6rem', marginRight: '0.5rem', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px'}}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(prod._id)} style={{padding: '0.3rem 0.6rem', cursor: 'pointer', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px'}}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem', alignItems: 'center'}}>
          <button 
            disabled={page <= 1} 
            onClick={() => dispatch(setPage(page - 1))}
            style={{padding: '0.5rem 1rem', cursor: page <= 1 ? 'not-allowed' : 'pointer'}}
          >
            Previous
          </button>
          <span>Page {page} of {pages || 1} (Total: {total})</span>
          <button 
            disabled={page >= pages} 
            onClick={() => dispatch(setPage(page + 1))}
            style={{padding: '0.5rem 1rem', cursor: page >= pages ? 'not-allowed' : 'pointer'}}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductList;
