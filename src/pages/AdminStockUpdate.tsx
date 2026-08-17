import React, { useState } from 'react';
import type { Tyre, SystemSettings } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { PackageCheck, Search, Save, CheckCircle2 } from 'lucide-react';

interface AdminStockUpdateProps {
  tyres: Tyre[];
  settings: SystemSettings;
  onUpdateStock: (id: string, newStock: number) => void;
}

export const AdminStockUpdate: React.FC<AdminStockUpdateProps> = ({
  tyres,
  settings,
  onUpdateStock,
}) => {
  const [search, setSearch] = useState('');
  const [modifiedStocks, setModifiedStocks] = useState<Record<string, number>>({});
  const [successMsg, setSuccessMsg] = useState(false);

  const filtered = tyres.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.size.toLowerCase().includes(search.toLowerCase()) ||
      t.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleLocalStockChange = (id: string, val: number) => {
    setModifiedStocks((prev) => ({ ...prev, [id]: Math.max(0, val) }));
  };

  const handleApplySingle = (id: string, currentStock: number) => {
    const newVal = modifiedStocks[id] !== undefined ? modifiedStocks[id] : currentStock;
    onUpdateStock(id, newVal);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <PackageCheck className="w-6 h-6 text-emerald-400" />
            <span>Quick Inventory Stock Adjustment</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Update physical warehouse stock levels directly for all 170+ tyre sizes.
          </p>
        </div>

        <div className="w-full md:w-72 relative text-xs">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search size, brand, model..."
            className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Stock level saved and status recalculated automatically!</span>
        </div>
      )}

      {/* DESKTOP TABLE */}
      <div className="hidden md:block glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider">
                <th className="py-4 px-4">Tyre Model</th>
                <th className="py-4 px-4">Tyre Size</th>
                <th className="py-4 px-4">Brand</th>
                <th className="py-4 px-4">Current Stock</th>
                <th className="py-4 px-4">New Stock Quantity</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((tyre) => {
                const currentVal =
                  modifiedStocks[tyre.id] !== undefined
                    ? modifiedStocks[tyre.id]
                    : tyre.stock_quantity;

                return (
                  <tr key={tyre.id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-4 font-bold text-white flex items-center space-x-3">
                      <img
                        src={tyre.image_url}
                        alt=""
                        className="w-8 h-8 rounded-lg object-contain p-0.5 bg-slate-950 border border-slate-800 shrink-0"
                      />
                      <span>{tyre.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{tyre.size}</td>
                    <td className="py-3 px-4 text-slate-300">{tyre.brand}</td>
                    <td className="py-3 px-4 font-extrabold text-white font-mono">{tyre.stock_quantity}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          value={currentVal}
                          onChange={(e) => handleLocalStockChange(tyre.id, parseInt(e.target.value, 10) || 0)}
                          className="w-24 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl font-mono font-bold text-white focus:outline-none focus:border-amber-500 text-xs"
                        />
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={tyre.status} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleApplySingle(tyre.id, tyre.stock_quantity)}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1 ml-auto shadow-md shadow-amber-500/10 transition"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARD LIST */}
      <div className="block md:hidden space-y-3">
        {filtered.map((tyre) => {
          const currentVal =
            modifiedStocks[tyre.id] !== undefined
              ? modifiedStocks[tyre.id]
              : tyre.stock_quantity;

          return (
            <div key={tyre.id} className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center space-x-3">
                <img
                  src={tyre.image_url}
                  alt={tyre.name}
                  className="w-14 h-14 rounded-xl object-contain p-1 bg-slate-950 border border-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-white truncate">{tyre.name}</h3>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-400 font-mono font-bold text-[10px] border border-amber-500/20">
                      {tyre.size}
                    </span>
                    <StatusBadge status={tyre.status} stock={tyre.stock_quantity} />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Stock</span>
                  <span className="text-base font-black text-white font-mono">{tyre.stock_quantity} units</span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    value={currentVal}
                    onChange={(e) => handleLocalStockChange(tyre.id, parseInt(e.target.value, 10) || 0)}
                    className="w-20 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl font-mono font-bold text-white text-center focus:outline-none focus:border-amber-500 text-xs"
                  />
                  <button
                    onClick={() => handleApplySingle(tyre.id, tyre.stock_quantity)}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-1 shadow-md shadow-amber-500/20"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
