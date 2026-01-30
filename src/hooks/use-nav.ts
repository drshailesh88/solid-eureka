'use client';

/**
 * Fully client-side hook for filtering navigation items based on RBAC
 *
 * This hook uses Clerk's client-side hooks to check permissions, roles, and organization
 * without any server calls. This is perfect for navigation visibility (UX only).
 *
 * Note: For actual security (API routes, server actions), always use server-side checks.
 * This is only for UI visibility.
 */

import { useMemo } from 'react';
import type { NavItem } from '@/types';
import { useSafeOrganization, useSafeUser, CLERK_CONFIGURED } from '@/lib/clerk-safe';

/**
 * Hook to filter navigation items based on RBAC (fully client-side)
 * Falls back to showing all items if Clerk is not configured
 *
 * @param items - Array of navigation items to filter
 * @returns Filtered items
 */
export function useFilteredNavItems(items: NavItem[]): NavItem[] {
  // Always call hooks (safe versions handle when Clerk is not configured)
  const { organization, membership } = useSafeOrganization() as any;
  const { user } = useSafeUser();

  // Memoize context and permissions
  const accessContext = useMemo(() => {
    // If Clerk not configured, return empty context
    if (!CLERK_CONFIGURED) {
      return {
        organization: undefined,
        user: undefined,
        permissions: [] as string[],
        role: undefined,
        hasOrg: false,
        clerkEnabled: false
      };
    }

    const permissions = membership?.permissions || [];
    const role = membership?.role;

    return {
      organization: organization ?? undefined,
      user: user ?? undefined,
      permissions: permissions as string[],
      role: role ?? undefined,
      hasOrg: !!organization,
      clerkEnabled: true
    };
  }, [organization, user, membership]);

  // Filter items synchronously (all client-side)
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // No access restrictions - always show
        if (!item.access) {
          return true;
        }

        // If Clerk not configured, show all items (no RBAC)
        if (!accessContext.clerkEnabled) {
          return true;
        }

        // Check requireOrg
        if (item.access.requireOrg && !accessContext.hasOrg) {
          return false;
        }

        // Check permission
        if (item.access.permission) {
          if (!accessContext.hasOrg) {
            return false;
          }
          if (!accessContext.permissions.includes(item.access.permission)) {
            return false;
          }
        }

        // Check role
        if (item.access.role) {
          if (!accessContext.hasOrg) {
            return false;
          }
          if (accessContext.role !== item.access.role) {
            return false;
          }
        }

        return true;
      })
      .map((item) => {
        // Recursively filter child items
        if (item.items && item.items.length > 0) {
          const filteredChildren = item.items.filter((childItem) => {
            if (!childItem.access) {
              return true;
            }

            if (!accessContext.clerkEnabled) {
              return true;
            }

            if (childItem.access.requireOrg && !accessContext.hasOrg) {
              return false;
            }

            if (childItem.access.permission) {
              if (!accessContext.hasOrg) {
                return false;
              }
              if (!accessContext.permissions.includes(childItem.access.permission)) {
                return false;
              }
            }

            if (childItem.access.role) {
              if (!accessContext.hasOrg) {
                return false;
              }
              if (accessContext.role !== childItem.access.role) {
                return false;
              }
            }

            return true;
          });

          return {
            ...item,
            items: filteredChildren
          };
        }

        return item;
      });
  }, [items, accessContext]);

  return filteredItems;
}
