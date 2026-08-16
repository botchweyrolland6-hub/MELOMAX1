import React from 'react';
import type { Tyre, SystemSettings } from '../types';
import { StatusBadge } from './StatusBadge';
import { X, ShieldCheck, Truck, PhoneCall, CheckCircle, Tag } from 'lucide-react';

interface TyreDetailModalProps {
  tyre: Tyre | null;
  settings: SystemSettings;
  isOpen: boolean;
  onClose: () => void;
  onOrderInquiry?: (tyre: Tyre) => void;
}

export const TyreDetailModal: React.FC<TyreDetailModalProps> = ({
  tyre,
  settings,
  isOpen,
  onClose,
  onOrderInquiry,
}) => {
  if (!isOpen || !tyre) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl p-6 rounded-3xl border border-slate-700/60 shadow-2xl space-y-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center group min-h-[240px]">
            <img
              src={tyre.image_url}
              alt={tyre.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute top-3 left-3">
              <StatusBadge status={tyre.status} stock={tyre.stock_quantity} />
            </div>
            <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-mono text-amber-400 border border-amber-500/20">
              {tyre.size}
            </div>
          </div>

          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
                <Tag className="w-3.5 h-3.5" />
                <span>{tyre.category_name || 'General Tyre'}</span>
              </div>
              <h2 className="text-2xl font-black text-white leading-tight mb-2">{tyre.name}</h2>
              <p className="text-3xl font-extrabold text-amber-400">
                {settings.currency} {tyre.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block">Brand</span>
                <span className="font-semibold text-slate-200">{tyre.brand}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Model</span>
                <span className="font-semibold text-slate-200">{tyre.model}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Tyre Size</span>
                <span className="font-semibold text-amber-400 font-mono">{tyre.size}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Stock Level</span>
                <span className="font-semibold text-slate-200">{tyre.stock_quantity} Units</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Product Description</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                {tyre.description || `Heavy duty ${tyre.brand} ${tyre.model} tyre engineered for reliability and long tread lifespan.`}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center border-t border-slate-800 pt-4 text-xs">
          <div className="flex flex-col items-center space-y-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-medium text-slate-300">100% Quality Guaranteed</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Truck className="w-5 h-5 text-amber-400" />
            <span className="font-medium text-slate-300">Fast Nationwide Delivery</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <PhoneCall className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-slate-300">Instant MeloMax Support</span>
          </div>
        </div>

        <div className="pt-2">
          {onOrderInquiry && tyre.stock_quantity > 0 ? (
            <button
              onClick={() => onOrderInquiry(tyre)}
              className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Inquire / Request Quote for {tyre.size}</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 px-4 bg-slate-800 text-slate-500 font-bold rounded-xl text-center cursor-not-allowed text-xs"
            >
              Currently Out of Stock - Contact MeloMax for Orders
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
