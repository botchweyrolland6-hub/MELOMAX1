import React from 'react';
import type { Category, Tyre } from '../types';
import { FolderKanban, Plus, Edit, Trash2, Tag, Layers } from 'lucide-react';

interface AdminCategoriesProps {
  categories: Category[];
  tyres: Tyre[];
  onOpenAddCategory: () => void;
  onEditCategory: (cat: Category) => void;
  onDeleteCategory: (id: string, name: string) => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  tyres,
  onOpenAddCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <FolderKanban className="w-6 h-6 text-amber-500" />
            <span>Tyre Category Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize tyre inventory by rim size, vehicle class, and commercial application.
          </p>
        </div>

        <button
          onClick={onOpenAddCategory}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const categoryTyres = tyres.filter((t) => t.category_id === cat.id);
          const totalStock = categoryTyres.reduce((sum, t) => sum + t.stock_quantity, 0);

          return (
            <div
              key={cat.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-amber-500/30 transition duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Tag className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition">
                      {cat.name}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-amber-400 text-xs font-mono font-bold">
                    {categoryTyres.length} Models
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {cat.description || 'Standard vehicle tyre category.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  <span>Total Stock: <strong className="text-slate-200">{totalStock} units</strong></span>
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEditCategory(cat)}
                    className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat.id, cat.name)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
