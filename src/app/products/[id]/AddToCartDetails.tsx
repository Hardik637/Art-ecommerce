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
      artistName: product.artistName || '',
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
        className="flex-1 bg-black hover:bg-neutral-800 text-white h-12 font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:bg-neutral-300"
      >
        {added ? (
          <>
            <Check size={16} /> Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag size={16} /> Add to Cart — ₹{product.price.toLocaleString('en-IN')}
          </>
        )}
      </button>

      <button
        onClick={() => toggleWishlist(product)}
        className="w-12 h-12 border border-neutral-300 bg-white hover:border-black flex items-center justify-center text-black transition-colors"
      >
        <Heart
          size={18}
          fill={isInWishlist ? '#000000' : 'none'}
          className={isInWishlist ? 'text-black' : 'text-neutral-500'}
        />
      </button>
    </div>
  );
}
