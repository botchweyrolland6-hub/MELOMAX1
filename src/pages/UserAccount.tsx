import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Phone, Mail, Calendar, CheckCircle2 } from 'lucide-react';

export const UserAccount: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-16">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-amber-500/20">
            {currentUser.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">{currentUser.full_name}</h1>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 mt-1">
              <Shield className="w-3 h-3" />
              {currentUser.role === 'admin' ? 'Administrator' : 'Verified Customer'}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">Account Profile Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center space-x-3">
              <Mail className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-400 block">Email Address</span>
                <span className="font-bold text-slate-200">{currentUser.email}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center space-x-3">
              <Phone className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-400 block">Phone Number</span>
                <span className="font-bold text-slate-200 font-mono">{currentUser.phone || '+233 24 000 0000'}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-400 block">Member Since</span>
                <span className="font-bold text-slate-200">
                  {new Date(currentUser.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-400 block">Account Status</span>
                <span className="font-bold text-emerald-400 uppercase">Active & Authorized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
