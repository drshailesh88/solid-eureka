'use client';

/**
 * Safe Clerk hooks that work when Clerk is not configured
 * These return null/empty values when ClerkProvider is not available
 */

// Check if Clerk is properly configured (evaluated once at module load)
export const CLERK_CONFIGURED = (() => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return publishableKey && publishableKey.startsWith('pk_') && !publishableKey.includes('placeholder');
})();

// No-op hooks for when Clerk is not configured
const noOpUser = { user: null, isLoaded: true, isSignedIn: false };
const noOpOrganization = { organization: null, membership: null, isLoaded: true };
const noOpAuth = { userId: null, sessionId: null, isLoaded: true, isSignedIn: false };
const noOpClerk = { signOut: async () => {}, openUserProfile: () => {}, openOrganizationProfile: () => {} };

// Get actual hooks or no-ops
let actualUseUser: any;
let actualUseOrganization: any;
let actualUseAuth: any;
let actualUseClerk: any;

if (CLERK_CONFIGURED) {
  try {
    const clerk = require('@clerk/nextjs');
    actualUseUser = clerk.useUser;
    actualUseOrganization = clerk.useOrganization;
    actualUseAuth = clerk.useAuth;
    actualUseClerk = clerk.useClerk;
  } catch {
    // Clerk not available
  }
}

/**
 * Safe version of useUser that returns null when Clerk is not configured
 */
export function useSafeUser() {
  if (!CLERK_CONFIGURED || !actualUseUser) {
    return noOpUser;
  }
  return actualUseUser();
}

/**
 * Safe version of useOrganization that returns null when Clerk is not configured
 */
export function useSafeOrganization() {
  if (!CLERK_CONFIGURED || !actualUseOrganization) {
    return noOpOrganization;
  }
  return actualUseOrganization();
}

/**
 * Safe version of useAuth that returns null when Clerk is not configured
 */
export function useSafeAuth() {
  if (!CLERK_CONFIGURED || !actualUseAuth) {
    return noOpAuth;
  }
  return actualUseAuth();
}

/**
 * Safe version of useClerk that returns no-ops when Clerk is not configured
 */
export function useSafeClerk() {
  if (!CLERK_CONFIGURED || !actualUseClerk) {
    return noOpClerk;
  }
  return actualUseClerk();
}

// No-op for organization list
const noOpOrganizationList = {
  isLoaded: true,
  setActive: null,
  userMemberships: { data: [], revalidate: null }
};

let actualUseOrganizationList: any;
if (CLERK_CONFIGURED) {
  try {
    const clerk = require('@clerk/nextjs');
    actualUseOrganizationList = clerk.useOrganizationList;
  } catch {
    // Clerk not available
  }
}

/**
 * Safe version of useOrganizationList
 */
export function useSafeOrganizationList(options?: any) {
  if (!CLERK_CONFIGURED || !actualUseOrganizationList) {
    return noOpOrganizationList;
  }
  return actualUseOrganizationList(options);
}
