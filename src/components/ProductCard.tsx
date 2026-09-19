'use client';

import ArtworkCard from './ArtworkCard';
import { ArtworkProduct } from '@/types/art';
import { Product } from '@/lib/products';

export default function ProductCard({
  product,
  priority = false,
  onQuickView,
}: {
  product: Product | ArtworkProduct;
  priority?: boolean;
  onQuickView?: (artwork: ArtworkProduct) => void;
}) {
  return <ArtworkCard artwork={product as ArtworkProduct} priority={priority} onQuickView={onQuickView} />;
}
