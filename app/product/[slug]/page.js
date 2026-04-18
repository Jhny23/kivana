import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import ProductClient from './ProductClient';

export async function generateMetadata({ params }) {
  const product = products.find(p => p.slug === params.slug);
  if (!product) return {};
  const title       = `${product.name} — $${product.price}`;
  const description = product.description;
  const url         = `https://www.kivana.co/product/${product.slug}`;
  return {
    title,
    description,
    openGraph: { title, description, url, type: 'website', images: [{ url: product.image || '/og-image.jpg', alt: product.name }] },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }));
}

export default function ProductPage({ params }) {
  const product = products.find(p => p.slug === params.slug);
  if (!product) notFound();
  return <ProductClient product={product} />;
}
