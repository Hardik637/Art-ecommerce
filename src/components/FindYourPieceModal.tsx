'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, Compass } from 'lucide-react';
import { ARTWORKS, getArtworkCategory, normalizeCategory } from '@/lib/artCatalog';

interface FindYourPieceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryOption {
  id: string;
  label: string;
  subtitle: string;
  badge: string;
}

interface StyleOption {
  id: string;
  label: string;
  subtitle: string;
}

interface BudgetOption {
  id: string;
  label: string;
  subtitle: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'wall-art',
    label: 'Wall Art',
    subtitle: 'Original paintings, fine prints, sketches & stretched canvases',
    badge: '18 Pieces',
  },
  {
    id: 'sculptures',
    label: 'Sculptures',
    subtitle: 'Lost-wax bronze, carved marble, and smoked black terracotta',
    badge: '12 Pieces',
  },
  {
    id: 'decorative-pieces',
    label: 'Decorative Pieces',
    subtitle: 'Architectural vessels, sculptural bowls & tabletop accents',
    badge: '6 Pieces',
  },
];

const STYLES: StyleOption[] = [
  {
    id: 'minimalist',
    label: 'Minimalist & Zen',
    subtitle: 'Restrained palettes, negative space, and tranquil balance',
  },
  {
    id: 'abstract',
    label: 'Atmospheric Abstract',
    subtitle: 'Layered indigo pigments, organic flows, and raw emotional resonance',
  },
  {
    id: 'architectural',
    label: 'Architectural & Heritage',
    subtitle: 'Symmetric arches, neo-durbar geometry, and timeless structure',
  },
  {
    id: 'contemporary',
    label: 'Modern Contemporary',
    subtitle: 'Bold focal points, vibrant interplay, and contemporary scale',
  },
  {
    id: 'earthy',
    label: 'Earthy & Organic',
    subtitle: 'Pit-fired clay, Deccan archaeological textures, and desert tones',
  },
];

const BUDGETS: BudgetOption[] = [
  {
    id: 'under-10000',
    label: 'Under ₹10,000',
    subtitle: 'Accessible original fine art prints, figurines & decorative objects',
  },
  {
    id: '10000-25000',
    label: '₹10,000 – ₹25,000',
    subtitle: 'Mid-scale original canvases and hand-cast studio sculptures',
  },
  {
    id: 'above-25000',
    label: 'Above ₹25,000',
    subtitle: 'Monumental master canvases and museum-cast lost-wax bronzes',
  },
];

export default function FindYourPieceModal({ isOpen, onClose }: FindYourPieceModalProps) {
  const router = useRouter();

  // Wizard state: Step 1 (Category), Step 2 (Style), Step 3 (Budget)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedCategory('all');
      setSelectedStyle('all');
      setSelectedBudget('all');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Compute live matching artworks count
  const matchingArtworks = useMemo(() => {
    return ARTWORKS.filter((art) => {
      // Category check
      if (selectedCategory !== 'all') {
        const cat = getArtworkCategory(art);
        if (cat !== normalizeCategory(selectedCategory)) return false;
      }
      // Style check
      if (selectedStyle !== 'all') {
        const s = selectedStyle.toLowerCase();
        const inTags = (art.styleTags || []).some((t) => t.toLowerCase().includes(s));
        const inMood = (art.moodTags || []).some((m) => m.toLowerCase().includes(s));
        const inMedium = (art.medium || '').toLowerCase().includes(s);
        const inDesc = (art.description || '').toLowerCase().includes(s);
        const inName = (art.name || '').toLowerCase().includes(s);
        if (!inTags && !inMood && !inMedium && !inDesc && !inName) return false;
      }
      // Budget check
      if (selectedBudget === 'under-10000') {
        if (art.price > 10000) return false;
      } else if (selectedBudget === '10000-25000') {
        if (art.price < 10000 || art.price > 25000) return false;
      } else if (selectedBudget === 'above-25000') {
        if (art.price <= 25000) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedStyle, selectedBudget]);

  const handleApplyPicks = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedStyle !== 'all') params.set('style', selectedStyle);
    if (selectedBudget !== 'all') params.set('priceRange', selectedBudget);

    const targetUrl = params.toString() ? `/products?${params.toString()}` : '/products';
    onClose();
    router.push(targetUrl);
  }, [selectedCategory, selectedStyle, selectedBudget, onClose, router]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="find-your-piece-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white border border-neutral-300 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <Compass size={18} className="text-black" />
            <div>
              <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-neutral-500 uppercase block">
                Guided Discovery
              </span>
              <h2
                id="find-your-piece-title"
                className="font-sans text-base font-bold text-black uppercase tracking-tight"
              >
                Find Your Piece
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-black transition-colors"
            aria-label="Close guided finder"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 bg-white border-b border-neutral-100 flex items-center justify-between text-xs font-sans">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
            Step {step} of 3
          </span>
          <div className="flex items-center gap-1.5 w-32 sm:w-44">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 transition-all ${
                  s <= step ? 'bg-black' : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body / Questions */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: CATEGORY */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-neutral-500 uppercase block mb-1">
                  01 Medium &amp; Placement
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-normal text-black uppercase tracking-wide">
                  What are you looking for?
                </h3>
                <p className="text-xs font-sans text-neutral-500 mt-1">
                  Select a category or choose any to explore across all collections.
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left p-4 border transition-all flex items-start justify-between ${
                    selectedCategory === 'all'
                      ? 'border-black bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white hover:border-black text-black'
                  }`}
                >
                  <div>
                    <div className="font-sans text-sm font-bold uppercase tracking-wide">
                      Any Medium (All Products)
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        selectedCategory === 'all' ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                    >
                      Explore across Wall Art, Sculptures, and Decorative Pieces
                    </div>
                  </div>
                  {selectedCategory === 'all' && <Check size={16} className="text-white mt-1" />}
                </button>

                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left p-4 border transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-black bg-neutral-900 text-white shadow-xs'
                          : 'border-neutral-200 bg-white hover:border-black text-black'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-sm font-bold uppercase tracking-wide">
                            {cat.label}
                          </span>
                          <span
                            className={`text-[9px] uppercase px-1.5 py-0.5 font-bold ${
                              isSelected
                                ? 'bg-neutral-800 text-neutral-300'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {cat.badge}
                          </span>
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            isSelected ? 'text-neutral-300' : 'text-neutral-500'
                          }`}
                        >
                          {cat.subtitle}
                        </div>
                      </div>
                      {isSelected && <Check size={16} className="text-white mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: STYLE */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-neutral-500 uppercase block mb-1">
                  02 Aesthetic Direction
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-normal text-black uppercase tracking-wide">
                  What style resonates with your space?
                </h3>
                <p className="text-xs font-sans text-neutral-500 mt-1">
                  Select an aesthetic mood or skip to browse freely.
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedStyle('all')}
                  className={`w-full text-left p-4 border transition-all flex items-start justify-between ${
                    selectedStyle === 'all'
                      ? 'border-black bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white hover:border-black text-black'
                  }`}
                >
                  <div>
                    <div className="font-sans text-sm font-bold uppercase tracking-wide">
                      Any Style / Eclectic
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        selectedStyle === 'all' ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                    >
                      Show all aesthetic styles and expressions
                    </div>
                  </div>
                  {selectedStyle === 'all' && <Check size={16} className="text-white mt-1" />}
                </button>

                {STYLES.map((st) => {
                  const isSelected = selectedStyle === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStyle(st.id)}
                      className={`w-full text-left p-4 border transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-black bg-neutral-900 text-white shadow-xs'
                          : 'border-neutral-200 bg-white hover:border-black text-black'
                      }`}
                    >
                      <div>
                        <div className="font-sans text-sm font-bold uppercase tracking-wide">
                          {st.label}
                        </div>
                        <div
                          className={`text-xs mt-0.5 ${
                            isSelected ? 'text-neutral-300' : 'text-neutral-500'
                          }`}
                        >
                          {st.subtitle}
                        </div>
                      </div>
                      {isSelected && <Check size={16} className="text-white mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: BUDGET */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-neutral-500 uppercase block mb-1">
                  03 Investment Tier
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-normal text-black uppercase tracking-wide">
                  What is your budget tier?
                </h3>
                <p className="text-xs font-sans text-neutral-500 mt-1">
                  All artwork prices include museum-grade packing and insurance.
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedBudget('all')}
                  className={`w-full text-left p-4 border transition-all flex items-start justify-between ${
                    selectedBudget === 'all'
                      ? 'border-black bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white hover:border-black text-black'
                  }`}
                >
                  <div>
                    <div className="font-sans text-sm font-bold uppercase tracking-wide">
                      Any Budget
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        selectedBudget === 'all' ? 'text-neutral-300' : 'text-neutral-500'
                      }`}
                    >
                      View pieces across all investment tiers (₹2,800 to ₹65,000)
                    </div>
                  </div>
                  {selectedBudget === 'all' && <Check size={16} className="text-white mt-1" />}
                </button>

                {BUDGETS.map((bg) => {
                  const isSelected = selectedBudget === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setSelectedBudget(bg.id)}
                      className={`w-full text-left p-4 border transition-all flex items-start justify-between ${
                        isSelected
                          ? 'border-black bg-neutral-900 text-white shadow-xs'
                          : 'border-neutral-200 bg-white hover:border-black text-black'
                      }`}
                    >
                      <div>
                        <div className="font-sans text-sm font-bold uppercase tracking-wide">
                          {bg.label}
                        </div>
                        <div
                          className={`text-xs mt-0.5 ${
                            isSelected ? 'text-neutral-300' : 'text-neutral-500'
                          }`}
                        >
                          {bg.subtitle}
                        </div>
                      </div>
                      {isSelected && <Check size={16} className="text-white mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between gap-3">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                className="px-3 py-2 text-xs font-sans font-bold uppercase tracking-wider text-neutral-600 hover:text-black flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-sans font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 3 ? (
              <>
                <button
                  type="button"
                  onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                  className="px-3.5 py-2.5 text-xs font-sans font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                  className="bg-black text-white hover:bg-neutral-800 px-4 py-2.5 text-xs font-sans font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleApplyPicks}
                className="bg-black text-white hover:bg-neutral-800 px-5 py-2.5 text-xs font-sans font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-xs"
              >
                <Sparkles size={14} />
                <span>See My Picks ({matchingArtworks.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
