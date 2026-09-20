export type MajorCategory = 'wall-art' | 'sculptures' | 'decorative-pieces';

export type ArtworkCategory = MajorCategory;

export type ArtworkSubcategory =
  | 'abstract'
  | 'contemporary'
  | 'portraits'
  | 'landscapes'
  | 'drawings'
  | 'fine-art-prints'
  | 'limited-editions'
  | 'collectible-figures'
  | 'desk-objects'
  | 'decorative-objects'
  | 'sculptures'
  | 'bronze'
  | 'terracotta'
  | 'marble'
  | 'mixed-media';

export type ArtworkOrientation = 'vertical' | 'horizontal' | 'square';

export interface ProductDimensions {
  width: number;
  height: number;
  depth?: number;
  unit: 'cm' | 'in';
}

export type ArtworkDimensions = ProductDimensions;

export interface FrameOption {
  id: string;
  name: string;
  price: number;
  material: string;
  color: string;
  description: string;
}

export interface SculptureSpecs {
  scale?: string;
  material: string;
  displayBase?: string;
  packagingIncluded?: string;
  releaseYear?: number;
  editionSize?: number;
  editionNumber?: number;
  multiAngleImages?: {
    front: string;
    threeQuarter?: string;
    side: string;
    back?: string;
    detail?: string;
  };
}

/**
 * Authoritative Unified Product Model
 * Valid Category must ONLY accept: 'wall-art' | 'sculptures' | 'decorative-pieces'
 */
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: MajorCategory;
  subcategory: string;
  price: number;
  originalPrice?: number;
  original_price?: number;
  description: string;
  shortDescription?: string;
  short_description?: string;
  images: string[];
  thumbnail: string;
  material: string;
  medium: string;
  dimensions: ProductDimensions;
  stock: number;
  isActive?: boolean;
  is_active?: boolean;
  isFeatured?: boolean;
  is_featured?: boolean;
  isNew?: boolean;
  is_new?: boolean;
  isBestseller?: boolean;
  is_bestseller?: boolean;
  isArtistFavorite?: boolean;
  is_artist_favorite?: boolean;
  rating?: number;
  reviewCount?: number;
  review_count?: number;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;

  // Catalog compatibility properties
  catalogNumber?: string;
  artistId?: string;
  artistName?: string;
  type?: string;
  currency?: string;
  videoUrl?: string;
  orientation?: ArtworkOrientation;
  weight?: string;
  colorPalette?: string[];
  styleTags?: string[];
  roomTags?: string[];
  moodTags?: string[];
  occasionTags?: string[];
  isHandPainted?: boolean;
  isOriginal?: boolean;
  isLimitedEdition?: boolean;
  isOneOfOne?: boolean;
  editionSize?: number;
  editionNumber?: number;
  frameAvailable?: boolean;
  frameOptions?: FrameOption[];
  defaultFramePrice?: number;
  certificateOfAuthenticity?: boolean;
  artistNotes?: string;
  careInstructions?: string[];
  shippingInfo?: string;
  leadTime?: string;
  sculptureSpecs?: SculptureSpecs;
  story?: string;
}

export type ArtworkProduct = Product;

export interface Artist {
  id: string;
  slug: string;
  name: string;
  portrait: string;
  coverImage: string;
  bio: string;
  shortBio: string;
  location: string;
  country: string;
  website?: string;
  instagram?: string;
  signatureStyle: string;
  mediums: string[];
  featured: boolean;
  followerCount: number;
  artworksCount: number;
  statement: string;
  exhibitions?: string[];
  createdAt: string;
}

export interface CuratedCollection {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  coverImage: string;
  badge?: string;
  curator: string;
  productIds: string[];
  featuredOnHome: boolean;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  location?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  artistName: string;
  image: string;
  price: number;
  frame?: {
    id: string;
    name: string;
    price: number;
  };
  medium: string;
  dimensions: string;
  quantity: number;
}

export interface OrderAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shippingAddress: OrderAddress;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillmentStatus:
    | 'pending'
    | 'payment_confirmed'
    | 'confirmed'
    | 'processing'
    | 'in_framing'
    | 'packed'
    | 'shipped'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  trackingNumber?: string;
  courierName?: string;
  subtotal: number;
  framingTotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  createdAt: string;
  updatedAt: string;
}
