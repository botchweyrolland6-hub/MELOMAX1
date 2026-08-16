import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Disc,
  FolderKanban,
  Users,
  PackageCheck,
  Settings as SettingsIcon,
  LogOut,
  FileSpreadsheet,
  History,
  Store,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (col: boolean) => void;
  lowStockCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  lowStockCount = 0,
}) => {
  const { currentUser, logout } = useAuth();

  const navItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-tyres', label: 'Tyre Inventory', icon: Disc, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { id: 'admin-categories', label: 'Categories', icon: FolderKanban },
    { id: 'admin-users', label: 'User Accounts', icon: Users },
    { id: 'admin-stock', label: 'Quick Stock Update', icon: PackageCheck },
    { id: 'admin-audit', label: 'Activity Logs', icon: History },
    { id: 'admin-settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside
      className={`fixed left-0 top-20 bottom-0 z-30 bg-slate-950/95 border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      } hidden md:flex`}
    >
      {/* Top Toggle Button */}
      <div className="p-3 border-b border-slate-900 flex items-center justify-between">
        {!collapsed && (
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 pl-2">
            Admin Workspace
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition mx-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Nav Items */}
      <div className="p-3 space-y-1 overflow-y-auto flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${
                collapsed ? 'justify-center px-0' : 'justify-between px-3'
              } py-3 rounded-2xl text-xs font-bold transition duration-200 group relative ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-slate-950' : 'group-hover:text-amber-400'}`} />
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && item.badge !== undefined && (
                <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {item.badge}
                </span>
              )}

              {collapsed && item.badge !== undefined && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-900">
          <button
            onClick={() => setActiveTab('catalogue')}
            className={`w-full flex items-center ${
              collapsed ? 'justify-center px-0' : 'px-3'
            } py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition`}
          >
            <Store className="w-4 h-4 shrink-0 text-blue-400" />
            {!collapsed && <span className="ml-3">View Public Store</span>}
          </button>
        </div>
      </div>

      {/* Admin User Footer & Logout */}
      <div className="p-3 border-t border-slate-900 bg-slate-900/40">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="truncate mr-2">
              <span className="block text-xs font-bold text-white truncate">{currentUser?.full_name}</span>
              <span className="block text-[10px] text-amber-400 truncate">{currentUser?.email}</span>
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
          <button
            onClick={logout}
            className="w-full flex justify-center p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
};
