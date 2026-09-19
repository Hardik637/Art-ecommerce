export type MajorCategory = 'wall-art' | 'sculptures' | 'decorative-pieces';

export type ArtworkCategory =
  | 'wall-art'
  | 'sculptures'
  | 'decorative-pieces'
  | 'paintings'
  | 'figures'
  | 'prints'
  | 'objects';


export type ArtworkSubcategory =
  | 'hand-painted'
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

export interface ArtworkDimensions {
  width: number;
  height: number;
  depth?: number;
  unit: 'cm' | 'in';
}

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

export interface ArtworkProduct {
  id: string;
  slug: string;
  catalogNumber: string; // e.g., "CAT. #A04-12"
  name: string;
  artistId: string;
  artistName: string;
  category: ArtworkCategory;
  subcategory: ArtworkSubcategory;
  type: 'painting' | 'sculpture' | 'figure' | 'print' | 'object';

  price: number;
  originalPrice?: number;
  currency: string;

  description: string;
  shortDescription: string;
  story: string;

  images: string[];
  thumbnail: string;
  videoUrl?: string;

  medium: string;
  material: string;
  dimensions: ArtworkDimensions;
  orientation: ArtworkOrientation;
  weight?: string;

  colorPalette: string[];
  styleTags: string[];
  roomTags: string[]; // e.g., 'living-room', 'bedroom', 'study', 'entryway', 'office'
  moodTags: string[]; // e.g., 'calm', 'bold', 'dark', 'romantic', 'surreal', 'minimal', 'playful', 'royal'
  occasionTags?: string[]; // e.g., 'for-her', 'for-him', 'new-home', 'anniversary'

  isHandPainted: boolean;
  isOriginal: boolean;
  isLimitedEdition: boolean;
  isOneOfOne: boolean;
  editionSize?: number;
  editionNumber?: number;

  frameAvailable: boolean;
  frameOptions?: FrameOption[];
  defaultFramePrice?: number;

  certificateOfAuthenticity: boolean;
  artistNotes?: string;
  careInstructions: string[];
  shippingInfo: string;
  leadTime: string;

  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  isArtistFavorite: boolean;

  rating: number;
  reviewCount: number;

  sculptureSpecs?: SculptureSpecs;

  createdAt: string;
  updatedAt: string;
}

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
