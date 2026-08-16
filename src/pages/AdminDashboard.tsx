import React from 'react';
import type { Tyre, Category, SystemSettings, InventoryStats, AuditLog } from '../types';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  Disc,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FolderKanban,
  Users,
  Plus,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  History,
} from 'lucide-react';

interface AdminDashboardProps {
  stats: InventoryStats;
  tyres: Tyre[];
  categories: Category[];
  settings: SystemSettings;
  auditLogs: AuditLog[];
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onOpenCsvModal: () => void;
  onSelectTyre: (tyre: Tyre) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  tyres,
  categories,
  settings,
  auditLogs,
  setActiveTab,
  onOpenAddModal,
  onOpenCsvModal,
  onSelectTyre,
}) => {
  const lowStockList = tyres.filter(t => t.stock_quantity > 0 && t.stock_quantity <= settings.low_stock_threshold);
  const outOfStockList = tyres.filter(t => t.stock_quantity === 0);
  const recentTyres = [...tyres].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
            Real-Time Analytics & Control
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            MeloMax Ventures Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete inventory tracking for 170+ tyre sizes across Ghana.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Tyre</span>
          </button>
          <button
            onClick={onOpenCsvModal}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center space-x-2 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>CSV Import/Export</span>
          </button>
        </div>
      </div>

      {lowStockList.length > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-amber-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>
              <strong>Inventory Alert:</strong> {lowStockList.length} tyre sizes are at or below the low stock threshold ({settings.low_stock_threshold} units).
            </span>
          </div>
          <button
            onClick={() => setActiveTab('admin-tyres')}
            className="text-xs font-extrabold text-amber-400 hover:underline flex items-center space-x-1 shrink-0"
          >
            <span>Review Low Stock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total Tyres"
          value={stats.total_tyres}
          icon={Disc}
          color="amber"
          subtitle="Inventory Catalog"
          onClick={() => setActiveTab('admin-tyres')}
        />
        <StatCard
          title="Available"
          value={stats.available_tyres}
          icon={CheckCircle2}
          color="emerald"
          subtitle="In Stock Units"
          onClick={() => setActiveTab('admin-tyres')}
        />
        <StatCard
          title="Low Stock"
          value={stats.low_stock_tyres}
          icon={AlertTriangle}
          color="orange"
          subtitle={`<= ${settings.low_stock_threshold} Units`}
          onClick={() => setActiveTab('admin-tyres')}
        />
        <StatCard
          title="Out of Stock"
          value={stats.out_of_stock_tyres}
          icon={XCircle}
          color="rose"
          subtitle="Requires Restock"
          onClick={() => setActiveTab('admin-tyres')}
        />
        <StatCard
          title="Categories"
          value={stats.total_categories}
          icon={FolderKanban}
          color="blue"
          subtitle="Rim & Usage Types"
          onClick={() => setActiveTab('admin-categories')}
        />
        <StatCard
          title="Registered Users"
          value={stats.total_users}
          icon={Users}
          color="purple"
          subtitle="Customers & Staff"
          onClick={() => setActiveTab('admin-users')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                <span>Recently Added Tyres</span>
              </h2>
              <button
                onClick={() => setActiveTab('admin-tyres')}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center space-x-1"
              >
                <span>View All ({tyres.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Tyre Name</th>
                    <th className="pb-3 font-semibold">Size</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Stock</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {recentTyres.map((tyre) => (
                    <tr key={tyre.id} className="hover:bg-slate-900/60 transition group">
                      <td className="py-3 font-bold text-white flex items-center space-x-3">
                        <img
                          src={tyre.image_url}
                          alt={tyre.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-800"
                        />
                        <div>
                          <span className="block">{tyre.name}</span>
                          <span className="text-[10px] text-slate-400">{tyre.brand}</span>
                        </div>
                      </td>
                      <td className="py-3 font-mono text-amber-400">{tyre.size}</td>
                      <td className="py-3 font-bold text-slate-200">
                        {settings.currency} {tyre.price.toFixed(2)}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={tyre.status} stock={tyre.stock_quantity} />
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onSelectTyre(tyre)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 font-semibold text-slate-300 rounded-lg transition"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {outOfStockList.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl border border-rose-500/20 bg-rose-500/5 space-y-4">
              <h2 className="text-md font-bold text-rose-400 flex items-center space-x-2">
                <XCircle className="w-5 h-5" />
                <span>Restock Required ({outOfStockList.length} Out of Stock Items)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {outOfStockList.slice(0, 6).map((tyre) => (
                  <div
                    key={tyre.id}
                    className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <span className="block text-xs font-bold text-white">{tyre.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono">{tyre.size}</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('admin-stock')}
                      className="px-2.5 py-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg text-xs font-bold transition"
                    >
                      + Add Stock
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="text-md font-bold text-white flex items-center space-x-2">
                <History className="w-4 h-4 text-amber-500" />
                <span>Recent Admin Activity</span>
              </h2>
              <button
                onClick={() => setActiveTab('admin-audit')}
                className="text-[11px] font-semibold text-slate-400 hover:text-white"
              >
                Full Audit Log
              </button>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {auditLogs.slice(0, 8).map((log) => (
                <div key={log.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-amber-400 uppercase">{log.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-200">{log.item}</p>
                  <p className="text-[11px] text-slate-400 leading-tight">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
