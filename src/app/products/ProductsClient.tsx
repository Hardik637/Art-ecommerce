'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ARTWORKS,
  normalizeCategory,
  getArtworkCategory,
  getCategoryLabel,
} from '@/lib/artCatalog';
import { Product } from '@/types/art';
import ArtworkCard from '@/components/ArtworkCard';
import {
  SlidersHorizontal,
  X,
  Search,
  ChevronRight,
} from 'lucide-react';

interface ProductsClientProps {
  initialProducts?: Product[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL state
  const initialCategory = searchParams.get('category') || 'all';
  const initialFilter = searchParams.get('filter') || 'all';
  const initialMaxPrice = searchParams.get('maxPrice') || '';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedOrientation, setSelectedOrientation] = useState('all');
  const [priceRange, setPriceRange] = useState<string>(initialMaxPrice ? `under-${initialMaxPrice}` : 'all');
  const [specialFilter, setSpecialFilter] = useState(initialFilter);
  const [sortOrder, setSortOrder] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedOrientation('all');
    setPriceRange('all');
    setSpecialFilter('all');
    setSearchQuery('');
    router.replace('/products', { scroll: false });
  };

  // Base products
  const baseProducts = useMemo(() => {
    if (initialProducts && initialProducts.length > 0) return initialProducts;
    return ARTWORKS;
  }, [initialProducts]);

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedOrientation !== 'all') count++;
    if (priceRange !== 'all') count++;
    if (specialFilter !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedCategory, selectedOrientation, priceRange, specialFilter, searchQuery]);

  // Filter and sort products
  const filteredArtworks = useMemo(() => {
    let list = [...baseProducts];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.artistName && a.artistName.toLowerCase().includes(q)) ||
          a.medium.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    // Category Filter (3 Major Categories: Wall Art, Sculptures, Decorative Pieces)
    if (selectedCategory !== 'all') {
      const norm = normalizeCategory(selectedCategory);
      list = list.filter((a) => getArtworkCategory(a) === norm);
    }

    // Special Filter
    if (specialFilter === 'featured') {
      list = list.filter((a) => a.isFeatured);
    } else if (specialFilter === 'limited-editions') {
      list = list.filter((a) => a.isLimitedEdition);
    } else if (specialFilter === 'new') {
      list = list.filter((a) => a.isNew);
    } else if (specialFilter === 'bestsellers' || specialFilter === 'bestseller') {
      list = list.filter((a) => a.isBestseller);
    }

    // Orientation
    if (selectedOrientation !== 'all') {
      list = list.filter((a) => a.orientation === selectedOrientation);
    }

    // Price
    if (priceRange === 'under-5000') {
      list = list.filter((a) => a.price <= 5000);
    } else if (priceRange === '5000-15000') {
      list = list.filter((a) => a.price >= 5000 && a.price <= 15000);
    } else if (priceRange === '15000-30000') {
      list = list.filter((a) => a.price >= 15000 && a.price <= 30000);
    } else if (priceRange === 'above-30000') {
      list = list.filter((a) => a.price > 30000);
    }

    // Sorting
    if (sortOrder === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'newest') {
      list.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
    } else if (sortOrder === 'rating') {
      list.sort((a, b) => (b.rating ?? 5) - (a.rating ?? 5));
    }

    return list;
  }, [
    baseProducts,
    selectedCategory,
    selectedOrientation,
    priceRange,
    specialFilter,
    sortOrder,
    searchQuery,
  ]);

  return (
    <div className="bg-[#FAFAF9] min-h-screen text-[#0F0F0F]">
      {/* ── 1. CATALOG HEADER ────────────────────────────────────────── */}
      <section className="border-b border-neutral-200 bg-white pt-6 pb-8 md:pt-10 md:pb-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <nav className="flex items-center gap-2 text-xs font-sans text-neutral-500 mb-4 uppercase tracking-wider">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-black font-semibold">Catalog</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-black tracking-tight uppercase leading-none">
                All Products
              </h1>
              <p className="text-xs sm:text-sm font-sans text-neutral-600 mt-2 max-w-2xl leading-relaxed">
                Explore our complete collection of curated original wall art, sculptures, and decorative objects for modern living spaces.
              </p>
            </div>

            <div className="text-xs font-sans text-neutral-500 flex-shrink-0">
              <span className="font-bold text-neutral-900 text-sm">{filteredArtworks.length}</span> Items
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CONTROLS BAR: CATEGORY PILLS, SEARCH & SORT ────────────── */}
      <div className="sticky top-16 md:top-18 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 py-3">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap items-center justify-between gap-3">
          {/* Quick Category Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="bg-[#0F0F0F] hover:bg-neutral-800 text-white px-3.5 py-2 text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-2 flex-shrink-0 transition-colors"
            >
              <SlidersHorizontal size={13} />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            {[
              { id: 'all', label: 'All Products' },
              { id: 'wall-art', label: 'Wall Art' },
              { id: 'sculptures', label: 'Sculptures' },
              { id: 'decorative-pieces', label: 'Decorative Pieces' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 uppercase tracking-wider text-[11px] font-sans font-semibold border transition-colors flex-shrink-0 ${
                  (cat.id === 'all' && selectedCategory === 'all') ||
                  normalizeCategory(selectedCategory) === cat.id
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:text-black hover:border-neutral-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative w-full sm:w-56">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-neutral-50 border border-neutral-200 pl-8 pr-7 py-1.5 text-xs text-[#0F0F0F] placeholder-neutral-400 outline-none focus:border-black transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[11px] font-sans text-neutral-500 uppercase tracking-wider hidden md:inline">
                Sort:
              </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-white border border-neutral-200 px-2.5 py-1.5 text-xs font-sans text-neutral-900 outline-none focus:border-black cursor-pointer"
              >
                <option value="recommended">Featured</option>
                <option value="newest">Newest Releases</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap items-center gap-2 pt-2.5">
            <span className="text-xs font-sans text-neutral-500">Active Filters:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-200 text-neutral-900 text-xs font-sans">
                <span>{getCategoryLabel(selectedCategory)}</span>
                <button onClick={() => setSelectedCategory('all')} className="hover:text-black">
                  <X size={11} />
                </button>
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-200 text-neutral-900 text-xs font-sans">
                <span>Price: {priceRange.replace('-', ' to ')}</span>
                <button onClick={() => setPriceRange('all')} className="hover:text-black">
                  <X size={11} />
                </button>
              </span>
            )}
            {specialFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-200 text-neutral-900 text-xs font-sans capitalize">
                <span>{specialFilter}</span>
                <button onClick={() => setSpecialFilter('all')} className="hover:text-black">
                  <X size={11} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-200 text-neutral-900 text-xs font-sans">
                <span>&ldquo;{searchQuery}&rdquo;</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-black">
                  <X size={11} />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-sans font-semibold text-neutral-900 hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* ── 3. STANDARD FASHION PRODUCT GRID (4-col Desktop, 2-col Mobile) ── */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 md:py-12">
        {filteredArtworks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredArtworks.map((art, index) => (
              <ArtworkCard
                key={art.id}
                artwork={art}
                priority={index < 4}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 bg-white border border-neutral-200">
            <h3 className="font-sans font-bold text-xl text-neutral-900 uppercase mb-2">
              No matching products found
            </h3>
            <p className="text-xs font-sans text-neutral-500 max-w-md mx-auto mb-6">
              We couldn&apos;t find any items matching your active criteria. Try clearing filters or searching for another term.
            </p>
            <button
              onClick={clearAllFilters}
              className="bg-[#0F0F0F] text-white px-6 py-3 text-xs font-sans font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* ── 4. SLIDE-OUT FILTER DRAWER ─────────────────────────────────── */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setFilterDrawerOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white flex flex-col shadow-2xl">
              <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
                <span className="font-sans font-bold text-sm uppercase tracking-wider text-[#0F0F0F]">
                  Filter Products
                </span>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-black"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Category Selection */}
                <div className="space-y-3">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-900 block">
                    Category
                  </span>
                  <div className="space-y-2 text-xs font-sans text-neutral-600">
                    {[
                      { id: 'all', label: 'All Products' },
                      { id: 'wall-art', label: 'Wall Art' },
                      { id: 'sculptures', label: 'Sculptures' },
                      { id: 'decorative-pieces', label: 'Decorative Pieces' },
                    ].map((c) => (
                      <label key={c.id} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="drawer-cat"
                          checked={
                            c.id === 'all'
                              ? selectedCategory === 'all'
                              : normalizeCategory(selectedCategory) === c.id
                          }
                          onChange={() => setSelectedCategory(c.id)}
                          className="accent-black"
                        />
                        <span>{c.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3 pt-3 border-t border-neutral-100">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-900 block">
                    Price Range (INR)
                  </span>
                  <div className="space-y-2 text-xs font-sans text-neutral-600">
                    {[
                      { id: 'all', label: 'All Price Tiers' },
                      { id: 'under-5000', label: 'Under ₹5,000' },
                      { id: '5000-15000', label: '₹5,000 – ₹15,000' },
                      { id: '15000-30000', label: '₹15,000 – ₹30,000' },
                      { id: 'above-30000', label: 'Above ₹30,000' },
                    ].map((tier) => (
                      <label key={tier.id} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="drawer-price"
                          checked={priceRange === tier.id}
                          onChange={() => setPriceRange(tier.id)}
                          className="accent-black"
                        />
                        <span>{tier.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Product Type / Special */}
                <div className="space-y-3 pt-3 border-t border-neutral-100">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-900 block">
                    Product Type
                  </span>
                  <div className="space-y-2 text-xs font-sans text-neutral-600">
                    {[
                      { id: 'all', label: 'All Products' },
                      { id: 'featured', label: 'Featured Products' },
                      { id: 'limited-editions', label: 'Numbered Editions' },
                      { id: 'bestsellers', label: 'Bestselling Products' },
                      { id: 'new', label: 'New Arrivals' },
                    ].map((s) => (
                      <label key={s.id} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="drawer-special"
                          checked={specialFilter === s.id}
                          onChange={() => setSpecialFilter(s.id)}
                          className="accent-black"
                        />
                        <span>{s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-neutral-200 bg-neutral-50 flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="w-1/2 border border-neutral-300 py-3 text-xs font-sans font-semibold uppercase tracking-wider hover:bg-neutral-100 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="w-1/2 bg-[#0F0F0F] text-white py-3 text-xs font-sans font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  Apply ({filteredArtworks.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
