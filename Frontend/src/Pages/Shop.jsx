import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../api/axios';
import styles from '../Styles/Shop.module.css';
import ShopSidebar from '../components/ShopSidebar';
import ProductCard from '../components/ProductCard';

const API_URL = import.meta.env.REACT_API_URL || 'http://localhost:3000';

const Shop = () => {
  const location = useLocation();
  const searchInputRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Initialize filters from URL parameters
  const getInitialFilters = () => {
    const queryParams = new URLSearchParams(location.search);
    return {
      search: queryParams.get('search') === 'open' ? '' : (queryParams.get('search') || ''),
      category: queryParams.get('category') || '',
      brand: queryParams.get('brand') || '',
      minPrice: queryParams.get('minPrice') || '',
      maxPrice: queryParams.get('maxPrice') || '',
      minOffer: queryParams.get('minOffer') || '',
      maxOffer: queryParams.get('maxOffer') || '',
      page: parseInt(queryParams.get('page')) || 1
    };
  };

  const [filters, setFilters] = useState(getInitialFilters());

  // Check if we came here from the Navbar search icon or Collections page
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    // Update filters if URL changes externally (like clicking collections)
    setFilters(prev => ({
      ...prev,
      category: queryParams.get('category') || prev.category,
      search: queryParams.get('search') === 'open' ? '' : (queryParams.get('search') || prev.search)
    }));

    if (queryParams.get('search') === 'open' && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [location.search]);

  // Fetch unique brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axiosInstance.get(`${API_URL}/users/products/brands`);
        if (res.data.success) {
          setAvailableBrands(res.data.brands);
        }
      } catch (err) {
        console.error("Failed to load brands", err);
      }
    };
    fetchBrands();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Build query string, omitting empty fields
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== '') {
            queryParams.append(key, value);
          }
        });

        const res = await axiosInstance.get(`${API_URL}/users/products?${queryParams.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
          setTotalPages(res.data.pages);
          setTotalProducts(res.data.total);
          setPage(res.data.page);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the fetch slightly so typing in search/price doesn't spam the API
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters({ ...filters, page: newPage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.shopPage}>
      {/* Search Header */}
      <header className={styles.searchHeader}>
        <input 
          ref={searchInputRef}
          type="text" 
          placeholder="Search for watches by name or description..." 
          className={styles.searchBar}
          value={filters.search}
          onChange={handleSearchChange}
        />
      </header>

      <div className={styles.mainContent}>
        {/* Sidebar Filters */}
        <ShopSidebar 
          filters={filters} 
          setFilters={setFilters} 
          availableBrands={availableBrands} 
        />

        {/* Product Area */}
        <section className={styles.productArea}>
          <div className={styles.headerRow}>
            <h2 style={{margin: 0, fontWeight: 300, letterSpacing: '1px'}}>ALL WATCHES</h2>
            <span className={styles.resultCount}>
              Showing {products.length} of {totalProducts} results
            </span>
          </div>

          {loading ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#888'}}>Loading products...</div>
          ) : products.length === 0 ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#888'}}>
              No products found matching your filters.
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    className={styles.pageBtn} 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Prev
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i + 1}
                      className={`${styles.pageBtn} ${page === i + 1 ? styles.active : ''}`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button 
                    className={styles.pageBtn} 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Shop;
