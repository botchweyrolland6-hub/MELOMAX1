import React from 'react';
import type { TyreStatus } from '../types';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: TyreStatus;
  stock?: number;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, stock }) => {
  if (status === 'in_stock') {
    return (
      <span className="badge-in-stock">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>In Stock {stock !== undefined && `(${stock})`}</span>
      </span>
    );
  }

  if (status === 'low_stock') {
    return (
      <span className="badge-low-stock">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>Low Stock {stock !== undefined && `(${stock})`}</span>
      </span>
    );
  }

  return (
    <span className="badge-out-of-stock">
      <XCircle className="w-3.5 h-3.5" />
      <span>Out of Stock</span>
    </span>
  );
};
