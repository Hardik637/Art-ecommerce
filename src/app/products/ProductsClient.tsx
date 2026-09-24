'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ARTWORKS,
  normalizeCategory,
  getArtworkCategory,
  getCategoryLabel,
  MajorCategory,
} from '@/lib/artCatalog';
import { Product, ArtworkProduct } from '@/types/art';
import ArtworkCard from '@/components/ArtworkCard';
import ProductQuickView from '@/components/ProductQuickView';
import RecentlyViewed from '@/components/RecentlyViewed';
import FindYourPieceModal from '@/components/FindYourPieceModal';
import {
  SlidersHorizontal,
  X,
  Search,
  ChevronRight,
  ArrowUpDown,
  Check,
  Compass,
} from 'lucide-react';

interface ProductsClientProps {
  initialProducts?: Product[];
}

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Featured' },
  { id: 'newest', label: 'Newest Releases' },
  { id: 'bestsellers', label: 'Best Selling' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
];

export default function ProductsClient({ initialProducts }: ProductsClientProps = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL state
  const initialCategory = searchParams.get('category') || 'all';
  const initialFilter = searchParams.get('filter') || 'all';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialStyle = searchParams.get('style') || 'all';
  const initialPriceRange =
    searchParams.get('priceRange') ||
    (initialMaxPrice ? (initialMaxPrice === '10000' ? 'under-10000' : `under-${initialMaxPrice}`) : 'all');

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [selectedOrientation, setSelectedOrientation] = useState('all');
  const [priceRange, setPriceRange] = useState<string>(initialPriceRange);
  const [specialFilter, setSpecialFilter] = useState(initialFilter);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');

  // UI state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [findPieceOpen, setFindPieceOpen] = useState(false);
  const [quickViewArtwork, setQuickViewArtwork] = useState<ArtworkProduct | null>(null);

  // Sync state if searchParams change
  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedStyle('all');
    setSelectedOrientation('all');
    setPriceRange('all');
    setSpecialFilter('all');
    setAvailabilityFilter('all');
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
    if (selectedStyle !== 'all') count++;
    if (selectedOrientation !== 'all') count++;
    if (priceRange !== 'all') count++;
    if (specialFilter !== 'all') count++;
    if (availabilityFilter !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedCategory, selectedStyle, selectedOrientation, priceRange, specialFilter, availabilityFilter, searchQuery]);

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

    // Style Filter
    if (selectedStyle !== 'all') {
      const s = selectedStyle.toLowerCase();
      list = list.filter((a) => {
        const inTags = (a.styleTags || []).some((t) => t.toLowerCase().includes(s));
        const inMood = (a.moodTags || []).some((m) => m.toLowerCase().includes(s));
        const inMedium = (a.medium || '').toLowerCase().includes(s);
        const inDesc = (a.description || '').toLowerCase().includes(s);
        const inName = (a.name || '').toLowerCase().includes(s);
        return inTags || inMood || inMedium || inDesc || inName;
      });
    }

    // Availability Filter
    if (availabilityFilter === 'in-stock') {
      list = list.filter((a) => a.stock > 0);
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
    } else if (priceRange === 'under-10000') {
      list = list.filter((a) => a.price <= 10000);
    } else if (priceRange === '10000-25000') {
      list = list.filter((a) => a.price >= 10000 && a.price <= 25000);
    } else if (priceRange === 'above-25000') {
      list = list.filter((a) => a.price > 25000);
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
    } else if (sortOrder === 'bestsellers') {
      list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    } else if (sortOrder === 'rating') {
      list.sort((a, b) => (b.rating ?? 5) - (a.rating ?? 5));
    }

    return list;
  }, [
    baseProducts,
    selectedCategory,
    selectedStyle,
    selectedOrientation,
    availabilityFilter,
    priceRange,
    specialFilter,
    sortOrder,
    searchQuery,
  ]);

  const currentSortLabel = SORT_OPTIONS.find((s) => s.id === sortOrder)?.label || 'Featured';

  return (
    <div className="bg-[#FAFAF9] min-h-screen text-[#0F0F0F]">
      {/* ── 1. CLEAN E-COMMERCE ALL PRODUCTS HEADER ──────────────────── */}
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
              <p className="text-xs sm:text-sm font-sans text-neutral-600 mt-2 max-w-xl leading-relaxed">
                Explore our full catalog of original paintings, limited edition sculptures, and architectural decor.
              </p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setFindPieceOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-black text-white hover:bg-neutral-800 text-[11px] font-sans font-bold uppercase tracking-wider transition-colors shadow-xs"
              >
                <Compass size={14} />
                <span>Find Your Piece</span>
              </button>
              <div className="text-xs font-sans text-neutral-500">
                <span className="font-bold text-neutral-900 text-sm">{filteredArtworks.length}</span>{' '}
                {filteredArtworks.length === 1 ? 'Product' : 'Products'} Available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CONTROLS BAR: FILTERS, CATEGORIES, SEARCH, SORT ───────── */}
      <div className="sticky top-[54px] md:top-[60px] z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 py-2.5 sm:py-3">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Quick Category Pills & Filter Drawer Button */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="bg-[#0F0F0F] hover:bg-neutral-800 text-white px-3.5 py-2 text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-2 flex-shrink-0 transition-colors"
            >
              <SlidersHorizontal size={13} />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            {/* Category Pills */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 uppercase tracking-wider text-[11px] font-sans font-semibold border transition-colors flex-shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:text-black hover:border-neutral-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory('wall-art')}
              className={`px-3 py-1.5 uppercase tracking-wider text-[11px] font-sans font-semibold border transition-colors flex-shrink-0 ${
                selectedCategory === 'wall-art'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:text-black hover:border-neutral-400'
              }`}
            >
              Wall Art
            </button>
            <button
              onClick={() => setSelectedCategory('sculptures')}
              className={`px-3 py-1.5 uppercase tracking-wider text-[11px] font-sans font-semibold border transition-colors flex-shrink-0 ${
                selectedCategory === 'sculptures'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:text-black hover:border-neutral-400'
              }`}
            >
              Sculptures
            </button>
            <button
              onClick={() => setSelectedCategory('decorative-pieces')}
              className={`px-3 py-1.5 uppercase tracking-wider text-[11px] font-sans font-semibold border transition-colors flex-shrink-0 ${
                selectedCategory === 'decorative-pieces'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:text-black hover:border-neutral-400'
              }`}
            >
              Decorative Pieces
            </button>
          </div>

          {/* Right: Search & Sort Dropdown (Desktop) */}
          <div className="hidden sm:flex items-center gap-3 w-auto justify-end">
            <div className="relative w-56">
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
              <span className="text-[11px] font-sans text-neutral-500 uppercase tracking-wider">
                Sort:
              </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-white border border-neutral-200 px-2.5 py-1.5 text-xs font-sans text-neutral-900 outline-none focus:border-black cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Compact Sticky Bar (FILTER | SORT) */}
        <div className="sm:hidden grid grid-cols-2 border-t border-neutral-200 mt-2 bg-white">
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="py-2.5 px-4 text-xs font-sans font-bold uppercase tracking-wider text-black flex items-center justify-center gap-2 border-r border-neutral-200 active:bg-neutral-100"
          >
            <SlidersHorizontal size={13} />
            <span>Filter {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
          </button>
          <button
            onClick={() => setSortModalOpen(true)}
            className="py-2.5 px-4 text-xs font-sans font-bold uppercase tracking-wider text-black flex items-center justify-center gap-2 active:bg-neutral-100"
          >
            <ArrowUpDown size={13} />
            <span className="truncate">Sort: {currentSortLabel}</span>
          </button>
        </div>

        {/* Active Filter Chips Row */}
        {activeFiltersCount > 0 && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap items-center gap-2 pt-2.5">
            <span className="text-[11px] font-sans text-neutral-500 uppercase tracking-wider">Filters:</span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-300 text-black text-xs font-sans">
                <span>Category: {getCategoryLabel(selectedCategory as MajorCategory)}</span>
                <button onClick={() => setSelectedCategory('all')} className="text-neutral-500 hover:text-black" aria-label="Remove category filter">
                  <X size={11} />
                </button>
              </span>
            )}

            {selectedStyle !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-300 text-black text-xs font-sans capitalize">
                <span>Style: {selectedStyle}</span>
                <button onClick={() => setSelectedStyle('all')} className="text-neutral-500 hover:text-black" aria-label="Remove style filter">
                  <X size={11} />
                </button>
              </span>
            )}

            {availabilityFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-300 text-black text-xs font-sans">
                <span>In Stock Only</span>
                <button onClick={() => setAvailabilityFilter('all')} className="text-neutral-500 hover:text-black" aria-label="Remove availability filter">
                  <X size={11} />
                </button>
              </span>
            )}

            {selectedOrientation !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-300 text-black text-xs font-sans capitalize">
                <span>{selectedOrientation}</span>
                <button onClick={() => setSelectedOrientation('all')} className="text-neutral-500 hover:text-black" aria-label="Remove orientation filter">
                  <X size={11} />
                </button>
              </span>
            )}

            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-300 text-black text-xs font-sans">
                <span>Price: {priceRange.replace('-', ' to ')}</span>
                <button onClick={() => setPriceRange('all')} className="text-neutral-500 hover:text-black" aria-label="Remove price filter">
                  <X size={11} />
                </button>
              </span>
            )}

            {specialFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-300 text-black text-xs font-sans capitalize">
                <span>{specialFilter.replace('-', ' ')}</span>
                <button onClick={() => setSpecialFilter('all')} className="text-neutral-500 hover:text-black" aria-label="Remove filter">
                  <X size={11} />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-300 text-black text-xs font-sans">
                <span>&ldquo;{searchQuery}&rdquo;</span>
                <button onClick={() => setSearchQuery('')} className="text-neutral-500 hover:text-black" aria-label="Clear search query">
                  <X size={11} />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs font-sans font-bold uppercase tracking-wider text-black underline underline-offset-4 hover:text-neutral-600 ml-2"
            >
              CLEAR ALL
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
                onQuickView={setQuickViewArtwork}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-neutral-200 p-8 max-w-xl mx-auto">
            <h3 className="font-sans font-bold text-xl uppercase tracking-tight text-black mb-2">
              No Products Found
            </h3>
            <p className="text-xs text-neutral-500 font-sans max-w-sm mx-auto mb-6 leading-relaxed">
              We couldn&apos;t find anything matching your selected filters. Try broadening your criteria.
            </p>
            <button
              onClick={clearAllFilters}
              className="inline-block bg-black text-white px-8 py-3 text-xs font-sans font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Recently Viewed Section */}
        <RecentlyViewed maxItems={4} />
      </main>

      {/* ── 4. QUICK VIEW MODAL ────────────────────────────────────────── */}
      {quickViewArtwork && (
        <ProductQuickView
          artwork={quickViewArtwork}
          onClose={() => setQuickViewArtwork(null)}
        />
      )}

      {/* ── 5. MOBILE SORT MENU (COMPACT BOTTOM SHEET) ──────────────────── */}
      {sortModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:hidden"
          onClick={() => setSortModalOpen(false)}
        >
          <div
            className="w-full bg-white p-5 border-t border-neutral-200 space-y-1 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-neutral-200">
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-neutral-500">
                Sort Products By
              </h3>
              <button
                onClick={() => setSortModalOpen(false)}
                className="text-neutral-500 hover:text-black p-1"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setSortOrder(opt.id);
                  setSortModalOpen(false);
                }}
                className={`w-full text-left py-3 px-3 text-xs font-sans flex items-center justify-between transition-colors ${
                  sortOrder === opt.id
                    ? 'font-bold text-black bg-neutral-100'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>{opt.label}</span>
                {sortOrder === opt.id && <Check size={14} className="text-black" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── 6. COMPREHENSIVE FILTER DRAWER ─────────────────────────────── */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setFilterDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-neutral-200 flex flex-col shadow-2xl">
              {/* Drawer Header */}
              <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h2 className="font-sans font-bold text-base text-black uppercase tracking-tight">
                    Filter Products
                  </h2>
                  <p className="text-xs font-sans text-neutral-500 mt-0.5">
                    {filteredArtworks.length} items found
                  </p>
                </div>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1 text-neutral-500 hover:text-black rounded-full"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Filter Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Availability Filter */}
                <div className="space-y-3">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-900 block">
                    Availability
                  </span>
                  <div className="space-y-2 text-xs font-sans text-neutral-600">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="drawer-avail"
                        checked={availabilityFilter === 'all'}
                        onChange={() => setAvailabilityFilter('all')}
                        className="accent-black"
                      />
                      <span>All Items</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="drawer-avail"
                        checked={availabilityFilter === 'in-stock'}
                        onChange={() => setAvailabilityFilter('in-stock')}
                        className="accent-black"
                      />
                      <span>In Stock Only</span>
                    </label>
                  </div>
                </div>

                {/* Major Categories */}
                <div className="space-y-3 pt-3 border-t border-neutral-100">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-900 block">
                    Category
                  </span>
                  <div className="space-y-2 text-xs font-sans text-neutral-600">
                    {[
                      { id: 'all', label: 'All Categories' },
                      { id: 'wall-art', label: 'Wall Art' },
                      { id: 'sculptures', label: 'Sculptures' },
                      { id: 'decorative-pieces', label: 'Decorative Pieces' },
                    ].map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="drawer-cat"
                          checked={selectedCategory === cat.id}
                          onChange={() => setSelectedCategory(cat.id)}
                          className="accent-black"
                        />
                        <span>{cat.label}</span>
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
                      { id: 'all', label: 'All Prices' },
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

                {/* Special Curations */}
                <div className="space-y-3 pt-3 border-t border-neutral-100">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-900 block">
                    Collection Badges
                  </span>
                  <div className="space-y-2 text-xs font-sans text-neutral-600">
                    {[
                      { id: 'all', label: 'All Items' },
                      { id: 'featured', label: 'Featured Pieces' },
                      { id: 'limited-editions', label: 'Numbered Editions' },
                      { id: 'bestsellers', label: 'Best Sellers' },
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

                {/* Orientation (Wall Art) */}
                {(selectedCategory === 'all' || selectedCategory === 'wall-art') && (
                  <div className="space-y-3 pt-3 border-t border-neutral-100">
                    <span className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-900 block">
                      Orientation
                    </span>
                    <div className="space-y-2 text-xs font-sans text-neutral-600">
                      {[
                        { id: 'all', label: 'All Orientations' },
                        { id: 'vertical', label: 'Vertical / Portrait' },
                        { id: 'horizontal', label: 'Horizontal / Landscape' },
                        { id: 'square', label: 'Square' },
                      ].map((ori) => (
                        <label key={ori.id} className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="radio"
                            name="drawer-ori"
                            checked={selectedOrientation === ori.id}
                            onChange={() => setSelectedOrientation(ori.id)}
                            className="accent-black"
                          />
                          <span>{ori.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                {/* Style / Aesthetic */}
                <div className="space-y-3 pt-3 border-t border-neutral-100">
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-900 block">
                    Style &amp; Aesthetic
                  </span>
                  <div className="space-y-2 text-xs font-sans text-neutral-600">
                    {[
                      { id: 'all', label: 'All Styles' },
                      { id: 'minimalist', label: 'Minimalist & Zen' },
                      { id: 'abstract', label: 'Atmospheric Abstract' },
                      { id: 'architectural', label: 'Architectural & Heritage' },
                      { id: 'contemporary', label: 'Modern Contemporary' },
                      { id: 'earthy', label: 'Earthy & Organic' },
                    ].map((st) => (
                      <label key={st.id} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="drawer-style"
                          checked={selectedStyle === st.id}
                          onChange={() => setSelectedStyle(st.id)}
                          className="accent-black"
                        />
                        <span>{st.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-5 border-t border-neutral-200 bg-neutral-50 flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="w-1/2 border border-neutral-300 py-3 text-xs font-sans font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="w-1/2 bg-[#0F0F0F] text-white py-3 text-xs font-sans font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  Apply ({filteredArtworks.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Find Your Piece Guided Discovery Modal */}
      <FindYourPieceModal
        isOpen={findPieceOpen}
        onClose={() => setFindPieceOpen(false)}
      />
    </div>
  );
}
