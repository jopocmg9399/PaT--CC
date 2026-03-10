
import React, { useState, useMemo } from 'react';
import { 
  Search, ShoppingCart, Filter, Tag, 
  Info, ChevronRight, Star, Zap, 
  DollarSign, Package, Share2, UserPlus,
  ArrowRight, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Product, StoreConfig, Currency, SaleItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface StoreFrontProps {
  products: Product[];
  config: StoreConfig;
  onAddToCart: (product: Product, groupingId?: string) => void;
  onAffiliateClick: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const StoreFront: React.FC<StoreFrontProps> = ({ 
  products, config, onAddToCart, onAffiliateClick, currency, setCurrency 
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                           p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const categories = Array.from(new Set(products.map(p => p.categoryId)));

  return (
    <div className="space-y-12">
      {/* Banner / Hero */}
      <section className="relative h-[400px] bg-[#2B1B17] overflow-hidden border-b-[12px] border-[#B48D51] flex items-center px-8 md:px-20">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={config.bannerUrl || "https://picsum.photos/seed/storebanner/1920/1080"} 
            alt="Banner" 
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6">
              {config.storeName}
              {config.isVerified && (
                <span className="inline-flex items-center gap-2 ml-4 bg-[#B48D51] text-white text-[10px] font-black px-4 py-2 border-2 border-white rotate-3 shadow-xl">
                  <CheckCircle2 size={14} /> Tienda Acreditada
                </span>
              )}
            </h2>
            <p className="text-white/60 text-lg font-medium leading-relaxed mb-8">
              {config.aboutText}
            </p>
            <div className="flex gap-4">
              <button className="bg-[#B48D51] text-white px-8 py-4 font-black text-xs uppercase tracking-widest shadow-[6px_6px_0px_white] hover:translate-y-1 hover:shadow-none transition-all">
                Ver Catálogo
              </button>
              <button 
                onClick={onAffiliateClick}
                className="bg-white text-[#2B1B17] px-8 py-4 font-black text-xs uppercase tracking-widest shadow-[6px_6px_0px_#B48D51] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
              >
                <Share2 size={16} /> Programa Afiliados
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Controls */}
      <section className="sticky top-20 z-40 bg-[#FFF9F2]/80 backdrop-blur-md py-6 border-b-4 border-[#2B1B17]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-4 border-[#2B1B17] pl-12 pr-4 py-4 font-bold focus:outline-none focus:ring-4 focus:ring-[#B48D51]/20"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-4 border-[#2B1B17] transition-all whitespace-nowrap ${
                selectedCategory === 'all' ? 'bg-[#2B1B17] text-white' : 'bg-white text-[#2B1B17]'
              }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-4 border-[#2B1B17] transition-all whitespace-nowrap ${
                  selectedCategory === cat ? 'bg-[#2B1B17] text-white' : 'bg-white text-[#2B1B17]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex bg-white border-4 border-[#2B1B17] p-1 shadow-[4px_4px_0px_#B48D51]">
            {(['CUP', 'USD'] as Currency[]).map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  currency === c ? 'bg-[#2B1B17] text-white' : 'text-gray-400 hover:text-[#2B1B17]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        <AnimatePresence>
          {filteredProducts.map(p => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white border-4 border-[#2B1B17] p-6 shadow-[8px_8px_0px_#EADBC8] hover:shadow-[12px_12px_0px_#B48D51] transition-all flex flex-col group"
            >
              <div className="relative aspect-square mb-6 overflow-hidden border-2 border-[#2B1B17]">
                <img 
                  src={`https://picsum.photos/seed/${p.id}/400/400`} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {p.stock <= p.minStock && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[8px] font-black uppercase px-2 py-1 border-2 border-[#2B1B17]">
                    Últimas Unidades
                  </div>
                )}
                {p.isOffer && (
                  <div className="absolute top-4 right-4 bg-[#B48D51] text-white text-[8px] font-black uppercase px-2 py-1 border-2 border-[#2B1B17]">
                    Oferta
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{p.categoryId}</span>
                  <span className="text-[9px] font-black text-[#B48D51] uppercase tracking-widest">SKU: {p.sku}</span>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-[#2B1B17] line-clamp-1">{p.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 italic">"{p.description}"</p>
              </div>

              <div className="mt-6 pt-6 border-t-4 border-dashed border-[#FFF9F2] space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Precio Unitario</p>
                    <p className="text-3xl font-black text-[#2B1B17] tracking-tighter">
                      {currency === 'CUP' ? `$${p.unitPrice.toLocaleString()}` : `$${(p.unitPrice / 250).toFixed(2)}`}
                      <span className="text-xs ml-1 opacity-40">{currency}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Stock</p>
                    <p className={`text-lg font-black ${p.stock <= p.minStock ? 'text-red-600' : 'text-green-700'}`}>{p.stock}</p>
                  </div>
                </div>

                {/* Groupings */}
                {p.groupings.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-gray-400 uppercase">Precios por Mayor</p>
                    <div className="flex flex-wrap gap-2">
                      {p.groupings.map(g => (
                        <button 
                          key={g.id}
                          onClick={() => onAddToCart(p, g.id)}
                          className="flex-1 bg-[#FFF9F2] border-2 border-[#2B1B17] p-2 hover:bg-[#B48D51] hover:text-white transition-all text-left group/btn"
                        >
                          <p className="text-[8px] font-black uppercase opacity-60 group-hover/btn:text-white">{g.label}</p>
                          <p className="text-xs font-black">${g.price.toLocaleString()} <span className="text-[8px] opacity-40">x {g.quantity}u</span></p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => onAddToCart(p)}
                  disabled={p.stock <= 0}
                  className={`w-full py-4 font-black text-xs uppercase tracking-widest shadow-[6px_6px_0px_#2B1B17] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 ${
                    p.stock <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#2B1B17] text-white hover:bg-[#B48D51]'
                  }`}
                >
                  <ShoppingCart size={16} /> {p.stock <= 0 ? 'Agotado' : 'Añadir al Carrito'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="py-20 text-center bg-white border-4 border-[#2B1B17] shadow-[12px_12px_0px_#EADBC8]">
          <Search size={64} className="mx-auto text-gray-200 mb-6" />
          <h3 className="text-2xl font-black uppercase text-gray-400">No se encontraron productos</h3>
          <button onClick={() => {setSearch(''); setSelectedCategory('all');}} className="mt-6 text-[#B48D51] font-black uppercase tracking-widest text-xs hover:underline">Limpiar filtros</button>
        </div>
      )}
    </div>
  );
};

export default StoreFront;
