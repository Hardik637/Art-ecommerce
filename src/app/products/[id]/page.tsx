import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductById, getProductBySlug, getAllProducts } from '@/lib/products';
import ArtworkDetailClient from './ArtworkDetailClient';
import { SITE_CONFIG } from '@/config/site';

export async function generateStaticParams() {
  const products = await getAllProducts();
  const params: Array<{ id: string }> = [];
  for (const prod of products) {
    params.push({ id: prod.id });
    if (prod.slug && prod.slug !== prod.id) {
      params.push({ id: prod.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = (await getProductBySlug(id)) || (await getProductById(id));

  if (!product) {
    return { title: 'Product Not Found | Zorodoor Art' };
  }

  const title = `${product.name} | ${SITE_CONFIG.name}`;
  const description = `${product.shortDescription || product.description}. ${product.material || product.medium}. Dimensions: ${product.dimensions.width}×${product.dimensions.height} ${product.dimensions.unit}.`;

  return {
    title,
    description,
    keywords: [
      product.name,
      product.artistName || '',
      product.category,
      product.subcategory || '',
      'buy art online',
      'home decor art India',
    ],
    alternates: {
      canonical: `${SITE_CONFIG.url}/products/${product.slug || product.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_CONFIG.url}/products/${product.slug || product.id}`,
      type: 'website',
      images: [
        {
          url: product.images[0] || product.thumbnail,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = (await getProductBySlug(id)) || (await getProductById(id));

  if (!product) {
    notFound();
  }

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: (product.images || [product.thumbnail]).map((img) =>
      img.startsWith('http') ? img : `${SITE_CONFIG.url}${img}`
    ),
    description: product.description,
    sku: product.id,
    category: product.category,
    material: product.material || product.medium,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_CONFIG.url}/products/${product.slug || product.id}`,
      priceCurrency: 'INR',
      price: product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
    },
  };

  return (
    <div className="bg-[#FAFAF9] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ArtworkDetailClient artwork={product} />
    </div>
  );
}

