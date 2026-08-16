import React, { useState } from 'react';
import type { SystemSettings } from '../types';
import { Settings, Save, CheckCircle2, Database } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface AdminSettingsProps {
  settings: SystemSettings;
  onSaveSettings: (newSettings: Partial<SystemSettings>) => void;
  onResetDemoData: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSaveSettings,
  onResetDemoData,
}) => {
  const [companyName, setCompanyName] = useState(settings.company_name);
  const [companyLogo, setCompanyLogo] = useState(settings.company_logo);
  const [contactEmail, setContactEmail] = useState(settings.contact_email);
  const [contactPhone, setContactPhone] = useState(settings.contact_phone);
  const [currency, setCurrency] = useState(settings.currency);
  const [lowStockThreshold, setLowStockThreshold] = useState(settings.low_stock_threshold.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      company_name: companyName,
      company_logo: companyLogo,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      currency: currency.toUpperCase(),
      low_stock_threshold: parseInt(lowStockThreshold, 10) || 5,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Settings className="w-6 h-6 text-amber-500" />
            <span>MeloMax System Configuration</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage business identity, currency defaults, stock thresholds, and database connection.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-bold">Settings updated successfully! Changes applied across all dashboards.</span>
        </div>
      )}

      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <Database className="w-4 h-4 text-amber-400" />
          <span>Database Engine Status</span>
        </h2>
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-white block">
              {isSupabaseConfigured ? 'Supabase PostgreSQL Cloud' : 'Persistent LocalStorage Engine (Full 170 Tyres Pre-loaded)'}
            </span>
            <span className="text-slate-400 text-[11px] block mt-0.5">
              {isSupabaseConfigured
                ? 'Connected to live Supabase backend instance.'
                : 'Operating in standalone high-performance local storage mode. Ready to switch to Supabase instantly.'}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold ${
              isSupabaseConfigured
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}
          >
            {isSupabaseConfigured ? 'Online' : 'Active Local Engine'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 text-xs">
        <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
          Company Identity & Regional Defaults
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Company Name *</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Currency Code *</label>
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="GHS"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Low-Stock Alert Threshold (Units) *</label>
            <input
              type="number"
              min="1"
              max="100"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-amber-500"
              required
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Tyres with stock at or below this count will trigger Low Stock amber alerts.
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Contact Phone Numbers</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Company Logo URL</label>
            <input
              type="url"
              value={companyLogo}
              onChange={(e) => setCompanyLogo(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onResetDemoData}
            className="px-4 py-2.5 bg-slate-900 hover:bg-rose-500/20 text-rose-400 border border-slate-800 hover:border-rose-500/30 rounded-xl font-bold transition"
          >
            Reset All Sample Data to Initial 170 Tyres
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
