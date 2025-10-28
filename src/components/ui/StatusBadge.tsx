import React from 'react';

interface StatusBadgeProps {
  status: 'valid' | 'revoked' | 'not-found' | 'pending';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig = {
    valid: {
      text: 'Valid',
      classes: 'bg-green-100 text-green-600',
      icon: '✅'
    },
    revoked: {
      text: 'Revoked',
      classes: 'bg-red-100 text-red-600',
      icon: '❌'
    },
    'not-found': {
      text: 'Not Found',
      classes: 'bg-gray-100 text-gray-500',
      icon: '⚠️'
    },
    pending: {
      text: 'Pending',
      classes: 'bg-yellow-100 text-yellow-600',
      icon: '⏳'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium
      ${config.classes}
      ${className}
    `}>
      <span className="mr-1">{config.icon}</span>
      {config.text}
    </span>
  );
};