'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ARTWORKS,
  getArtworkCategory,
  MajorCategory,
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
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

interface CategoryPageClientProps {
  category: MajorCategory;
  title: string;
  subtitle: string;
  description: string;
}

export default function CategoryPageClient({
  category,
  title,
  subtitle,
  description,
}: CategoryPageClientProps) {
  // Base artworks belonging to this category
  const baseCategoryArtworks = useMemo(() => {
    return ARTWORKS.filter((a) => getArtworkCategory(a) === category);
  }, [category]);

  // Filter states
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedOrientation, setSelectedOrientation] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [specialFilter, setSpecialFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('recommended');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mobile drawer state & quick view
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewArtwork, setQuickViewArtwork] = useState<ArtworkProduct | null>(null);

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    subcategory: true,
    price: true,
    special: true,
    orientation: true,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearAllFilters = () => {
    setSelectedSubcategory('all');
    setSelectedOrientation('all');
    setPriceRange('all');
    setSpecialFilter('all');
    setSearchQuery('');
  };

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedSubcategory !== 'all') count++;
    if (selectedOrientation !== 'all') count++;
    if (priceRange !== 'all') count++;
    if (specialFilter !== 'all') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [selectedSubcategory, selectedOrientation, priceRange, specialFilter, searchQuery]);

  // Extract distinct subcategories present in this category
  const availableSubcategories = useMemo(() => {
    const subs = new Set<string>();
    baseCategoryArtworks.forEach((a) => {
      if (a.subcategory) subs.add(a.subcategory);
    });
    return Array.from(subs);
  }, [baseCategoryArtworks]);

  // Filter & Sort
  const filteredArtworks = useMemo(() => {
    let list = [...baseCategoryArtworks];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.artistName.toLowerCase().includes(q) ||
          a.medium.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.styleTags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Subcategory
    if (selectedSubcategory !== 'all') {
      list = list.filter((a) => a.subcategory === selectedSubcategory);
    }

    // Orientation (relevant especially for wall art)
    if (selectedOrientation !== 'all') {
      list = list.filter((a) => a.orientation === selectedOrientation);
    }

    // Special edition / badge filters
    if (specialFilter === 'one-of-one') {
      list = list.filter((a) => a.isOneOfOne);
    } else if (specialFilter === 'limited-editions') {
      list = list.filter((a) => a.isLimitedEdition);
    } else if (specialFilter === 'bestsellers') {
      list = list.filter((a) => a.isBestseller);
    } else if (specialFilter === 'new') {
      list = list.filter((a) => a.isNew);
    }

    // Price range
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
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortOrder === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [
    baseCategoryArtworks,
    searchQuery,
    selectedSubcategory,
    selectedOrientation,
    specialFilter,
    priceRange,
    sortOrder,
  ]);

  const formatSubcategoryLabel = (sub: string) => {
    return sub
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-[#F4EFE7] min-h-screen text-[#11100F]">
      {/* ── 1. CATEGORY EDITORIAL HERO ────────────────────────────────── */}
      <section className="border-b border-[#E4DBCF] bg-[#FAF7F2]/60 pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-sans text-[#78716C] mb-6">
            <Link href="/" className="hover:text-[#11100F] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-[#11100F] font-medium">{title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E4DBCF]/80 border border-[#D6CDBF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B08A4A]" />
                <span className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-[#11100F]">
                  Curated Category
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#11100F] tracking-tight leading-[1.08]">
                {title}
              </h1>

              <p className="font-serif text-lg md:text-xl text-[#481E25] italic max-w-2xl leading-relaxed">
                &ldquo;{description}&rdquo;
              </p>

              <p className="text-xs md:text-sm font-sans text-[#78716C] max-w-xl leading-relaxed">
                {subtitle} Every work is created in the atelier with archival materials, accompanied by a signed Certificate of Authenticity, and delivered in custom protective crates.
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="bg-[#FAF7F2] border border-[#E4DBCF] p-5 md:p-6 w-full max-w-xs space-y-2">
                <span className="text-[10px] font-sans font-semibold tracking-[0.2em] text-[#B08A4A] uppercase block">
                  Collection Status
                </span>
                <p className="font-serif text-3xl font-medium text-[#11100F]">
                  {baseCategoryArtworks.length}{' '}
                  <span className="text-sm font-sans font-normal text-[#78716C]">
                    Pieces in Collection
                  </span>
                </p>
                <div className="pt-2 border-t border-[#E4DBCF] text-[11px] font-sans text-[#78716C]">
                  Insured white-glove art delivery pan-India
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. CONTROLS & FILTER BAR ──────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4DBCF]">
          {/* Search within category */}
          <div className="relative w-full md:w-80">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${title.toLowerCase()}...`}
              className="w-full bg-[#FAF7F2] border border-[#E4DBCF] pl-9 pr-8 py-2.5 text-xs text-[#11100F] placeholder-[#78716C] outline-none focus:border-[#11100F] transition-colors"
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

          {/* Quick Subcategory Pills on Desktop */}
          {availableSubcategories.length > 1 && (
            <div className="hidden xl:flex items-center gap-2 overflow-x-auto text-xs font-sans">
              <button
                onClick={() => setSelectedSubcategory('all')}
                className={`px-3 py-1.5 uppercase tracking-wider text-[11px] border transition-colors ${
                  selectedSubcategory === 'all'
                    ? 'bg-[#11100F] text-[#F4EFE7] border-[#11100F]'
                    : 'bg-[#FAF7F2] text-[#78716C] border-[#E4DBCF] hover:text-[#11100F]'
                }`}
              >
                All {title}
              </button>
              {availableSubcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`px-3 py-1.5 uppercase tracking-wider text-[11px] border transition-colors ${
                    selectedSubcategory === sub
                      ? 'bg-[#11100F] text-[#F4EFE7] border-[#11100F]'
                      : 'bg-[#FAF7F2] text-[#78716C] border-[#E4DBCF] hover:text-[#11100F]'
                  }`}
                >
                  {formatSubcategoryLabel(sub)}
                </button>
              ))}
            </div>
          )}

          {/* Sort & Mobile Filter Trigger */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden bg-[#11100F] text-[#F4EFE7] px-4 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <SlidersHorizontal size={14} />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-sans text-[#78716C] hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-[#FAF7F2] border border-[#E4DBCF] px-3 py-2 text-xs font-sans text-[#11100F] outline-none focus:border-[#11100F] transition-colors cursor-pointer"
              >
                <option value="recommended">Curated / Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Releases</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-xs font-sans text-[#78716C]">Active Filters:</span>
            {selectedSubcategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E4DBCF] text-[#11100F] text-xs font-sans">
                <span>{formatSubcategoryLabel(selectedSubcategory)}</span>
                <button
                  onClick={() => setSelectedSubcategory('all')}
                  className="hover:text-[#481E25]"
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {selectedOrientation !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E4DBCF] text-[#11100F] text-xs font-sans capitalize">
                <span>Orientation: {selectedOrientation}</span>
                <button
                  onClick={() => setSelectedOrientation('all')}
                  className="hover:text-[#481E25]"
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E4DBCF] text-[#11100F] text-xs font-sans">
                <span>Price: {priceRange.replace('-', ' to ')}</span>
                <button
                  onClick={() => setPriceRange('all')}
                  className="hover:text-[#481E25]"
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {specialFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E4DBCF] text-[#11100F] text-xs font-sans capitalize">
                <span>{specialFilter.replace('-', ' ')}</span>
                <button
                  onClick={() => setSpecialFilter('all')}
                  className="hover:text-[#481E25]"
                >
                  <X size={11} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E4DBCF] text-[#11100F] text-xs font-sans">
                <span>&ldquo;{searchQuery}&rdquo;</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-[#481E25]">
                  <X size={11} />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-sans text-[#481E25] hover:underline ml-2"
            >
              Reset All
            </button>
          </div>
        )}

        {/* ── 3. MAIN PRODUCT GRID WITH SIDEBAR ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4DBCF]">
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-[#11100F]">
                Refine {title}
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

            {/* Accordion: Subcategory */}
            {availableSubcategories.length > 0 && (
              <div className="border-b border-[#E4DBCF] pb-4">
                <button
                  onClick={() => toggleAccordion('subcategory')}
                  className="w-full flex items-center justify-between py-1 text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F]"
                >
                  <span>Subcategory</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${openAccordions.subcategory ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordions.subcategory && (
                  <div className="pt-3 space-y-2 text-xs font-sans text-[#78716C]">
                    <label className="flex items-center gap-2.5 cursor-pointer hover:text-[#11100F] transition-colors">
                      <input
                        type="radio"
                        name="subcategory"
                        checked={selectedSubcategory === 'all'}
                        onChange={() => setSelectedSubcategory('all')}
                        className="accent-[#11100F]"
                      />
                      <span>All Subcategories ({baseCategoryArtworks.length})</span>
                    </label>
                    {availableSubcategories.map((sub) => {
                      const count = baseCategoryArtworks.filter(
                        (a) => a.subcategory === sub
                      ).length;
                      return (
                        <label
                          key={sub}
                          className="flex items-center gap-2.5 cursor-pointer hover:text-[#11100F] transition-colors"
                        >
                          <input
                            type="radio"
                            name="subcategory"
                            checked={selectedSubcategory === sub}
                            onChange={() => setSelectedSubcategory(sub)}
                            className="accent-[#11100F]"
                          />
                          <span>
                            {formatSubcategoryLabel(sub)} ({count})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Accordion: Orientation (for Wall Art) */}
            {category === 'wall-art' && (
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
                      { id: 'all', label: 'All Orientations' },
                      { id: 'vertical', label: 'Vertical / Portrait' },
                      { id: 'horizontal', label: 'Horizontal / Landscape' },
                      { id: 'square', label: 'Square' },
                    ].map((ori) => (
                      <label
                        key={ori.id}
                        className="flex items-center gap-2.5 cursor-pointer hover:text-[#11100F] transition-colors"
                      >
                        <input
                          type="radio"
                          name="orientation"
                          checked={selectedOrientation === ori.id}
                          onChange={() => setSelectedOrientation(ori.id)}
                          className="accent-[#11100F]"
                        />
                        <span>{ori.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Accordion: Price */}
            <div className="border-b border-[#E4DBCF] pb-4">
              <button
                onClick={() => toggleAccordion('price')}
                className="w-full flex items-center justify-between py-1 text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F]"
              >
                <span>Price (INR)</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${openAccordions.price ? 'rotate-180' : ''}`}
                />
              </button>
              {openAccordions.price && (
                <div className="pt-3 space-y-2 text-xs font-sans text-[#78716C]">
                  {[
                    { id: 'all', label: 'All Price Tiers' },
                    { id: 'under-5000', label: 'Under ₹5,000' },
                    { id: '5000-15000', label: '₹5,000 – ₹15,000' },
                    { id: '15000-30000', label: '₹15,000 – ₹30,000' },
                    { id: 'above-30000', label: 'Above ₹30,000' },
                  ].map((tier) => (
                    <label
                      key={tier.id}
                      className="flex items-center gap-2.5 cursor-pointer hover:text-[#11100F] transition-colors"
                    >
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange === tier.id}
                        onChange={() => setPriceRange(tier.id)}
                        className="accent-[#11100F]"
                      />
                      <span>{tier.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion: Special Collections */}
            <div className="border-b border-[#E4DBCF] pb-4">
              <button
                onClick={() => toggleAccordion('special')}
                className="w-full flex items-center justify-between py-1 text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F]"
              >
                <span>Acquisition Type</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${openAccordions.special ? 'rotate-180' : ''}`}
                />
              </button>
              {openAccordions.special && (
                <div className="pt-3 space-y-2 text-xs font-sans text-[#78716C]">
                  {[
                    { id: 'all', label: 'All Works' },
                    { id: 'one-of-one', label: 'One of One Originals' },
                    { id: 'limited-editions', label: 'Limited Editions' },
                    { id: 'bestsellers', label: 'Best Sellers' },
                    { id: 'new', label: 'New Releases' },
                  ].map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center gap-2.5 cursor-pointer hover:text-[#11100F] transition-colors"
                    >
                      <input
                        type="radio"
                        name="special"
                        checked={specialFilter === s.id}
                        onChange={() => setSpecialFilter(s.id)}
                        className="accent-[#11100F]"
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Category Navigation Links */}
            <div className="pt-4 space-y-2">
              <span className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[#78716C] block mb-2">
                Other Collections
              </span>
              {category !== 'wall-art' && (
                <Link
                  href="/wall-art"
                  className="text-xs font-sans text-[#78716C] hover:text-[#11100F] flex items-center justify-between py-1.5 transition-colors"
                >
                  <span>Explore Wall Art</span>
                  <ArrowRight size={12} />
                </Link>
              )}
              {category !== 'sculptures' && (
                <Link
                  href="/sculptures"
                  className="text-xs font-sans text-[#78716C] hover:text-[#11100F] flex items-center justify-between py-1.5 transition-colors"
                >
                  <span>Explore Sculptures</span>
                  <ArrowRight size={12} />
                </Link>
              )}
              {category !== 'decorative-pieces' && (
                <Link
                  href="/decorative-pieces"
                  className="text-xs font-sans text-[#78716C] hover:text-[#11100F] flex items-center justify-between py-1.5 transition-colors"
                >
                  <span>Explore Decorative Pieces</span>
                  <ArrowRight size={12} />
                </Link>
              )}
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-sans text-[#78716C]">
                Showing <span className="font-semibold text-[#11100F]">{filteredArtworks.length}</span>{' '}
                {filteredArtworks.length === 1 ? 'piece' : 'pieces'}
              </p>
            </div>

            {filteredArtworks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredArtworks.map((art, index) => (
                  <ArtworkCard
                    key={art.id}
                    artwork={art}
                    priority={index < 3}
                    onQuickView={(a) => setQuickViewArtwork(a)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 px-4 bg-[#FAF7F2] border border-[#E4DBCF]">
                <p className="font-serif text-2xl text-[#11100F] mb-2">
                  No artworks found in {title}
                </p>
                <p className="text-xs font-sans text-[#78716C] max-w-md mx-auto mb-6">
                  No pieces matched your selected filters or search query. Try broadening your criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-[#11100F] text-[#F4EFE7] px-6 py-3 text-xs font-sans font-semibold uppercase tracking-wider hover:bg-[#481E25] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── 4. MOBILE FILTER DRAWER ───────────────────────────────────── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-[#11100F]/60 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-[#F4EFE7] flex flex-col shadow-2xl">
              <div className="p-6 border-b border-[#E4DBCF] flex items-center justify-between">
                <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-[#11100F]">
                  Filter {title}
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-[#78716C] hover:text-[#11100F]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Mobile Subcategories */}
                {availableSubcategories.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] block">
                      Subcategory
                    </span>
                    <div className="space-y-2 text-xs font-sans text-[#78716C]">
                      <label className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="m-subcategory"
                          checked={selectedSubcategory === 'all'}
                          onChange={() => setSelectedSubcategory('all')}
                        />
                        <span>All Subcategories</span>
                      </label>
                      {availableSubcategories.map((sub) => (
                        <label key={sub} className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="m-subcategory"
                            checked={selectedSubcategory === sub}
                            onChange={() => setSelectedSubcategory(sub)}
                          />
                          <span>{formatSubcategoryLabel(sub)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile Price */}
                <div className="space-y-3">
                  <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] block">
                    Price Range
                  </span>
                  <div className="space-y-2 text-xs font-sans text-[#78716C]">
                    {[
                      { id: 'all', label: 'All Prices' },
                      { id: 'under-5000', label: 'Under ₹5,000' },
                      { id: '5000-15000', label: '₹5,000 – ₹15,000' },
                      { id: '15000-30000', label: '₹15,000 – ₹30,000' },
                      { id: 'above-30000', label: 'Above ₹30,000' },
                    ].map((tier) => (
                      <label key={tier.id} className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="m-price"
                          checked={priceRange === tier.id}
                          onChange={() => setPriceRange(tier.id)}
                        />
                        <span>{tier.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mobile Special */}
                <div className="space-y-3">
                  <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#11100F] block">
                    Special Collections
                  </span>
                  <div className="space-y-2 text-xs font-sans text-[#78716C]">
                    {[
                      { id: 'all', label: 'All Works' },
                      { id: 'one-of-one', label: 'One of One Originals' },
                      { id: 'limited-editions', label: 'Limited Editions' },
                      { id: 'bestsellers', label: 'Best Sellers' },
                      { id: 'new', label: 'New Releases' },
                    ].map((s) => (
                      <label key={s.id} className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="m-special"
                          checked={specialFilter === s.id}
                          onChange={() => setSpecialFilter(s.id)}
                        />
                        <span>{s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#E4DBCF] bg-[#FAF7F2] flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="w-1/2 border border-[#11100F] py-2.5 text-xs font-semibold uppercase tracking-wider"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-1/2 bg-[#11100F] text-[#F4EFE7] py-2.5 text-xs font-semibold uppercase tracking-wider"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <ProductQuickView
        artwork={quickViewArtwork}
        onClose={() => setQuickViewArtwork(null)}
      />
    </div>
  );
}
