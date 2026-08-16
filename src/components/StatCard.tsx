import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'amber' | 'emerald' | 'orange' | 'rose' | 'blue' | 'purple';
  subtitle?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  onClick,
}) => {
  const colorMap = {
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:border-amber-500/40',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40',
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:border-orange-500/40',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:border-rose-500/40',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:border-blue-500/40',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:border-purple-500/40',
  };

  const iconBgMap = {
    amber: 'bg-amber-500/20 text-amber-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    orange: 'bg-orange-500/20 text-orange-400',
    rose: 'bg-rose-500/20 text-rose-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-5 rounded-2xl border transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/5' : ''
      } ${colorMap[color]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3.5 rounded-xl ${iconBgMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
