'use client';

import { Chrono } from 'react-chrono';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Stethoscope, FlaskConical, Pill } from 'lucide-react';
import type { TimelineEvent } from '@/types/database';

interface PatientTimelineProps {
  events: TimelineEvent[];
  mode?: 'VERTICAL' | 'VERTICAL_ALTERNATING' | 'HORIZONTAL';
}

// Map event types to icons and colors
const eventTypeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  visit: { icon: <Stethoscope className="h-4 w-4" />, color: 'bg-blue-500' },
  prescription: { icon: <Pill className="h-4 w-4" />, color: 'bg-green-500' },
  lab: { icon: <FlaskConical className="h-4 w-4" />, color: 'bg-purple-500' },
  document: { icon: <FileText className="h-4 w-4" />, color: 'bg-orange-500' },
  default: { icon: <FileText className="h-4 w-4" />, color: 'bg-gray-500' }
};

export function PatientTimeline({ events, mode = 'VERTICAL' }: PatientTimelineProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No timeline events yet. Upload documents or create visits to see history.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format events for react-chrono
  const chronoItems = events.map((event) => {
    const config = eventTypeConfig[event.event_type] || eventTypeConfig.default;
    return {
      title: new Date(event.event_date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      cardTitle: event.event_title,
      cardSubtitle: event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1),
      cardDetailedText: event.event_text || ''
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Patient Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <Chrono
            items={chronoItems}
            mode={mode}
            cardHeight={100}
            scrollable
            useReadMore={false}
            disableToolbar
            theme={{
              primary: 'hsl(var(--primary))',
              secondary: 'hsl(var(--secondary))',
              cardBgColor: 'hsl(var(--card))',
              titleColor: 'hsl(var(--foreground))',
              titleColorActive: 'hsl(var(--primary))'
            }}
            fontSizes={{
              cardSubtitle: '0.75rem',
              cardText: '0.875rem',
              cardTitle: '1rem',
              title: '0.875rem'
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Simple list view alternative (lighter weight)
export function PatientTimelineList({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No timeline events yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const config = eventTypeConfig[event.event_type] || eventTypeConfig.default;
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="flex gap-4">
            {/* Timeline line and dot */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full ${config.color} flex items-center justify-center text-white`}
              >
                {config.icon}
              </div>
              {!isLast && <div className="w-0.5 flex-1 bg-border mt-2" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">
                  {new Date(event.event_date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <Badge variant="outline" className="text-xs">
                  {event.event_type}
                </Badge>
              </div>
              <h4 className="font-medium">{event.event_title}</h4>
              {event.event_text && (
                <p className="text-sm text-muted-foreground mt-1">
                  {event.event_text}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
