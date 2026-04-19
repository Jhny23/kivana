import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import ProductClient from './ProductClient';
import { supabaseAdmin } from '@/lib/supabase';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) return {};
  return {
    title: `${product.name} — $${product.price}`,
    description: product.description,
    openGraph: {
      title: `${product.name} — $${product.price}`,
      description: product.description,
      url: `https://www.kivana.co/product/${product.slug}`,
      images: [{ url: product.image || '/og-image.jpg', alt: product.name }],
    },
  };
}

export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }));
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) notFound();

  // Fetch live stock from Supabase
  const { data: liveProduct } = await supabaseAdmin
    .from('products')
    .select('stock')
    .eq('slug', slug)
    .single();

  // Merge live stock into product data
  const productWithLiveStock = {
    ...product,
    stock: liveProduct?.stock ?? product.stock,
  };

  return <ProductClient product={productWithLiveStock} />;
}