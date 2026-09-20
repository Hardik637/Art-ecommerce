'use client';

import ArtworkCard from './ArtworkCard';
import { ArtworkProduct, Product } from '@/types/art';

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
