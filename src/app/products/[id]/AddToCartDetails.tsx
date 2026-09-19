'use client';

import { ArtworkProduct } from '@/types/art';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useState } from 'react';
import { ShoppingBag, Check, Heart } from 'lucide-react';

export default function AddToCartDetails({ product }: { product: ArtworkProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      artistName: product.artistName,
      price: product.price,
      image: product.images[0] || product.thumbnail,
      medium: product.medium,
      dimensions: `${product.dimensions.width} × ${product.dimensions.height} ${product.dimensions.unit}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex gap-4">
      <button
        disabled={product.stock <= 0 || added}
        onClick={handleAdd}
        className="flex-1 bg-[#11100F] hover:bg-[#481E25] text-[#F4EFE7] h-14 font-sans text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors disabled:bg-[#10B981]"
      >
        {added ? (
          <>
            <Check size={16} /> Added to Bag
          </>
        ) : (
          <>
            <ShoppingBag size={16} /> Acquire — ₹{product.price.toLocaleString('en-IN')}
          </>
        )}
      </button>

      <button
        onClick={() => toggleWishlist(product)}
        className="w-14 h-14 border border-[#E4DBCF] bg-[#FAF7F2] hover:border-[#11100F] flex items-center justify-center text-[#11100F] transition-colors"
      >
        <Heart
          size={20}
          fill={isInWishlist ? '#481E25' : 'none'}
          className={isInWishlist ? 'text-[#481E25]' : 'text-[#78716C]'}
        />
      </button>
    </div>
  );
}
