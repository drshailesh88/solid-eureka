'use client';

import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AllergyBannerProps {
  allergies: string[];
  className?: string;
}

/**
 * AllergyBanner - A prominent red warning banner displaying patient allergies.
 *
 * CRITICAL SAFETY COMPONENT: Allergies can kill patients. This banner is designed
 * to be IMPOSSIBLE to miss - it uses a bright red background, warning icon, and
 * bold text to ensure healthcare providers are immediately aware of patient allergies.
 *
 * The banner only renders when the patient has allergies.
 */
export function AllergyBanner({ allergies, className }: AllergyBannerProps) {
  // Don't render if no allergies
  if (!allergies || allergies.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        // Background and text colors for maximum visibility
        'bg-[#DC2626] text-white',
        // Padding and layout
        'px-4 py-3',
        // Flexbox for icon and text alignment
        'flex items-center gap-3',
        // Make it prominent
        'rounded-lg shadow-lg',
        // Animation for attention
        'animate-pulse-subtle',
        // Typography
        'font-semibold text-sm md:text-base',
        // Border for extra emphasis
        'border-2 border-red-300',
        className
      )}
    >
      {/* Warning icon - large and visible */}
      <AlertTriangle
        className="h-6 w-6 md:h-7 md:w-7 flex-shrink-0"
        strokeWidth={2.5}
        aria-hidden="true"
      />

      {/* Allergy text */}
      <div className="flex-1 min-w-0">
        <span className="font-bold uppercase tracking-wide">
          ALLERGIES:{' '}
        </span>
        <span className="font-semibold">
          {allergies.join(', ')}
        </span>
      </div>

      {/* Additional warning icon on the right for emphasis */}
      <AlertTriangle
        className="h-6 w-6 md:h-7 md:w-7 flex-shrink-0 hidden sm:block"
        strokeWidth={2.5}
        aria-hidden="true"
      />
    </div>
  );
}

export default AllergyBanner;
