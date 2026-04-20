'use client';
import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products as staticProducts, categories } from '@/lib/products';

function ShopContent() {
  const searchParams  = useSearchParams();
  const initCat       = searchParams.get('cat') || 'all';
  const [activecat, setActivecat] = useState(initCat);
  const [sort,      setSort]      = useState('default');
  const [products,  setProducts]  = useState(staticProducts);

  // Fetch live stock from API and merge with static products
useEffect(() => {
  fetch('/api/products/stock')
    .then(r => r.json())
    .then(liveData => {
      if (!liveData.data) return;
      setProducts(prev => prev.map(p => {
        const live = liveData.data.find(l => l.slug === p.slug);
        if (!live) return p;
        return {
          ...p,
          stock: live.stock,
          price: live.price,
          name:  live.name,
          badge: live.badge,
        };
      }));
    })
    .catch(() => {});
}, []);

  const filtered = useMemo(() => {
    let list = activecat === 'all' ? [...products] : products.filter(p => p.category === activecat);
    if (sort === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'name')       list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [activecat, sort, products]);

  const tabs     = [{ slug: 'all', name: 'All' }, ...categories];
  const catLabel = activecat === 'all' ? 'All Products' : categories.find(c => c.slug === activecat)?.name || 'Products';

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16">
      <div className="mb-12">
        <p className="font-sans text-[0.6rem] tracking-[0.28em] uppercase text-mauve mb-2">Shop</p>
        <h1 className="font-display text-display-lg font-light text-ink">{catLabel}</h1>
        <p className="font-sans text-sm text-ink/55 mt-2">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-cream">
        <div className="flex flex-wrap gap-1">
          {tabs.map(tab => (
            <button key={tab.slug} onClick={() => setActivecat(tab.slug)}
              className={`font-sans text-[0.65rem] tracking-[0.15em] uppercase px-4 py-2 border transition-colors ${activecat === tab.slug ? 'bg-ink text-cream border-ink' : 'bg-transparent text-ink border-ink/20 hover:border-ink'}`}>
              {tab.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-sans text-[0.6rem] tracking-[0.2em] uppercase text-ink/50">Sort by</span>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="font-sans text-[0.7rem] bg-transparent border border-ink/20 px-3 py-2 text-ink outline-none focus:border-ink hover:border-ink transition-colors cursor-pointer">
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-3xl text-ink/30">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-cream rounded w-48 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {[...Array(8)].map((_, i) => (
              <div key={i}><div className="aspect-[4/5] bg-cream mb-3" /><div className="h-5 bg-cream rounded w-3/4 mb-2" /><div className="h-4 bg-cream rounded w-1/3" /></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}