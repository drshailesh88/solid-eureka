'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, RefreshCw, Users } from 'lucide-react';
import { QueueItem } from './queue-item';
import { QueueStats } from './queue-stats';
import { AddWalkInDialog } from './add-walk-in-dialog';
import { CallNextButton } from './call-next-button';
import {
  getTodaysQueue,
  updateQueueStatus,
  moveToEndOfQueue,
  removeFromQueue,
  type QueueEntryWithPatient,
} from '../api/queue';
import { supabase } from '@/lib/supabase';
import type { QueueStatus } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface QueuePanelProps {
  className?: string;
  showCallNext?: boolean;
  showStats?: boolean;
  onCreatePatient?: () => void;
}

export function QueuePanel({
  className,
  showCallNext = true,
  showStats = true,
  onCreatePatient,
}: QueuePanelProps) {
  const router = useRouter();
  const [queue, setQueue] = useState<QueueEntryWithPatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch queue data
  const fetchQueue = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setIsRefreshing(true);

    try {
      const data = await getTodaysQueue();
      setQueue(data);
    } catch (error) {
      console.error('Failed to fetch queue:', error);
      toast.error('Failed to load queue');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  // Set up Supabase realtime subscription
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    const channel = supabase
      .channel('queue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queue',
          filter: `date=eq.${today}`,
        },
        (payload) => {
          console.log('Queue change:', payload);
          // Refresh queue on any change
          fetchQueue(false);
          setRefreshTrigger((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchQueue]);

  // Handle status change
  const handleStatusChange = async (id: string, status: QueueStatus) => {
    try {
      const result = await updateQueueStatus(id, status);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Handle move to end
  const handleMoveToEnd = async (id: string) => {
    try {
      const result = await moveToEndOfQueue(id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
    } catch (error) {
      toast.error('Failed to move patient');
    }
  };

  // Handle remove from queue
  const handleRemove = async (id: string) => {
    try {
      const result = await removeFromQueue(id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
    } catch (error) {
      toast.error('Failed to remove from queue');
    }
  };

  // Handle patient click
  const handlePatientClick = (patientId: string) => {
    router.push(`/patients/${patientId}`);
  };

  // Handle successful add
  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Handle create patient
  const handleCreatePatient = () => {
    if (onCreatePatient) {
      onCreatePatient();
    } else {
      router.push('/patients/new');
    }
  };

  // Group queue by status
  const waitingQueue = queue.filter((e) => e.status === 'waiting');
  const inProgressQueue = queue.filter((e) => e.status === 'in_progress');
  const completedQueue = queue.filter(
    (e) => e.status === 'done' || e.status === 'no_show'
  );

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>Today's Queue</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fetchQueue(false)}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={cn('h-4 w-4', isRefreshing && 'animate-spin')}
            />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Stats */}
        {showStats && (
          <QueueStats compact refreshTrigger={refreshTrigger} />
        )}

        {/* Call Next Button */}
        {showCallNext && (
          <CallNextButton
            onPatientCalled={handlePatientClick}
            disabled={waitingQueue.length === 0}
            className="w-full"
          />
        )}

        <Separator />

        {/* Queue List */}
        <ScrollArea className="flex-1 -mx-2 px-2">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <Skeleton className="h-14 w-14 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">No patients in queue</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add a walk-in patient to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* In Progress */}
              {inProgressQueue.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    In Room ({inProgressQueue.length})
                  </h4>
                  <div className="space-y-2">
                    {inProgressQueue.map((entry) => (
                      <QueueItem
                        key={entry.id}
                        entry={entry}
                        onStatusChange={handleStatusChange}
                        onMoveToEnd={handleMoveToEnd}
                        onRemove={handleRemove}
                        onPatientClick={handlePatientClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Waiting */}
              {waitingQueue.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Waiting ({waitingQueue.length})
                  </h4>
                  <div className="space-y-2">
                    {waitingQueue.map((entry) => (
                      <QueueItem
                        key={entry.id}
                        entry={entry}
                        onStatusChange={handleStatusChange}
                        onMoveToEnd={handleMoveToEnd}
                        onRemove={handleRemove}
                        onPatientClick={handlePatientClick}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed */}
              {completedQueue.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Completed ({completedQueue.length})
                  </h4>
                  <div className="space-y-2">
                    {completedQueue.map((entry) => (
                      <QueueItem
                        key={entry.id}
                        entry={entry}
                        onStatusChange={handleStatusChange}
                        onMoveToEnd={handleMoveToEnd}
                        onRemove={handleRemove}
                        onPatientClick={handlePatientClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <Separator />

        {/* Add Walk-in Button */}
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => setShowAddDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Add Walk-in Patient
        </Button>

        {/* Add Walk-in Dialog */}
        <AddWalkInDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={handleAddSuccess}
          onCreatePatient={handleCreatePatient}
        />
      </CardContent>
    </Card>
  );
}
