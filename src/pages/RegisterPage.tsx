import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { SystemSettings } from '../types';
import { User, Mail, Phone, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RegisterPageProps {
  settings: SystemSettings;
  setActiveTab: (tab: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ settings, setActiveTab }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) return setError('Please enter your full name.');
    if (!email.trim()) return setError('Please enter a valid email address.');
    if (!phone.trim()) return setError('Please enter your phone number.');
    if (password.length < 6) return setError('Password must be at least 6 characters long.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    try {
      const res = await register(fullName, email, phone, password);
      if (!res.success) {
        setError(res.message);
      } else {
        setActiveTab('catalogue');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 animate-fade-in space-y-6">
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="h-20 flex items-center justify-center">
            <img
              src={settings.company_logo || '/logo.png'}
              alt={settings.company_name}
              className="h-20 object-contain mx-auto"
            />
          </div>
          <p className="text-xs text-slate-400">Register as a Customer to view live inventory & request quotes</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Kwame Mensah"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kwame@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 24 123 4567"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Confirm Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          Already registered?{' '}
          <button
            onClick={() => setActiveTab('login')}
            className="text-amber-400 font-bold hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
