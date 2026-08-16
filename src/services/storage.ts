import type { Category, Tyre, User, SystemSettings, AuditLog, InventoryStats } from '../types';
import { INITIAL_CATEGORIES, INITIAL_TYRES, INITIAL_USERS, INITIAL_SETTINGS, INITIAL_AUDIT_LOGS } from '../data/seedData';

const DB_VERSION = 'v8_footer_location_update';

const KEYS = {
  VERSION: 'melomax_db_version',
  TYRES: 'melomax_tyres_db',
  CATEGORIES: 'melomax_categories_db',
  USERS: 'melomax_users_db',
  SETTINGS: 'melomax_settings_db',
  LOGS: 'melomax_logs_db',
  SESSION: 'melomax_current_session',
};

class LocalStorageEngine {
  constructor() {
    this.init();
  }

  private init() {
    const currentVer = localStorage.getItem(KEYS.VERSION);
    if (currentVer !== DB_VERSION) {
      localStorage.setItem(KEYS.VERSION, DB_VERSION);
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      localStorage.setItem(KEYS.TYRES, JSON.stringify(INITIAL_TYRES));
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem(KEYS.LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
  }

  // --- TYRE CRUD ---
  getTyres(): Tyre[] {
    const data = localStorage.getItem(KEYS.TYRES);
    return data ? JSON.parse(data) : INITIAL_TYRES;
  }

  getTyreById(id: string): Tyre | undefined {
    return this.getTyres().find((t) => t.id === id);
  }

  saveTyre(tyre: Omit<Tyre, 'id' | 'created_at' | 'updated_at' | 'status'> & { id?: string }): Tyre {
    const tyres = this.getTyres();
    const categories = this.getCategories();
    const settings = this.getSettings();

    const category = categories.find(c => c.id === tyre.category_id);
    const categoryName = category ? category.name : 'Uncategorized';

    let status: Tyre['status'] = 'in_stock';
    if (tyre.stock_quantity === 0) {
      status = 'out_of_stock';
    } else if (tyre.stock_quantity <= settings.low_stock_threshold) {
      status = 'low_stock';
    }

    const now = new Date().toISOString();

    if (tyre.id) {
      const index = tyres.findIndex(t => t.id === tyre.id);
      if (index !== -1) {
        const updated: Tyre = {
          ...tyres[index],
          ...tyre,
          category_name: categoryName,
          status,
          updated_at: now,
        };
        tyres[index] = updated;
        localStorage.setItem(KEYS.TYRES, JSON.stringify(tyres));
        this.addAuditLog('UPDATE_TYRE', updated.name, `Updated price to GH₵ ${updated.price.toFixed(2)}, stock: ${updated.stock_quantity}`);
        return updated;
      }
    }

    const newTyre: Tyre = {
      ...tyre,
      id: `tyre-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      category_name: categoryName,
      status,
      created_at: now,
      updated_at: now,
    };

    tyres.unshift(newTyre);
    localStorage.setItem(KEYS.TYRES, JSON.stringify(tyres));
    this.addAuditLog('ADD_TYRE', newTyre.name, `Added tyre size ${newTyre.size} at GH₵ ${newTyre.price.toFixed(2)}`);
    return newTyre;
  }

  deleteTyre(id: string): boolean {
    const tyres = this.getTyres();
    const target = tyres.find(t => t.id === id);
    if (!target) return false;

    const filtered = tyres.filter(t => t.id !== id);
    localStorage.setItem(KEYS.TYRES, JSON.stringify(filtered));
    this.addAuditLog('DELETE_TYRE', target.name, `Removed tyre size ${target.size} from inventory`);
    return true;
  }

  updateStock(id: string, newStock: number): Tyre | null {
    const tyres = this.getTyres();
    const index = tyres.findIndex(t => t.id === id);
    if (index === -1) return null;

    const settings = this.getSettings();
    let status: Tyre['status'] = 'in_stock';
    if (newStock <= 0) status = 'out_of_stock';
    else if (newStock <= settings.low_stock_threshold) status = 'low_stock';

    tyres[index].stock_quantity = Math.max(0, newStock);
    tyres[index].status = status;
    tyres[index].updated_at = new Date().toISOString();

    localStorage.setItem(KEYS.TYRES, JSON.stringify(tyres));
    this.addAuditLog('UPDATE_STOCK', tyres[index].name, `Stock adjusted to ${newStock} (${status.replace('_', ' ')})`);
    return tyres[index];
  }

  // --- CATEGORIES CRUD ---
  getCategories(): Category[] {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : INITIAL_CATEGORIES;
  }

  saveCategory(cat: Omit<Category, 'id' | 'created_at'> & { id?: string }): Category {
    const categories = this.getCategories();
    const now = new Date().toISOString();

    if (cat.id) {
      const idx = categories.findIndex(c => c.id === cat.id);
      if (idx !== -1) {
        categories[idx] = { ...categories[idx], ...cat };
        localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
        this.addAuditLog('UPDATE_CATEGORY', cat.name, 'Category details updated');
        return categories[idx];
      }
    }

    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`,
      created_at: now,
    };
    categories.push(newCat);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
    this.addAuditLog('ADD_CATEGORY', newCat.name, 'New category created');
    return newCat;
  }

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const target = categories.find(c => c.id === id);
    if (!target) return false;

    const tyres = this.getTyres();
    const linkedCount = tyres.filter(t => t.category_id === id).length;
    if (linkedCount > 0) {
      throw new Error(`Cannot delete category "${target.name}" because ${linkedCount} tyres belong to it.`);
    }

    const filtered = categories.filter(c => c.id !== id);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(filtered));
    this.addAuditLog('DELETE_CATEGORY', target.name, 'Category deleted');
    return true;
  }

  // --- USERS MANAGEMENT ---
  getUsers(): User[] {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : INITIAL_USERS;
  }

  toggleUserStatus(id: string): User | null {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;

    if (users[idx].role === 'admin') {
      throw new Error('Administrator status cannot be disabled.');
    }

    users[idx].status = users[idx].status === 'active' ? 'disabled' : 'active';
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    this.addAuditLog('USER_STATUS_CHANGE', users[idx].email, `Account status set to ${users[idx].status}`);
    return users[idx];
  }

  deleteUser(id: string): boolean {
    const users = this.getUsers();
    const target = users.find(u => u.id === id);
    if (!target) return false;
    if (target.role === 'admin') {
      throw new Error('Administrator accounts cannot be deleted.');
    }

    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(KEYS.USERS, JSON.stringify(filtered));
    this.addAuditLog('DELETE_USER', target.email, `User ${target.full_name} deleted`);
    return true;
  }

  // --- STATS ---
  getStats(): InventoryStats {
    const tyres = this.getTyres();
    const categories = this.getCategories();
    const users = this.getUsers();
    const settings = this.getSettings();

    let available = 0;
    let lowStock = 0;
    let outOfStock = 0;

    tyres.forEach(t => {
      if (t.stock_quantity === 0) outOfStock++;
      else if (t.stock_quantity <= settings.low_stock_threshold) {
        lowStock++;
        available++;
      } else {
        available++;
      }
    });

    return {
      total_tyres: tyres.length,
      available_tyres: available,
      low_stock_tyres: lowStock,
      out_of_stock_tyres: outOfStock,
      total_categories: categories.length,
      total_users: users.length,
    };
  }

  // --- SETTINGS ---
  getSettings(): SystemSettings {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
  }

  saveSettings(newSettings: Partial<SystemSettings>): SystemSettings {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));

    if (newSettings.low_stock_threshold !== undefined) {
      const tyres = this.getTyres();
      tyres.forEach(t => {
        if (t.stock_quantity === 0) t.status = 'out_of_stock';
        else if (t.stock_quantity <= updated.low_stock_threshold) t.status = 'low_stock';
        else t.status = 'in_stock';
      });
      localStorage.setItem(KEYS.TYRES, JSON.stringify(tyres));
    }

    this.addAuditLog('UPDATE_SETTINGS', 'System Settings', 'Company details and inventory threshold updated');
    return updated;
  }

  // --- AUDIT LOGS ---
  getAuditLogs(): AuditLog[] {
    const data = localStorage.getItem(KEYS.LOGS);
    return data ? JSON.parse(data) : INITIAL_AUDIT_LOGS;
  }

  addAuditLog(action: string, item: string, details: string) {
    const sessionStr = localStorage.getItem(KEYS.SESSION);
    const sessionUser = sessionStr ? JSON.parse(sessionStr) : null;
    const adminEmail = sessionUser ? sessionUser.email : 'melomax@gmail.com';

    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      admin_email: adminEmail,
      action,
      item,
      details,
      created_at: new Date().toISOString(),
    };

    logs.unshift(newLog);
    if (logs.length > 200) logs.pop();
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  }

  // --- CSV UTILITIES ---
  exportTyresToCsv(): string {
    const tyres = this.getTyres();
    const headers = ['Tyre Name', 'Brand', 'Model', 'Size', 'Category', 'Price (GHS)', 'Stock Quantity', 'Status', 'Description'];
    const rows = tyres.map(t => [
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.brand.replace(/"/g, '""')}"`,
      `"${t.model.replace(/"/g, '""')}"`,
      `"${t.size.replace(/"/g, '""')}"`,
      `"${(t.category_name || '').replace(/"/g, '""')}"`,
      t.price,
      t.stock_quantity,
      t.status,
      `"${t.description.replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  importTyresFromCsv(csvText: string): { imported: number; errors: string[] } {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length <= 1) {
      throw new Error('CSV file is empty or missing data rows.');
    }

    const categories = this.getCategories();
    let imported = 0;
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
      if (parts.length < 5) {
        errors.push(`Line ${i + 1}: Invalid CSV format.`);
        continue;
      }

      const cleanParts = parts.map(p => p.replace(/^"|"$/g, '').trim());
      const [name, brand, model, size, categoryName, priceStr, stockStr] = cleanParts;

      const price = parseFloat(priceStr);
      const stock = parseInt(stockStr || '10', 10);

      if (isNaN(price) || price < 0) {
        errors.push(`Line ${i + 1}: Invalid price "${priceStr}".`);
        continue;
      }

      let category = categories.find(c => c.name.toLowerCase() === (categoryName || '').toLowerCase());
      if (!category) {
        category = this.saveCategory({
          name: categoryName || 'RIM 16 (COMMERCIAL)',
          description: 'Imported via CSV',
        });
      }

      this.saveTyre({
        name: name || `Tyre ${size}`,
        brand: brand || 'MeloMax',
        model: model || 'Standard',
        size: size || '205/55 R16',
        category_id: category.id,
        price,
        stock_quantity: isNaN(stock) ? 10 : stock,
        description: `Imported inventory size ${size}`,
        image_url: '/tyre1.png',
      });

      imported++;
    }

    this.addAuditLog('CSV_IMPORT', 'Bulk Inventory', `Successfully imported ${imported} tyres from CSV file.`);
    return { imported, errors };
  }

  resetToDefaultData() {
    localStorage.setItem(KEYS.VERSION, DB_VERSION);
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(KEYS.TYRES, JSON.stringify(INITIAL_TYRES));
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(KEYS.LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  }
}

export const storageEngine = new LocalStorageEngine();
