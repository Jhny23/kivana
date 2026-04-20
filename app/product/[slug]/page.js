import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import ProductClient from './ProductClient';
import { supabaseAdmin } from '@/lib/supabase';

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: product } = await supabaseAdmin
    .from('products')
    .select('name, price, description, image')
    .eq('slug', slug)
    .single();

  if (!product) return {};

  return {
    title: `${product.name} — $${product.price}`,
    description: product.description,
    openGraph: {
      title: `${product.name} — $${product.price}`,
      description: product.description,
      url: `https://www.kivana.co/product/${slug}`,
      images: [{ url: product.image || '/og-image.jpg', alt: product.name }],
    },
  };
}

export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }));
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  // Fetch everything from Supabase — price, stock, name, all of it
  const { data: liveProduct } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!liveProduct) notFound();

  // Get static data for fields not in Supabase
  // (gradient, longDescription, ingredients, howToUse)
  const staticProduct = products.find(p => p.slug === slug) || {};

  // Merge — Supabase data takes priority over static file
  const product = {
    ...staticProduct,
    id:               liveProduct.id,
    slug:             liveProduct.slug,
    name:             liveProduct.name,
    price:            liveProduct.price,
    category:         liveProduct.category,
    stock:            liveProduct.stock,
    badge:            liveProduct.badge,
    description:      liveProduct.description,
    longDescription:  liveProduct.long_description || staticProduct.longDescription,
    ingredients:      liveProduct.ingredients      || staticProduct.ingredients,
    howToUse:         liveProduct.how_to_use       || staticProduct.howToUse,
    image:            liveProduct.image            || staticProduct.image,
    imageHover:       liveProduct.image_hover      || staticProduct.imageHover,
    gradient:         liveProduct.gradient         || staticProduct.gradient,
  };

  return <ProductClient product={product} />;
}