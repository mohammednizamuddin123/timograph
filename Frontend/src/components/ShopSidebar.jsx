import React from 'react';
import styles from '../Styles/Shop.module.css';
import { formatCategory } from '../utils/formatters';

const CATEGORIES = ["Analog", "Digital", "Smart-Watch", "Luxury", "Sports", "Chronograph", "Automatic"];

const ShopSidebar = ({ filters, setFilters, availableBrands }) => {
  const handleCategoryChange = (e) => {
    setFilters({ ...filters, category: e.target.value, page: 1 });
  };

  const handleBrandChange = (brand) => {
    const currentBrands = filters.brand ? filters.brand.split(',') : [];
    let newBrands;
    
    if (currentBrands.includes(brand)) {
      newBrands = currentBrands.filter(b => b !== brand);
    } else {
      newBrands = [...currentBrands, brand];
    }
    
    setFilters({ ...filters, brand: newBrands.join(','), page: 1 });
  };

  const handlePriceChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const resetFilters = () => {
    setFilters({
      search: filters.search, // Keep search text if they are searching
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      minOffer: '',
      maxOffer: '',
      page: 1
    });
  };

  return (
    <aside className={styles.sidebar}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #333' }}>
        <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', letterSpacing: '1px' }}>FILTERS</h3>
        <button onClick={resetFilters} className={styles.resetBtn}>Reset All</button>
      </div>

      {/* Categories */}
      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>Categories</h4>
        <ul className={styles.filterList}>
          <li className={styles.filterItem}>
            <label className={styles.filterLabel}>
              <input 
                type="radio" 
                name="category" 
                value="" 
                checked={filters.category === ""} 
                onChange={handleCategoryChange} 
                className={styles.filterInput}
              />
              All Categories
            </label>
          </li>
          {CATEGORIES.map(cat => (
            <li key={cat} className={styles.filterItem}>
              <label className={styles.filterLabel}>
                <input 
                  type="radio" 
                  name="category" 
                  value={cat} 
                  checked={filters.category === cat} 
                  onChange={handleCategoryChange} 
                  className={styles.filterInput}
                />
                {formatCategory(cat)}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>Price Range</h4>
        <div className={styles.priceInputs}>
          <input 
            type="number" 
            name="minPrice" 
            placeholder="Min ₹" 
            value={filters.minPrice} 
            onChange={handlePriceChange}
            className={styles.priceInput}
          />
          <span>-</span>
          <input 
            type="number" 
            name="maxPrice" 
            placeholder="Max ₹" 
            value={filters.maxPrice} 
            onChange={handlePriceChange}
            className={styles.priceInput}
          />
        </div>
      </div>

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div className={styles.filterSection}>
          <h4 className={styles.filterTitle}>Brands</h4>
          <ul className={styles.filterList}>
            {availableBrands.map(brand => {
              const isChecked = filters.brand ? filters.brand.split(',').includes(brand) : false;
              return (
                <li key={brand} className={styles.filterItem}>
                  <label className={styles.filterLabel}>
                    <input 
                      type="checkbox" 
                      checked={isChecked} 
                      onChange={() => handleBrandChange(brand)} 
                      className={styles.filterInput}
                    />
                    {brand.replace(/_/g, ' ')}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Offers */}
      <div className={styles.filterSection}>
        <h4 className={styles.filterTitle}>Discount Offer</h4>
        <div className={styles.priceInputs}>
          <input 
            type="number" 
            name="minOffer" 
            placeholder="Min %" 
            value={filters.minOffer} 
            onChange={handlePriceChange}
            className={styles.priceInput}
          />
          <span>-</span>
          <input 
            type="number" 
            name="maxOffer" 
            placeholder="Max %" 
            value={filters.maxOffer} 
            onChange={handlePriceChange}
            className={styles.priceInput}
          />
        </div>
      </div>

    </aside>
  );
};

export default ShopSidebar;
