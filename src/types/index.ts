export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'disabled';
export type TyreStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Tyre {
  id: string;
  name: string;
  brand: string;
  model: string;
  size: string;
  category_id: string;
  category_name?: string;
  price: number; // In GHS
  stock_quantity: number;
  description: string;
  image_url: string;
  status: TyreStatus;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  admin_email: string;
  action: string;
  item: string;
  details: string;
  created_at: string;
}

export interface SystemSettings {
  company_name: string;
  company_logo: string;
  contact_email: string;
  contact_phone: string;
  currency: string; // e.g. "GHS"
  low_stock_threshold: number; // e.g. 5
  supabase_url?: string;
  supabase_anon_key?: string;
}

export interface InventoryStats {
  total_tyres: number;
  available_tyres: number;
  low_stock_tyres: number;
  out_of_stock_tyres: number;
  total_categories: number;
  total_users: number;
}
