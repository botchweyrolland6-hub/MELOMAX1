import React, { useState, useEffect } from 'react';
import type { Tyre, Category, SystemSettings } from '../types';
import { X, Save, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { DEFAULT_TYRE_IMAGES } from '../data/seedData';

interface TyreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tyreData: Omit<Tyre, 'id' | 'created_at' | 'updated_at' | 'status'> & { id?: string }) => void;
  editingTyre?: Tyre | null;
  categories: Category[];
  settings: SystemSettings;
}

export const TyreFormModal: React.FC<TyreFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTyre,
  categories,
  settings,
}) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [size, setSize] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTyre) {
      setName(editingTyre.name);
      setBrand(editingTyre.brand);
      setModel(editingTyre.model);
      setSize(editingTyre.size);
      setCategoryId(editingTyre.category_id);
      setPrice(editingTyre.price.toString());
      setStockQuantity(editingTyre.stock_quantity.toString());
      setDescription(editingTyre.description);
      setImageUrl(editingTyre.image_url);
    } else {
      setName('');
      setBrand('Michelin');
      setModel('Pilot Sport');
      setSize('205/55 R16');
      setCategoryId(categories[0]?.id || '');
      setPrice('850');
      setStockQuantity('15');
      setDescription('High quality tyre engineered for maximum traction and long service life.');
      setImageUrl(DEFAULT_TYRE_IMAGES[0]);
    }
    setError('');
  }, [editingTyre, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Please enter a tyre name.');
    if (!brand.trim()) return setError('Please enter a brand.');
    if (!size.trim()) return setError('Please enter a tyre size (e.g. 205/55 R16).');
    if (!categoryId) return setError('Please select a category.');

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return setError('Please enter a valid price in GHS.');
    }

    const parsedStock = parseInt(stockQuantity, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      return setError('Please enter a valid stock quantity.');
    }

    onSave({
      id: editingTyre?.id,
      name: name.trim(),
      brand: brand.trim(),
      model: model.trim() || 'Standard',
      size: size.trim(),
      category_id: categoryId,
      price: parsedPrice,
      stock_quantity: parsedStock,
      description: description.trim(),
      image_url: imageUrl.trim() || DEFAULT_TYRE_IMAGES[0],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl p-6 rounded-3xl border border-slate-700/60 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block animate-pulse"></span>
            <span>{editingTyre ? 'Edit Tyre Specifications' : 'Add New Tyre to Inventory'}</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tyre Display Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Michelin Pilot Sport 4"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tyre Size *</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="e.g. 205/55 R16 or 385/65 x22.5"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Brand *</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Bridgestone"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Model</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Duravis R-Steer"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Price ({settings.currency}) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">{settings.currency}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="850.00"
                  className="w-full pl-14 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="10"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Image URL</label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(DEFAULT_TYRE_IMAGES[Math.floor(Math.random() * DEFAULT_TYRE_IMAGES.length)])}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl flex items-center justify-center shrink-0"
                  title="Random Automotive Image"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide key features, tread compound, road handling characteristics..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition"
            >
              <Save className="w-4 h-4" />
              <span>{editingTyre ? 'Update Tyre' : 'Save Tyre to Inventory'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
