'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDailyCollection, getPaymentsByDate } from '../api/payments';
import type { DailyCollection, Payment } from '@/types/database';
import {
  Banknote,
  Smartphone,
  CreditCard,
  Clock,
  IndianRupee
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ExportCSVButton } from './export-csv-button';

interface DailyCollectionCardProps {
  date?: string;
  compact?: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function DailyCollectionCard({
  date,
  compact = false
}: DailyCollectionCardProps) {
  const [collection, setCollection] = useState<DailyCollection | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const targetDate = date || new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchCollection = async () => {
      setIsLoading(true);
      try {
        const [collectionData, paymentsData] = await Promise.all([
          getDailyCollection(targetDate),
          getPaymentsByDate(targetDate)
        ]);
        setCollection(collectionData);
        setPayments(paymentsData);
      } catch (error) {
        console.error('Failed to fetch daily collection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollection();
  }, [targetDate]);

  if (isLoading) {
    return (
      <Card className={compact ? 'py-3' : ''}>
        <CardHeader className={compact ? 'pb-2 pt-0' : ''}>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className={compact ? 'pb-0' : ''}>
          <Skeleton className="h-8 w-24 mb-2" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!collection) {
    return null;
  }

  if (compact) {
    return (
      <Card className="py-3">
        <CardContent className="pb-0 pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">
                {formatCurrency(collection.total)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Banknote className="h-4 w-4" />
                {formatCurrency(collection.cash)}
              </span>
              <span className="flex items-center gap-1">
                <Smartphone className="h-4 w-4" />
                {formatCurrency(collection.upi)}
              </span>
              {collection.pending_count > 0 && (
                <span className="flex items-center gap-1 text-yellow-600">
                  <Clock className="h-4 w-4" />
                  {collection.pending_count}
                </span>
              )}
              <ExportCSVButton
                payments={payments}
                date={targetDate}
                variant="ghost"
                size="icon"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Today&apos;s Collection
          </CardTitle>
          <ExportCSVButton payments={payments} date={targetDate} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary mb-4">
          {formatCurrency(collection.total)}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-md">
              <Banknote className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cash</p>
              <p className="font-semibold">{formatCurrency(collection.cash)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
              <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">UPI</p>
              <p className="font-semibold">{formatCurrency(collection.upi)}</p>
            </div>
          </div>

          {collection.card > 0 && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-md">
                <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Card</p>
                <p className="font-semibold">
                  {formatCurrency(collection.card)}
                </p>
              </div>
            </div>
          )}

          {collection.pending_count > 0 && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-md">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="font-semibold">
                  {collection.pending_count} patient
                  {collection.pending_count !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
