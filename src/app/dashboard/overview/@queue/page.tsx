'use client';

import { QueuePanel } from '@/features/queue/components/queue-panel';

export default function QueueSlot() {
  return <QueuePanel className="h-full" showStats={true} showCallNext={true} />;
}
