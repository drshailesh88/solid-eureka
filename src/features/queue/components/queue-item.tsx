'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { QueueStatus, QueueType } from '@/types';
import type { QueueEntryWithPatient } from '../api/queue';
import {
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Activity,
  CreditCard,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface QueueItemProps {
  entry: QueueEntryWithPatient;
  onStatusChange: (id: string, status: QueueStatus) => void;
  onMoveToEnd: (id: string) => void;
  onRemove: (id: string) => void;
  onPatientClick: (patientId: string) => void;
}

const statusConfig: Record<
  QueueStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  waiting: {
    label: 'WAITING',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Clock className="h-3 w-3" />,
  },
  in_progress: {
    label: 'IN ROOM',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <User className="h-3 w-3" />,
  },
  done: {
    label: 'DONE',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  no_show: {
    label: 'NO SHOW',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: <XCircle className="h-3 w-3" />,
  },
};

const typeConfig: Record<QueueType, { label: string; color: string }> = {
  scheduled: {
    label: 'SCHEDULED',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  walk_in: {
    label: 'WALK-IN',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
};

export function QueueItem({
  entry,
  onStatusChange,
  onMoveToEnd,
  onRemove,
  onPatientClick,
}: QueueItemProps) {
  const statusInfo = statusConfig[entry.status];
  const typeInfo = typeConfig[entry.type];

  return (
    <div
      className={cn(
        'group flex items-center gap-4 rounded-lg border p-3 transition-colors hover:bg-accent/50',
        entry.status === 'in_progress' && 'border-blue-300 bg-blue-50/50',
        entry.status === 'done' && 'opacity-60',
        entry.status === 'no_show' && 'opacity-40'
      )}
    >
      {/* Token Number - Large and prominent */}
      <div
        className={cn(
          'flex h-14 w-14 shrink-0 items-center justify-center rounded-lg font-bold text-2xl',
          entry.status === 'waiting' && 'bg-yellow-100 text-yellow-800',
          entry.status === 'in_progress' && 'bg-blue-100 text-blue-800',
          entry.status === 'done' && 'bg-green-100 text-green-800',
          entry.status === 'no_show' && 'bg-gray-100 text-gray-500'
        )}
      >
        {entry.token_number}
      </div>

      {/* Patient Info */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onPatientClick(entry.patient_id)}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">
            {entry.patient?.name || 'Unknown Patient'}
          </span>
          {entry.patient?.uhid && (
            <span className="text-xs text-muted-foreground">
              #{entry.patient.uhid}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {/* Status Badge */}
          <Badge
            variant="outline"
            className={cn('text-xs gap-1', statusInfo.color)}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>

          {/* Type Badge */}
          <Badge variant="outline" className={cn('text-xs', typeInfo.color)}>
            {typeInfo.label}
          </Badge>
        </div>
      </div>

      {/* Indicators */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Vitals Indicator */}
        <div
          className={cn(
            'flex items-center gap-1 text-xs',
            entry.has_vitals ? 'text-green-600' : 'text-muted-foreground'
          )}
          title={entry.has_vitals ? 'Vitals recorded' : 'No vitals'}
        >
          <Activity className="h-4 w-4" />
        </div>

        {/* Payment Indicator */}
        <div
          className={cn(
            'flex items-center gap-1 text-xs',
            entry.payment_status === 'paid'
              ? 'text-green-600'
              : entry.payment_status === 'waived'
              ? 'text-blue-600'
              : 'text-red-500'
          )}
          title={`Payment: ${entry.payment_status || 'pending'}`}
        >
          <CreditCard className="h-4 w-4" />
        </div>
      </div>

      {/* Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {entry.status === 'waiting' && (
            <DropdownMenuItem
              onClick={() => onStatusChange(entry.id, 'in_progress')}
            >
              <User className="h-4 w-4 mr-2" />
              Call Patient
            </DropdownMenuItem>
          )}
          {entry.status === 'in_progress' && (
            <DropdownMenuItem onClick={() => onStatusChange(entry.id, 'done')}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Done
            </DropdownMenuItem>
          )}
          {(entry.status === 'waiting' || entry.status === 'in_progress') && (
            <>
              <DropdownMenuItem
                onClick={() => onStatusChange(entry.id, 'no_show')}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Mark as No Show
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onMoveToEnd(entry.id)}>
                <Clock className="h-4 w-4 mr-2" />
                Move to End
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => onRemove(entry.id)}
          >
            Remove from Queue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
