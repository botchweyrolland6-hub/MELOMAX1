import React, { useState, useMemo } from 'react';
import type { Tyre, Category, SystemSettings } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Search, Disc, Eye, Tag } from 'lucide-react';

interface UserCatalogueProps {
  tyres: Tyre[];
  categories: Category[];
  settings: SystemSettings;
  onSelectTyre: (tyre: Tyre) => void;
}

export const UserCatalogue: React.FC<UserCatalogueProps> = ({
  tyres,
  categories,
  settings,
  onSelectTyre,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const popularSizes = [
    '385/65 x22.5',
    '315/80 x22.5',
    '285/70 x17',
    '265/70 x17',
    '245/70 x16',
    '235/65 x17',
    '225/55 x17',
    '205/55 x16',
    '195/65 x15',
    '185/65 x14',
  ];

  const filteredTyres = useMemo(() => {
    return tyres.filter((tyre) => {
      const matchesSearch =
        tyre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tyre.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tyre.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tyre.model.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || tyre.category_id === selectedCategory;
      const matchesSize = selectedSize === 'all' || tyre.size === selectedSize;
      const matchesStock = !inStockOnly || tyre.stock_quantity > 0;

      return matchesSearch && matchesCategory && matchesSize && matchesStock;
    });
  }, [tyres, searchTerm, selectedCategory, selectedSize, inStockOnly]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 p-5 sm:p-10 md:p-12 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40">
        <div className="max-w-2xl space-y-3 sm:space-y-4 relative z-10">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] sm:text-xs font-bold uppercase tracking-widest inline-block">
            MeloMax Ventures Official Tyre Shop
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Find Premium Tyres for Every Wheel Size in Ghana
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Browse our full 170+ tyre size inventory. From heavy commercial trucks to luxury SUVs and private salon cars, find exact sizes with transparent Ghana Cedi ({settings.currency}) pricing.
          </p>

          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 sm:left-4 top-3.5 text-amber-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by size (e.g. 205/55 R16, 385/65 x22.5)..."
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-950/90 border border-amber-500/30 rounded-2xl text-white font-medium text-xs sm:text-sm focus:outline-none focus:border-amber-500 shadow-xl"
              />
            </div>
          </div>
        </div>

        <Disc className="absolute -right-12 -bottom-12 w-64 h-64 sm:w-80 sm:h-80 text-amber-500/5 rotate-45 pointer-events-none" />
      </div>

      {/* Quick Filter Size Horizontal Scroll Ribbon */}
      <div className="space-y-2">
        <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
          Quick Filter by Popular Tyre Size:
        </span>
        <div className="flex overflow-x-auto pb-2 scrollbar-none space-x-2 shrink-0">
          <button
            onClick={() => setSelectedSize('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition shrink-0 ${
              selectedSize === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All Sizes
          </button>
          {popularSizes.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSize(selectedSize === s ? 'all' : s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition shrink-0 ${
                selectedSize === s
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs & Stock Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            All Categories ({tyres.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedCategory === c.id
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <label className="flex items-center space-x-2 text-xs font-bold text-slate-300 cursor-pointer shrink-0 pt-1 md:pt-0">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 accent-amber-500 rounded"
          />
          <span>In-Stock Only</span>
        </label>
      </div>

      {/* Tyre Cards Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredTyres.length > 0 ? (
          filteredTyres.map((tyre) => (
            <div
              key={tyre.id}
              className="glass-panel rounded-3xl border border-slate-800/80 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 hover:-translate-y-1 transition duration-300 shadow-xl group"
            >
              <div className="relative h-44 sm:h-48 bg-slate-900 overflow-hidden">
                <img
                  src={tyre.image_url}
                  alt={tyre.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3">
                  <StatusBadge status={tyre.status} stock={tyre.stock_quantity} />
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-amber-400 border border-amber-500/20">
                  {tyre.size}
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-400 mb-1">
                    <Tag className="w-3 h-3" />
                    <span>{tyre.category_name || 'General Tyre'}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white group-hover:text-amber-400 transition leading-snug">
                    {tyre.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Brand: <strong className="text-slate-200">{tyre.brand}</strong></p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Price</span>
                    <span className="text-base sm:text-lg font-black text-amber-400">
                      {settings.currency} {tyre.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectTyre(tyre)}
                    className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 font-bold text-xs rounded-xl flex items-center space-x-1 transition shadow-lg"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center space-y-3 glass-panel rounded-3xl border border-slate-800">
            <Disc className="w-12 h-12 mx-auto text-slate-600 animate-spin" />
            <h3 className="text-lg font-bold text-white">No tyres available matching your selection</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try resetting your search query, size selection, or category filter to view our complete inventory.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedSize('all');
                setInStockOnly(false);
              }}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
