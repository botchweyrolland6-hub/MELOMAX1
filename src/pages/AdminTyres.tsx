import React, { useState, useMemo } from 'react';
import type { Tyre, Category, SystemSettings } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileSpreadsheet,
  ArrowUpDown,
  Package,
} from 'lucide-react';

interface AdminTyresProps {
  tyres: Tyre[];
  categories: Category[];
  settings: SystemSettings;
  onOpenAddModal: () => void;
  onEditTyre: (tyre: Tyre) => void;
  onDeleteTyre: (id: string, name: string) => void;
  onViewTyre: (tyre: Tyre) => void;
  onUpdateStock: (id: string, newStock: number) => void;
  onOpenCsvModal: () => void;
}

export const AdminTyres: React.FC<AdminTyresProps> = ({
  tyres,
  categories,
  settings,
  onOpenAddModal,
  onEditTyre,
  onDeleteTyre,
  onViewTyre,
  onUpdateStock,
  onOpenCsvModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'stock' | 'size' | 'newest'>('newest');

  const filteredTyres = useMemo(() => {
    return tyres.filter((tyre) => {
      const matchesSearch =
        tyre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tyre.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tyre.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tyre.model.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || tyre.category_id === selectedCategory;

      const matchesStatus =
        selectedStatus === 'all' || tyre.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'stock') return b.stock_quantity - a.stock_quantity;
      if (sortBy === 'size') return a.size.localeCompare(b.size);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [tyres, searchTerm, selectedCategory, selectedStatus, sortBy]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <span>Tyre Inventory Management</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
              {filteredTyres.length} of {tyres.length} Items
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage catalogue prices, stock levels, sizes, and product specifications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Tyre</span>
          </button>
          <button
            onClick={onOpenCsvModal}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center space-x-2 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>CSV Import / Export</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by size (e.g. 205/55 R16), brand, name..."
            className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Package className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Availability Statuses</option>
            <option value="in_stock">In Stock Only</option>
            <option value="low_stock">Low Stock Only</option>
            <option value="out_of_stock">Out of Stock Only</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
          >
            <option value="newest">Sort by Newest Added</option>
            <option value="price-asc">Sort by Price: Low to High</option>
            <option value="price-desc">Sort by Price: High to Low</option>
            <option value="size">Sort by Tyre Size</option>
            <option value="stock">Sort by Stock Level</option>
            <option value="name">Sort by Name A-Z</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-4 px-4">Tyre & Model</th>
                <th className="py-4 px-4">Size</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Brand</th>
                <th className="py-4 px-4">Price ({settings.currency})</th>
                <th className="py-4 px-4">Stock Quantity</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredTyres.length > 0 ? (
                filteredTyres.map((tyre) => (
                  <tr key={tyre.id} className="hover:bg-slate-900/50 transition group">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={tyre.image_url}
                          alt={tyre.name}
                          className="w-10 h-10 rounded-xl object-contain p-1 bg-slate-950 border border-slate-800 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block group-hover:text-amber-400 transition">
                            {tyre.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{tyre.model}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-amber-400 font-mono font-bold text-xs border border-amber-500/20">
                        {tyre.size}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-300">
                      {tyre.category_name || 'General Tyre'}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-200">{tyre.brand}</td>

                    <td className="py-3 px-4 font-black text-amber-400">
                      {settings.currency} {tyre.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => onUpdateStock(tyre.id, Math.max(0, tyre.stock_quantity - 1))}
                          className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center"
                          title="Decrease Stock"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-white font-mono">{tyre.stock_quantity}</span>
                        <button
                          onClick={() => onUpdateStock(tyre.id, tyre.stock_quantity + 1)}
                          className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center"
                          title="Increase Stock"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={tyre.status} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onViewTyre(tyre)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditTyre(tyre)}
                          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition"
                          title="Edit Tyre"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTyre(tyre.id, tyre.name)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                          title="Delete Tyre"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 space-y-3">
                    <Package className="w-12 h-12 mx-auto text-slate-600" />
                    <p className="text-sm font-semibold">No tyres found matching your search or filters.</p>
                    <button
                      onClick={onOpenAddModal}
                      className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg inline-flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add First Tyre</span>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE PRODUCT CARD GRID VIEW (NO SCROLLING TO THE RIGHT NEEDED!) */}
      <div className="block md:hidden space-y-4">
        {filteredTyres.length > 0 ? (
          filteredTyres.map((tyre) => (
            <div key={tyre.id} className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
              {/* Tyre Image Prominently at Top */}
              <div className="relative h-44 bg-slate-950/90 rounded-2xl p-3 border border-slate-800 flex items-center justify-center overflow-hidden">
                <img
                  src={tyre.image_url}
                  alt={tyre.name}
                  className="max-h-full max-w-full object-contain"
                />
                <div className="absolute top-2 left-2">
                  <StatusBadge status={tyre.status} stock={tyre.stock_quantity} />
                </div>
                <div className="absolute bottom-2 right-2 bg-slate-950/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-amber-400 border border-amber-500/20">
                  {tyre.size}
                </div>
              </div>

              {/* Title & Category */}
              <div>
                <h3 className="text-base font-black text-white">{tyre.name}</h3>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                  <span>Brand: <strong className="text-slate-200">{tyre.brand}</strong></span>
                  <span className="text-amber-400 font-semibold">{tyre.category_name || 'General'}</span>
                </div>
              </div>

              {/* Price & Stock Adjustment */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Price</span>
                  <span className="text-base font-black text-amber-400">
                    {settings.currency} {tyre.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => onUpdateStock(tyre.id, Math.max(0, tyre.stock_quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-black flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-black text-white font-mono text-xs">{tyre.stock_quantity}</span>
                  <button
                    onClick={() => onUpdateStock(tyre.id, tyre.stock_quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-black flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => onViewTyre(tyre)}
                  className="py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold rounded-xl flex items-center justify-center space-x-1 border border-slate-800"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button
                  onClick={() => onEditTyre(tyre)}
                  className="py-2 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-bold rounded-xl flex items-center justify-center space-x-1 border border-amber-500/20"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDeleteTyre(tyre.id, tyre.name)}
                  className="py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white font-bold rounded-xl flex items-center justify-center space-x-1 border border-rose-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-400 space-y-3 glass-panel p-6 rounded-3xl border border-slate-800">
            <Package className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">No tyres found matching your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
