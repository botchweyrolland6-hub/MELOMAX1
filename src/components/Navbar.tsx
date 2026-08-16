import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { SystemSettings } from '../types';
import { Disc, LogOut, User as UserIcon, Shield, Menu, X, Phone, Tag, LayoutDashboard, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  settings: SystemSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, activeTab, setActiveTab }) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div
            onClick={() => setActiveTab(isAdmin ? 'admin-dashboard' : 'catalogue')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="h-16 flex items-center group-hover:scale-105 transition duration-300">
              <img
                src={settings.company_logo || '/logo.png'}
                alt={settings.company_name}
                className="h-16 max-h-16 w-auto object-contain py-1"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {!isAdmin ? (
              <>
                <button
                  onClick={() => setActiveTab('catalogue')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                    activeTab === 'catalogue'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Tyre Catalogue</span>
                </button>

                <button
                  onClick={() => setActiveTab('categories')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                    activeTab === 'categories'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>Categories</span>
                </button>

                {currentUser && (
                  <button
                    onClick={() => setActiveTab('account')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                      activeTab === 'account'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>My Account</span>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-500 text-slate-950 hover:bg-amber-400 flex items-center space-x-2 transition shadow-lg shadow-amber-500/20"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right hidden xl:block">
              <div className="flex items-center space-x-1 text-xs text-slate-400">
                <Phone className="w-3 h-3 text-amber-400" />
                <span>{settings.contact_phone.split('/')[0]}</span>
              </div>
            </div>

            {currentUser ? (
              <div className="flex items-center space-x-3 bg-slate-900/80 p-1.5 pl-3 rounded-2xl border border-slate-800">
                <div className="flex items-center space-x-2 text-xs">
                  <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
                    {isAdmin ? <Shield className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-white block leading-none">{currentUser.full_name}</span>
                    <span className="text-[10px] text-amber-400 uppercase font-semibold">
                      {currentUser.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3">
          {!isAdmin ? (
            <>
              <button
                onClick={() => {
                  setActiveTab('catalogue');
                  setMobileOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-900"
              >
                Tyre Catalogue
              </button>
              <button
                onClick={() => {
                  setActiveTab('categories');
                  setMobileOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-900"
              >
                Categories
              </button>
              {currentUser && (
                <button
                  onClick={() => {
                    setActiveTab('account');
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-900"
                >
                  My Account
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => {
                setActiveTab('admin-dashboard');
                setMobileOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950"
            >
              Admin Dashboard
            </button>
          )}

          {currentUser ? (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">{currentUser.full_name} ({currentUser.role})</span>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-xs text-rose-400 font-bold px-3 py-1 bg-rose-500/10 rounded-lg"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setMobileOpen(false);
                }}
                className="py-2 text-center text-xs font-bold bg-slate-900 text-slate-200 rounded-xl"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setMobileOpen(false);
                }}
                className="py-2 text-center text-xs font-bold bg-amber-500 text-slate-950 rounded-xl"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
