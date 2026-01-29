'use client';

import { cn } from '@/lib/utils';

type PaymentStatus = 'pending' | 'paid' | 'waived';

interface PaymentBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  paid: {
    label: 'PAID',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  },
  pending: {
    label: 'PENDING',
    className:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  },
  waived: {
    label: 'WAIVED',
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
};

export function PaymentBadge({ status, className }: PaymentBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
