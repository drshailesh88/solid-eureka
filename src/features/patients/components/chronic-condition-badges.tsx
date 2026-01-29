'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ChronicConditionBadgesProps {
  conditions: string[];
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

/**
 * Color mapping for common chronic conditions.
 * Each condition is assigned a specific color for quick visual identification.
 */
const conditionColors: Record<string, string> = {
  // Diabetes variations - Blue
  'diabetes': 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600',
  'diabetes mellitus': 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600',
  'type 1 diabetes': 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600',
  'type 2 diabetes': 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600',
  'dm': 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600',

  // Hypertension variations - Red
  'hypertension': 'bg-red-500 hover:bg-red-600 text-white border-red-600',
  'htn': 'bg-red-500 hover:bg-red-600 text-white border-red-600',
  'high blood pressure': 'bg-red-500 hover:bg-red-600 text-white border-red-600',

  // Asthma variations - Green
  'asthma': 'bg-green-500 hover:bg-green-600 text-white border-green-600',
  'bronchial asthma': 'bg-green-500 hover:bg-green-600 text-white border-green-600',

  // Heart Disease variations - Purple
  'heart disease': 'bg-purple-500 hover:bg-purple-600 text-white border-purple-600',
  'coronary artery disease': 'bg-purple-500 hover:bg-purple-600 text-white border-purple-600',
  'cad': 'bg-purple-500 hover:bg-purple-600 text-white border-purple-600',
  'ihd': 'bg-purple-500 hover:bg-purple-600 text-white border-purple-600',
  'ischemic heart disease': 'bg-purple-500 hover:bg-purple-600 text-white border-purple-600',

  // COPD - Orange
  'copd': 'bg-orange-500 hover:bg-orange-600 text-white border-orange-600',
  'chronic obstructive pulmonary disease': 'bg-orange-500 hover:bg-orange-600 text-white border-orange-600',

  // Kidney Disease - Amber
  'ckd': 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600',
  'chronic kidney disease': 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600',

  // Thyroid - Teal
  'hypothyroidism': 'bg-teal-500 hover:bg-teal-600 text-white border-teal-600',
  'hyperthyroidism': 'bg-teal-500 hover:bg-teal-600 text-white border-teal-600',
  'thyroid': 'bg-teal-500 hover:bg-teal-600 text-white border-teal-600',
};

/**
 * Get the color class for a given condition.
 * Returns the specific color if found, otherwise returns gray (default).
 */
function getConditionColor(condition: string): string {
  const normalizedCondition = condition.toLowerCase().trim();
  return conditionColors[normalizedCondition] || 'bg-gray-500 hover:bg-gray-600 text-white border-gray-600';
}

/**
 * ChronicConditionBadges - Display chronic conditions as colored badges.
 *
 * Each condition type has a specific color for quick visual identification:
 * - Diabetes: Blue
 * - Hypertension: Red
 * - Asthma: Green
 * - Heart Disease: Purple
 * - COPD: Orange
 * - Kidney Disease: Amber
 * - Thyroid: Teal
 * - Others: Gray
 */
export function ChronicConditionBadges({
  conditions,
  className,
  size = 'default'
}: ChronicConditionBadgesProps) {
  // Don't render if no conditions
  if (!conditions || conditions.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {conditions.map((condition, index) => (
        <Badge
          key={`${condition}-${index}`}
          className={cn(
            getConditionColor(condition),
            sizeClasses[size],
            'font-medium transition-colors'
          )}
        >
          {condition}
        </Badge>
      ))}
    </div>
  );
}

export default ChronicConditionBadges;
