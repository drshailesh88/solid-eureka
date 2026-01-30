'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { resetStaleQueueEntries } from '../api/queue';

const QUEUE_RESET_KEY = 'casefold_queue_last_reset';

interface UseQueueResetOptions {
  /** Whether to run the reset automatically on mount */
  autoReset?: boolean;
}

interface UseQueueResetResult {
  /** Whether the reset check/operation is in progress */
  isLoading: boolean;
  /** Number of entries that were marked as no_show in the last reset */
  resetCount: number | null;
  /** Any error that occurred during the reset */
  error: string | null;
  /** Manually trigger a reset (bypasses the date check) */
  forceReset: () => Promise<void>;
  /** Check if reset is needed and perform it if so */
  checkAndReset: () => Promise<void>;
  /** The last date when reset was performed */
  lastResetDate: string | null;
}

/**
 * Hook to manage daily queue reset.
 *
 * On first load of each day, this hook will:
 * 1. Check localStorage for the last reset date
 * 2. If the last reset was not today, call resetStaleQueueEntries
 * 3. Update localStorage with today's date
 *
 * Usage:
 * ```tsx
 * // In your dashboard or queue page
 * const { isLoading, resetCount, error } = useQueueReset({ autoReset: true });
 *
 * // Or trigger manually
 * const { checkAndReset, forceReset } = useQueueReset();
 * ```
 */
export function useQueueReset(options: UseQueueResetOptions = {}): UseQueueResetResult {
  const { autoReset = false } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [resetCount, setResetCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastResetDate, setLastResetDate] = useState<string | null>(null);

  // Track if we've already run the auto-reset for this mount
  const hasAutoReset = useRef(false);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = useCallback((): string => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // Get the last reset date from localStorage
  const getLastResetDate = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(QUEUE_RESET_KEY);
  }, []);

  // Save the reset date to localStorage
  const saveResetDate = useCallback((date: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(QUEUE_RESET_KEY, date);
    setLastResetDate(date);
  }, []);

  // Check if reset is needed (last reset was not today)
  const isResetNeeded = useCallback((): boolean => {
    const lastReset = getLastResetDate();
    const today = getTodayDate();
    return lastReset !== today;
  }, [getLastResetDate, getTodayDate]);

  // Perform the actual reset operation
  const performReset = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await resetStaleQueueEntries();

      if (result.error) {
        setError(result.error);
        return;
      }

      const count = result.data?.count ?? 0;
      setResetCount(count);

      // Save today's date as the last reset date
      saveResetDate(getTodayDate());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset queue');
    } finally {
      setIsLoading(false);
    }
  }, [saveResetDate, getTodayDate]);

  // Check if reset is needed and perform it if so
  const checkAndReset = useCallback(async (): Promise<void> => {
    if (!isResetNeeded()) {
      // Already reset today, just update the state
      setLastResetDate(getLastResetDate());
      return;
    }

    await performReset();
  }, [isResetNeeded, getLastResetDate, performReset]);

  // Force reset regardless of date
  const forceReset = useCallback(async (): Promise<void> => {
    await performReset();
  }, [performReset]);

  // Auto-reset on mount if enabled
  useEffect(() => {
    if (autoReset && !hasAutoReset.current) {
      hasAutoReset.current = true;
      checkAndReset();
    }
  }, [autoReset, checkAndReset]);

  // Initialize lastResetDate from localStorage on mount
  useEffect(() => {
    setLastResetDate(getLastResetDate());
  }, [getLastResetDate]);

  return {
    isLoading,
    resetCount,
    error,
    forceReset,
    checkAndReset,
    lastResetDate,
  };
}
