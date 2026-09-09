import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { CATEGORIES } from '../data/products';
import { Filter, Ruler } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductGrid({ products, activeCategory, onSelectCategory, onQuickView }) {
  const { setIsSizingModalOpen } = useCart();
  const [selectedSizeFilter, setSelectedSizeFilter] = useState('ALL');

  // Gather unique sizes across the catalog
  const allSizes = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.sizes.forEach((s) => set.add(s)));
    return ['ALL', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === 'All Pieces' || p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSize = selectedSizeFilter === 'ALL' || p.sizes.includes(selectedSizeFilter);
      return matchCat && matchSize;
    });
  }, [products, activeCategory, selectedSizeFilter]);

  return (
    <section className="catalog-section" id="catalog" aria-labelledby="catalog-heading">
      <div className="container">
        <div className="catalog-header">
          <div className="catalog-header-top">
            <div>
              <div className="badge badge-evergreen" style={{ marginBottom: '8px' }}>
                Challenge Boutique Collection
              </div>
              <h2 id="catalog-heading">In-Stock Ready-to-Wear</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>
                Showing <strong>{filteredProducts.length}</strong> pieces
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsSizingModalOpen(true)}
              >
                <Ruler size={13} />
                <span>Size Chart</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="category-tabs" role="tablist" aria-label="Garment categories">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => onSelectCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Size Quick Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-ink-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Filter Size:
              </span>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {allSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    className={`size-pill ${selectedSizeFilter === sz ? 'selected' : ''}`}
                    onClick={() => setSelectedSizeFilter(sz)}
                    style={{ minWidth: '26px', height: '24px', fontSize: '0.7rem' }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', border: '1px dashed var(--color-border)', borderRadius: '8px' }}>
            <p style={{ fontSize: '1rem', color: 'var(--color-ink)' }}>No pieces matched the selected filter.</p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '16px' }}
              onClick={() => {
                onSelectCategory('All Pieces');
                setSelectedSizeFilter('ALL');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
