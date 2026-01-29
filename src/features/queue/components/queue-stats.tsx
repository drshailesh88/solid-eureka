'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { getQueueStats, type QueueStats as QueueStatsType } from '../api/queue';
import { cn } from '@/lib/utils';

interface QueueStatsProps {
  className?: string;
  compact?: boolean;
  refreshTrigger?: number;
}

export function QueueStats({
  className,
  compact = false,
  refreshTrigger,
}: QueueStatsProps) {
  const [stats, setStats] = useState<QueueStatsType>({
    total_today: 0,
    waiting: 0,
    in_progress: 0,
    done: 0,
    no_show: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getQueueStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch queue stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [refreshTrigger]);

  if (compact) {
    return (
      <div className={cn('flex items-center gap-4 text-sm', className)}>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="font-medium">{stats.done}</span>
          <span className="text-muted-foreground">seen</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-yellow-600" />
          <span className="font-medium">{stats.waiting}</span>
          <span className="text-muted-foreground">waiting</span>
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Today's Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Total */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total_today}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>

          {/* Waiting */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-100">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.waiting}</p>
              <p className="text-xs text-muted-foreground">Waiting</p>
            </div>
          </div>

          {/* Done */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.done}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>

          {/* No Show */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <XCircle className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.no_show}</p>
              <p className="text-xs text-muted-foreground">No Show</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
