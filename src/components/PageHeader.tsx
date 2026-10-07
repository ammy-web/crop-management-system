import React from 'react';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  badgeCount?: number;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  badgeCount,
  children,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {badgeCount !== undefined && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 border border-primary-200">
              {badgeCount} total
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        {children}
        {actionLabel && onAction && (
          <button onClick={onAction} className="btn-primary shrink-0">
            <Plus size={18} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
