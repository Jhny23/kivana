import { products, editorials } from '@/lib/products';

export default function sitemap() {
  const base = 'https://www.kivana.co';
  const static_pages = ['', '/shop', '/our-story', '/editorial', '/faq', '/contact', '/returns', '/shipping', '/privacy-policy', '/terms'].map(path => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));
  const product_pages = products.map(p => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));
  const editorial_pages = editorials.map(e => ({
    url: `${base}/editorial/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  return [...static_pages, ...product_pages, ...editorial_pages];
}
