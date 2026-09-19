'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ARTWORKS,
  normalizeCategory,
  getArtworkCategory,
  getCategoryLabel,
} from '@/lib/artCatalog';
import { ArtworkProduct } from '@/types/art';
import ArtworkCard from '@/components/ArtworkCard';
import ProductQuickView from '@/components/ProductQuickView';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Search,
} from 'lucide-react';

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL state
  const initialCategory = searchParams.get('category') || 'all';
  const initialFilter = searchParams.get('filter') || 'all';
  const initialRoom = searchParams.get('room') || 'all';
  const initialMood = searchParams.get('mood') || 'all';
  const initialMaxPrice = searchParams.get('maxPrice') || '';

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedRoom, setSelectedRoom] = useState(initialRoom);
  const [selectedMood, setSelectedMood] = useState(initialMood);
  const [selectedOrientation, setSelectedOrientation] = useState('all');
  const [priceRange, setPriceRange] = useState<string>(initialMaxPrice ? `under-${initialMaxPrice}` : 'all');
  const [specialFilter, setSpecialFilter] = useState(initialFilter);
  const [sortOrder, setSortOrder] = useState('recommended');
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewArtwork, setQuickViewArtwork] = useState<ArtworkProduct | null>(null);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    category: true,
    artist: true,
    price: true,
    special: true,
    room: false,
    mood: false,
    orientation: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedRoom('all');
    setSelectedMood('all');
    setSelectedOrientation('all');
    setPriceRange('all');
    setSpecialFilter('all');
    setSearchQuery('');
    router.replace('/products', { scroll: false });
  };

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedRoom !== 'all') count++;
    if (selectedMood !== 'all') count++;
    if (selectedOrientation !== 'all') count++;
    if (priceRange !== 'all') count++;
    if (specialFilter !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [
    selectedCategory,
    selectedRoom,
    selectedMood,
    selectedOrientation,
    priceRange,
    specialFilter,
    searchQuery,
  ]);

  // Filter and sort products
  const filteredArtworks = useMemo(() => {
    let list = [...ARTWORKS];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.artistName.toLowerCase().includes(q) ||
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
    if (specialFilter === 'one-of-one' || specialFilter === 'hand-painted') {
      list = list.filter((a) => a.isOneOfOne || a.isHandPainted);
    } else if (specialFilter === 'limited-editions') {
      list = list.filter((a) => a.isLimitedEdition);
    } else if (specialFilter === 'new') {
      list = list.filter((a) => a.isNew);
    } else if (specialFilter === 'bestsellers') {
      list = list.filter((a) => a.isBestseller);
    }

    // Room
    if (selectedRoom !== 'all') {
      list = list.filter((a) => a.roomTags.includes(selectedRoom));
    }

    // Mood
    if (selectedMood !== 'all') {
      list = list.filter((a) => a.moodTags.includes(selectedMood));
    }

    // Orientation
    if (selectedOrientation !== 'all') {
      list = list.filter((a) => a.orientation === selectedOrientation);
    }

    // Price
    if (priceRange === 'under-2500') {
      list = list.filter((a) => a.price <= 2500);
    } else if (priceRange === 'under-5000') {
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
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortOrder === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [
    selectedCategory,
    selectedRoom,
    selectedMood,
    selectedOrientation,
    priceRange,
    specialFilter,
    sortOrder,
    searchQuery,
  ]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-8 border-b border-[#E4DBCF] gap-6">
        <div>
          <span className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#B08A4A] uppercase block mb-2">
            The Permanent &amp; Consigned Collection
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-normal text-[#11100F] tracking-tight">
            Curated Catalog
          </h1>
        </div>

        {/* Search Input & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artist, title, medium..."
              className="w-full bg-[#FAF7F2] border border-[#E4DBCF] pl-9 pr-4 py-2.5 text-xs text-[#11100F] placeholder-[#78716C] outline-none focus:border-[#11100F] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#11100F]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden bg-[#11100F] text-[#F4EFE7] px-4 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-2"
          >
            <SlidersHorizontal size={14} />
            <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
          </button>
        </div>
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ── Left Desktop Filter Sidebar (Accordion Style) ──────────── */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E4DBCF]">
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-[#11100F]">
              Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
            </span>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[10px] font-sans font-semibold text-[#481E25] hover:underline flex items-center gap-1 uppercase tracking-wider"
              >
                <RotateCcw size={11} />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Accordion: Category */}
          <div className="border-b border-[#E4DBCF] pb-4">
            <button
              onClick={() => toggleAccordion('category')}
              className="w-full flex items-center justify-between py-1 text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F]"
            >
              <span>Category</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${openAccordions.category ? 'rotate-180' : ''}`}
              />
            </button>
            {openAccordions.category && (
              <div className="pt-3 space-y-2 text-xs font-sans text-[#78716C]">
                {[
                  { id: 'all', label: 'All Pieces' },
                  { id: 'wall-art', label: 'Wall Art' },
                  { id: 'sculptures', label: 'Sculptures' },
                  { id: 'decorative-pieces', label: 'Decorative Pieces' },
                ].map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2.5 cursor-pointer hover:text-[#11100F] transition-colors"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={
                        c.id === 'all'
                          ? selectedCategory === 'all'
                          : normalizeCategory(selectedCategory) === c.id
                      }
                      onChange={() => setSelectedCategory(c.id)}
                      className="accent-[#11100F]"
                    />
                    <span
                      className={
                        (c.id === 'all' && selectedCategory === 'all') ||
                        normalizeCategory(selectedCategory) === c.id
                          ? 'text-[#11100F] font-semibold'
                          : ''
                      }
                    >
                      {c.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Accordion: Special Editions */}
          <div className="border-b border-[#E4DBCF] pb-4">
            <button
              onClick={() => toggleAccordion('special')}
              className="w-full flex items-center justify-between py-1 text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F]"
            >
              <span>Edition Type</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${openAccordions.special ? 'rotate-180' : ''}`}
              />
            </button>
            {openAccordions.special && (
              <div className="pt-3 space-y-2 text-xs font-sans text-[#78716C]">
                {[
                  { id: 'all', label: 'All Editions' },
                  { id: 'one-of-one', label: 'One of One (1/1 Original)' },
                  { id: 'limited-editions', label: 'Numbered Limited Edition' },
                  { id: 'new', label: 'New Works' },
                  { id: 'bestsellers', label: 'Bestselling Curations' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2.5 cursor-pointer hover:text-[#11100F]"
                  >
                    <input
                      type="radio"
                      name="special"
                      checked={specialFilter === item.id}
                      onChange={() => setSpecialFilter(item.id)}
                      className="accent-[#11100F]"
                    />
                    <span className={specialFilter === item.id ? 'text-[#11100F] font-semibold' : ''}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Accordion: Price Range */}
          <div className="border-b border-[#E4DBCF] pb-4">
            <button
              onClick={() => toggleAccordion('price')}
              className="w-full flex items-center justify-between py-1 text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F]"
            >
              <span>Price in INR</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${openAccordions.price ? 'rotate-180' : ''}`}
              />
            </button>
            {openAccordions.price && (
              <div className="pt-3 space-y-2 text-xs font-sans text-[#78716C]">
                {[
                  { id: 'all', label: 'All Values' },
                  { id: 'under-2500', label: 'Under ₹2,500' },
                  { id: 'under-5000', label: 'Under ₹5,000' },
                  { id: '5000-15000', label: '₹5,000 — ₹15,000' },
                  { id: '15000-30000', label: '₹15,000 — ₹30,000' },
                  { id: 'above-30000', label: 'Above ₹30,000' },
                ].map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-2.5 cursor-pointer hover:text-[#11100F]"
                  >
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === p.id}
                      onChange={() => setPriceRange(p.id)}
                      className="accent-[#11100F]"
                    />
                    <span className={priceRange === p.id ? 'text-[#11100F] font-semibold' : ''}>
                      {p.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Accordion: Orientation */}
          <div className="border-b border-[#E4DBCF] pb-4">
            <button
              onClick={() => toggleAccordion('orientation')}
              className="w-full flex items-center justify-between py-1 text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F]"
            >
              <span>Orientation</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${openAccordions.orientation ? 'rotate-180' : ''}`}
              />
            </button>
            {openAccordions.orientation && (
              <div className="pt-3 space-y-2 text-xs font-sans text-[#78716C]">
                {[
                  { id: 'all', label: 'Any Orientation' },
                  { id: 'vertical', label: 'Vertical / Portrait' },
                  { id: 'horizontal', label: 'Horizontal / Landscape' },
                  { id: 'square', label: 'Square' },
                ].map((o) => (
                  <label
                    key={o.id}
                    className="flex items-center gap-2.5 cursor-pointer hover:text-[#11100F]"
                  >
                    <input
                      type="radio"
                      name="orientation"
                      checked={selectedOrientation === o.id}
                      onChange={() => setSelectedOrientation(o.id)}
                      className="accent-[#11100F]"
                    />
                    <span className={selectedOrientation === o.id ? 'text-[#11100F] font-semibold' : ''}>
                      {o.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* ── Right Content: Toolbar, Chips & Grid ───────────────────── */}
        <main className="lg:col-span-9">
          {/* Controls Bar: Count & Sort Order */}
          <div className="flex flex-wrap items-center justify-between pb-4 mb-4 gap-4">
            <p className="text-xs font-sans text-[#78716C]">
              Showing <span className="font-semibold text-[#11100F]">{filteredArtworks.length}</span> curated works
            </p>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-sans text-[#78716C] uppercase tracking-wider">
                Sort:
              </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-[#FAF7F2] border border-[#E4DBCF] text-xs font-sans py-2 px-3 text-[#11100F] outline-none focus:border-[#11100F] cursor-pointer"
              >
                <option value="recommended">Curator&apos;s Choice</option>
                <option value="newest">Newest Additions</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-[#FAF7F2] border border-[#E4DBCF] px-2.5 py-1 text-[11px] font-sans text-[#11100F] flex items-center gap-1.5 hover:border-[#481E25]"
                >
                  <span>Category: {getCategoryLabel(selectedCategory)}</span>
                  <X size={11} />
                </button>
              )}
              {priceRange !== 'all' && (
                <button
                  onClick={() => setPriceRange('all')}
                  className="bg-[#FAF7F2] border border-[#E4DBCF] px-2.5 py-1 text-[11px] font-sans text-[#11100F] flex items-center gap-1.5 hover:border-[#481E25]"
                >
                  <span>Price: {priceRange}</span>
                  <X size={11} />
                </button>
              )}
              {specialFilter !== 'all' && (
                <button
                  onClick={() => setSpecialFilter('all')}
                  className="bg-[#FAF7F2] border border-[#E4DBCF] px-2.5 py-1 text-[11px] font-sans text-[#11100F] flex items-center gap-1.5 hover:border-[#481E25]"
                >
                  <span>{specialFilter}</span>
                  <X size={11} />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-[#FAF7F2] border border-[#E4DBCF] px-2.5 py-1 text-[11px] font-sans text-[#11100F] flex items-center gap-1.5 hover:border-[#481E25]"
                >
                  <span>&ldquo;{searchQuery}&rdquo;</span>
                  <X size={11} />
                </button>
              )}
              <button
                onClick={clearAllFilters}
                className="text-[10px] text-[#481E25] font-semibold hover:underline uppercase tracking-wider ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Artworks Grid */}
          {filteredArtworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtworks.map((artwork) => (
                <ArtworkCard
                  key={artwork.id}
                  artwork={artwork}
                  onQuickView={(a) => setQuickViewArtwork(a)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-24 text-center border border-[#E4DBCF] bg-[#FAF7F2] p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E4DBCF] flex items-center justify-center text-[#B08A4A]">
                <span className="font-serif text-2xl italic">✦</span>
              </div>
              <h3 className="font-serif text-2xl text-[#11100F] mb-2">
                No matching artworks found
              </h3>
              <p className="text-xs font-sans text-[#78716C] max-w-sm mx-auto mb-6">
                Try adjusting your filter criteria or explore our curated collections.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-[#11100F] text-[#F4EFE7] px-6 py-3 text-xs font-sans font-semibold uppercase tracking-widest hover:bg-[#481E25] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Quick View Modal */}
      <ProductQuickView
        artwork={quickViewArtwork}
        onClose={() => setQuickViewArtwork(null)}
      />

      {/* ── Mobile Filter Bottom Sheet Drawer ─────────────────────────── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-[#11100F]/60 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-[#F4EFE7] border-l border-[#E4DBCF] flex flex-col shadow-2xl">
              <div className="p-6 border-b border-[#E4DBCF] flex items-center justify-between">
                <span className="font-serif text-xl font-normal text-[#11100F]">
                  Filter Artworks
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#78716C]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Mobile Categories */}
                <div>
                  <h4 className="text-xs font-sans font-semibold uppercase tracking-wider mb-2">
                    Category
                  </h4>
                  <div className="space-y-1.5 text-xs text-[#78716C]">
                    {[
                      { id: 'all', label: 'All Pieces' },
                      { id: 'wall-art', label: 'Wall Art' },
                      { id: 'sculptures', label: 'Sculptures' },
                      { id: 'decorative-pieces', label: 'Decorative Pieces' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCategory(c.id)}
                        className={`block w-full text-left py-1.5 ${
                          (c.id === 'all' && selectedCategory === 'all') ||
                          normalizeCategory(selectedCategory) === c.id
                            ? 'font-semibold text-[#11100F]'
                            : ''
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Price */}
                <div>
                  <h4 className="text-xs font-sans font-semibold uppercase tracking-wider mb-2">
                    Price Range
                  </h4>
                  <div className="space-y-1.5 text-xs text-[#78716C]">
                    {[
                      { id: 'all', label: 'All Prices' },
                      { id: 'under-2500', label: 'Under ₹2,500' },
                      { id: 'under-5000', label: 'Under ₹5,000' },
                      { id: '5000-15000', label: '₹5,000 — ₹15,000' },
                      { id: 'above-30000', label: 'Above ₹30,000' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPriceRange(p.id)}
                        className={`block w-full text-left py-1.5 ${
                          priceRange === p.id ? 'font-semibold text-[#11100F]' : ''
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#E4DBCF] bg-[#FAF7F2] space-y-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-[#11100F] text-[#F4EFE7] py-3 text-xs font-semibold uppercase tracking-widest"
                >
                  Apply Filters ({filteredArtworks.length})
                </button>
                <button
                  onClick={clearAllFilters}
                  className="w-full text-center text-xs text-[#78716C] py-2"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
