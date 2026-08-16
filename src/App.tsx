import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { storageEngine } from './services/storage';
import type { Tyre, Category, SystemSettings, InventoryStats, User, AuditLog } from './types';

// Components
import { Navbar } from './components/Navbar';
import { AdminSidebar } from './components/AdminSidebar';
import { ConfirmModal } from './components/ConfirmModal';
import { TyreFormModal } from './components/TyreFormModal';
import { CategoryFormModal } from './components/CategoryFormModal';
import { TyreDetailModal } from './components/TyreDetailModal';
import { CsvModal } from './components/CsvModal';

// Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminTyres } from './pages/AdminTyres';
import { AdminCategories } from './pages/AdminCategories';
import { AdminUsers } from './pages/AdminUsers';
import { AdminStockUpdate } from './pages/AdminStockUpdate';
import { AdminAuditLogs } from './pages/AdminAuditLogs';
import { AdminSettings } from './pages/AdminSettings';
import { UserCatalogue } from './pages/UserCatalogue';
import { UserAccount } from './pages/UserAccount';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { CheckCircle2, AlertCircle } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser, isAdmin, loading } = useAuth();
  // Default to 'login' page FIRST as requested by user
  const [activeTab, setActiveTab] = useState<string>('login');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Dynamic Data State
  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(storageEngine.getSettings());
  const [stats, setStats] = useState<InventoryStats>(storageEngine.getStats());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Modals state
  const [isTyreModalOpen, setIsTyreModalOpen] = useState(false);
  const [editingTyre, setEditingTyre] = useState<Tyre | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [detailTyre, setDetailTyre] = useState<Tyre | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isCsvOpen, setIsCsvOpen] = useState(false);

  // Confirm delete modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Toast notifications
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const refreshAllData = () => {
    setTyres(storageEngine.getTyres());
    setCategories(storageEngine.getCategories());
    setUsers(storageEngine.getUsers());
    setSettings(storageEngine.getSettings());
    setStats(storageEngine.getStats());
    setAuditLogs(storageEngine.getAuditLogs());
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Update tab based on authentication state
  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        if (isAdmin && activeTab === 'login') {
          setActiveTab('admin-dashboard');
        } else if (!isAdmin && (activeTab === 'login' || activeTab === 'register')) {
          setActiveTab('catalogue');
        }
      } else {
        // If not logged in, force login screen
        if (activeTab.startsWith('admin-') || activeTab === 'account') {
          setActiveTab('login');
        }
      }
    }
  }, [currentUser, isAdmin, loading]);

  // Protect admin routes
  useEffect(() => {
    if (activeTab.startsWith('admin-') && !isAdmin) {
      showToast('Access Denied: Administrator role required.', 'error');
      setActiveTab('login');
    }
  }, [activeTab, isAdmin]);

  // --- HANDLERS ---
  const handleSaveTyre = (tyreData: Omit<Tyre, 'id' | 'created_at' | 'updated_at' | 'status'> & { id?: string }) => {
    try {
      const saved = storageEngine.saveTyre(tyreData);
      refreshAllData();
      showToast(tyreData.id ? `Updated ${saved.name}` : `Added ${saved.name} to inventory!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save tyre.', 'error');
    }
  };

  const handleDeleteTyre = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Tyre from Inventory',
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      onConfirm: () => {
        storageEngine.deleteTyre(id);
        refreshAllData();
        showToast(`Deleted ${name} from inventory.`);
      },
    });
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    storageEngine.updateStock(id, newStock);
    refreshAllData();
    showToast('Stock quantity updated!');
  };

  const handleSaveCategory = (catData: Omit<Category, 'id' | 'created_at'> & { id?: string }) => {
    try {
      const saved = storageEngine.saveCategory(catData);
      refreshAllData();
      showToast(`Category "${saved.name}" saved!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save category.', 'error');
    }
  };

  const handleDeleteCategory = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Tyre Category',
      message: `Are you sure you want to delete the category "${name}"?`,
      onConfirm: () => {
        try {
          storageEngine.deleteCategory(id);
          refreshAllData();
          showToast(`Deleted category "${name}".`);
        } catch (err: any) {
          showToast(err.message, 'error');
        }
      },
    });
  };

  const handleToggleUserStatus = (id: string) => {
    try {
      const updated = storageEngine.toggleUserStatus(id);
      refreshAllData();
      if (updated) {
        showToast(`Account status for ${updated.full_name} set to ${updated.status.toUpperCase()}`);
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteUser = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Customer Account',
      message: `Are you sure you want to delete user account "${name}"?`,
      onConfirm: () => {
        try {
          storageEngine.deleteUser(id);
          refreshAllData();
          showToast(`User ${name} deleted.`);
        } catch (err: any) {
          showToast(err.message, 'error');
        }
      },
    });
  };

  const handleSaveSettings = (newSettings: Partial<SystemSettings>) => {
    storageEngine.saveSettings(newSettings);
    refreshAllData();
    showToast('System configuration saved!');
  };

  const handleResetDemoData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Inventory to Initial 170 Tyres',
      message: 'Are you sure you want to reset all inventory and category data back to the default 170 tyre sizes?',
      onConfirm: () => {
        storageEngine.resetToDefaultData();
        refreshAllData();
        showToast('Sample dataset restored!');
      },
    });
  };

  const handleOrderInquiry = (tyre: Tyre) => {
    setIsDetailOpen(false);
    showToast(`Order request submitted for ${tyre.name}! MeloMax sales team will contact you shortly.`);
  };

  const isAdminTab = activeTab.startsWith('admin-') && isAdmin;

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center space-x-2.5 ${
              toast.type === 'success'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-rose-600 text-white border-rose-500'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar settings={settings} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Layout Wrapper */}
      <div className="flex-1 flex">
        {/* Admin Sidebar */}
        {isAdminTab && (
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            lowStockCount={stats.low_stock_tyres}
          />
        )}

        {/* Content Area */}
        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
            isAdminTab ? (sidebarCollapsed ? 'md:ml-20' : 'md:ml-64') : ''
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {/* ADMIN PAGES */}
            {activeTab === 'admin-dashboard' && isAdmin && (
              <AdminDashboard
                stats={stats}
                tyres={tyres}
                categories={categories}
                settings={settings}
                auditLogs={auditLogs}
                setActiveTab={setActiveTab}
                onOpenAddModal={() => {
                  setEditingTyre(null);
                  setIsTyreModalOpen(true);
                }}
                onOpenCsvModal={() => setIsCsvOpen(true)}
                onSelectTyre={(tyre) => {
                  setDetailTyre(tyre);
                  setIsDetailOpen(true);
                }}
              />
            )}

            {activeTab === 'admin-tyres' && isAdmin && (
              <AdminTyres
                tyres={tyres}
                categories={categories}
                settings={settings}
                onOpenAddModal={() => {
                  setEditingTyre(null);
                  setIsTyreModalOpen(true);
                }}
                onEditTyre={(tyre) => {
                  setEditingTyre(tyre);
                  setIsTyreModalOpen(true);
                }}
                onDeleteTyre={handleDeleteTyre}
                onViewTyre={(tyre) => {
                  setDetailTyre(tyre);
                  setIsDetailOpen(true);
                }}
                onUpdateStock={handleUpdateStock}
                onOpenCsvModal={() => setIsCsvOpen(true)}
              />
            )}

            {activeTab === 'admin-categories' && isAdmin && (
              <AdminCategories
                categories={categories}
                tyres={tyres}
                onOpenAddCategory={() => {
                  setEditingCategory(null);
                  setIsCategoryModalOpen(true);
                }}
                onEditCategory={(cat) => {
                  setEditingCategory(cat);
                  setIsCategoryModalOpen(true);
                }}
                onDeleteCategory={handleDeleteCategory}
              />
            )}

            {activeTab === 'admin-users' && isAdmin && (
              <AdminUsers
                users={users}
                onToggleStatus={handleToggleUserStatus}
                onDeleteUser={handleDeleteUser}
              />
            )}

            {activeTab === 'admin-stock' && isAdmin && (
              <AdminStockUpdate
                tyres={tyres}
                settings={settings}
                onUpdateStock={handleUpdateStock}
              />
            )}

            {activeTab === 'admin-audit' && isAdmin && <AdminAuditLogs logs={auditLogs} />}

            {activeTab === 'admin-settings' && isAdmin && (
              <AdminSettings
                settings={settings}
                onSaveSettings={handleSaveSettings}
                onResetDemoData={handleResetDemoData}
              />
            )}

            {/* CUSTOMER / PUBLIC PAGES */}
            {activeTab === 'catalogue' && (
              <UserCatalogue
                tyres={tyres}
                categories={categories}
                settings={settings}
                onSelectTyre={(tyre) => {
                  setDetailTyre(tyre);
                  setIsDetailOpen(true);
                }}
              />
            )}

            {activeTab === 'categories' && (
              <AdminCategories
                categories={categories}
                tyres={tyres}
                onOpenAddCategory={() => {
                  if (isAdmin) {
                    setEditingCategory(null);
                    setIsCategoryModalOpen(true);
                  } else {
                    showToast('Admin login required to manage categories.', 'error');
                  }
                }}
                onEditCategory={(cat) => {
                  if (isAdmin) {
                    setEditingCategory(cat);
                    setIsCategoryModalOpen(true);
                  } else {
                    showToast('Admin login required.', 'error');
                  }
                }}
                onDeleteCategory={(id, name) => {
                  if (isAdmin) handleDeleteCategory(id, name);
                  else showToast('Admin login required.', 'error');
                }}
              />
            )}

            {activeTab === 'account' && <UserAccount />}
            {activeTab === 'login' && <LoginPage settings={settings} setActiveTab={setActiveTab} />}
            {activeTab === 'register' && <RegisterPage settings={settings} setActiveTab={setActiveTab} />}
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-950/80 backdrop-blur-md border-t border-slate-900 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-200">
            © {new Date().getFullYear()} {settings.company_name} — Professional Tyre Management System
          </p>
          <p className="text-[11px] text-slate-400">
            Takoradi, Ghana | {settings.contact_email} | {settings.contact_phone}
          </p>
          <p className="text-[11px] text-amber-400 font-semibold pt-1">
            Developed by <span className="font-extrabold text-amber-300">Rolland Botchwey</span>
          </p>
        </div>
      </footer>

      {/* ALL MODALS */}
      <TyreFormModal
        isOpen={isTyreModalOpen}
        onClose={() => setIsTyreModalOpen(false)}
        onSave={handleSaveTyre}
        editingTyre={editingTyre}
        categories={categories}
        settings={settings}
      />

      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
      />

      <TyreDetailModal
        tyre={detailTyre}
        settings={settings}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOrderInquiry={handleOrderInquiry}
      />

      <CsvModal
        isOpen={isCsvOpen}
        onClose={() => setIsCsvOpen(false)}
        onRefreshData={refreshAllData}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
