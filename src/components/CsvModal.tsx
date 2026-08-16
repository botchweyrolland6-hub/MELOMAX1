import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { storageEngine } from '../services/storage';

interface CsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const CsvModal: React.FC<CsvModalProps> = ({ isOpen, onClose, onRefreshData }) => {
  const [csvText, setCsvText] = useState('');
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const csvData = storageEngine.exportTyresToCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `melomax_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setResultMessage({ type: 'success', text: 'Inventory exported to CSV successfully.' });
  };

  const handleSampleCsv = () => {
    const sample = `Tyre Name,Brand,Model,Size,Category,Price (GHS),Stock Quantity,Description
"Michelin Pilot Sport 5","Michelin","Pilot Sport","225/45 R18","RIM 18 (PRIVATE)",950.00,12,"Premium high performance passenger tyre"
"Bridgestone Duravis","Bridgestone","R-Steer","385/65 x22.5","RIM 22.5",1500.00,20,"Commercial truck steer axle tyre"
"Dunlop Grandtrek","Dunlop","AT5","285/70 x17","RIM 17 (4X4)",750.00,8,"All terrain 4x4 rugged tyre"`;
    setCsvText(sample);
  };

  const handleImport = () => {
    if (!csvText.trim()) {
      return setResultMessage({ type: 'error', text: 'Please paste CSV data or choose sample template.' });
    }

    try {
      const { imported, errors } = storageEngine.importTyresFromCsv(csvText);
      onRefreshData();
      if (errors.length > 0) {
        setResultMessage({
          type: 'error',
          text: `Imported ${imported} items with warnings: ${errors.join(' ')}`,
        });
      } else {
        setResultMessage({
          type: 'success',
          text: `Successfully imported ${imported} tyres into MeloMax inventory!`,
        });
        setCsvText('');
      }
    } catch (err: any) {
      setResultMessage({ type: 'error', text: err.message || 'Failed to parse CSV input.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvText(event.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-xl p-6 rounded-3xl border border-slate-700/60 shadow-2xl space-y-5 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-500" />
            <span>CSV Inventory Import & Export</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {resultMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 ${
              resultMessage.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
            }`}
          >
            {resultMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{resultMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs">
          <button
            onClick={handleExport}
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-200 font-semibold flex items-center justify-center space-x-2 transition"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Current CSV</span>
          </button>

          <button
            onClick={handleSampleCsv}
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-200 font-semibold flex items-center justify-center space-x-2 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>Load Sample CSV</span>
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <label className="block text-slate-300 font-semibold">Upload CSV File or Paste Raw Content</label>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
            className="w-full text-slate-400 text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700 cursor-pointer"
          />
          <textarea
            rows={6}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="Tyre Name,Brand,Model,Size,Category,Price (GHS),Stock Quantity,Description..."
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-300 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleImport}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Import CSV to Inventory</span>
          </button>
        </div>
      </div>
    </div>
  );
};
