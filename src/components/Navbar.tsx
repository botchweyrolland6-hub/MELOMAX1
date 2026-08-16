import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { SystemSettings } from '../types';
import { LogOut, User as UserIcon, Shield, Menu, X, Phone, Tag, LayoutDashboard, ShoppingBag, Disc, FolderKanban, Users, PackageCheck, History, Settings } from 'lucide-react';

interface NavbarProps {
  settings: SystemSettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, activeTab, setActiveTab }) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-tyres', label: 'Tyre Inventory', icon: Disc },
    { id: 'admin-categories', label: 'Categories', icon: FolderKanban },
    { id: 'admin-users', label: 'User Accounts', icon: Users },
    { id: 'admin-stock', label: 'Quick Stock Update', icon: PackageCheck },
    { id: 'admin-audit', label: 'Activity Logs', icon: History },
    { id: 'admin-settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div
            onClick={() => setActiveTab(isAdmin ? 'admin-dashboard' : 'catalogue')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="h-12 sm:h-16 flex items-center group-hover:scale-105 transition duration-300">
              <img
                src={settings.company_logo || '/logo.png'}
                alt={settings.company_name}
                className="h-12 sm:h-16 max-h-16 w-auto object-contain py-1"
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
              <div className="flex items-center space-x-1 text-xs text-slate-400 font-medium">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{settings.contact_phone}</span>
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
              className="p-2.5 text-slate-300 hover:text-white rounded-xl bg-slate-900/90 border border-slate-800 shadow-md"
              aria-label="Toggle Mobile Navigation"
            >
              {mobileOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-amber-400" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800/90 px-4 py-5 space-y-3 animate-fade-in shadow-2xl">
          {!isAdmin ? (
            <>
              <button
                onClick={() => {
                  setActiveTab('catalogue');
                  setMobileOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2.5 ${
                  activeTab === 'catalogue' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-200 border border-slate-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Tyre Catalogue</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('categories');
                  setMobileOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2.5 ${
                  activeTab === 'categories' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-200 border border-slate-800'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Categories</span>
              </button>
              {currentUser && (
                <button
                  onClick={() => {
                    setActiveTab('account');
                    setMobileOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2.5 ${
                    activeTab === 'account' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-200 border border-slate-800'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>My Account</span>
                </button>
              )}
            </>
          ) : (
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold px-2 block mb-1">
                Admin Navigation
              </span>
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                      isActive ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {currentUser ? (
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-white block">{currentUser.full_name}</span>
                <span className="text-[10px] text-amber-400 uppercase font-bold">{currentUser.role}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-xs text-rose-400 font-bold px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center space-x-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setMobileOpen(false);
                }}
                className="py-2.5 text-center text-xs font-bold bg-slate-900 text-slate-200 border border-slate-800 rounded-xl"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setMobileOpen(false);
                }}
                className="py-2.5 text-center text-xs font-bold bg-amber-500 text-slate-950 rounded-xl"
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
