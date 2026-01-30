/**
 * Safe Clerk server utilities that work when Clerk is not configured
 * These return null/empty values when Clerk middleware is not available
 */

// Check if Clerk is properly configured
const CLERK_CONFIGURED = (() => {
  const secretKey = process.env.CLERK_SECRET_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasValidSecret = secretKey && secretKey.startsWith('sk_') && !secretKey.includes('placeholder');
  const hasValidPublishable = publishableKey && publishableKey.startsWith('pk_') && !publishableKey.includes('placeholder');
  return hasValidSecret && hasValidPublishable;
})();

export { CLERK_CONFIGURED as CLERK_SERVER_CONFIGURED };

// No-op auth result
const noOpAuthResult = {
  userId: null,
  sessionId: null,
  sessionClaims: null,
  orgId: null,
  orgRole: null,
  orgSlug: null,
  orgPermissions: null,
  getToken: async () => null,
  has: () => false,
  protect: () => { throw new Error('Clerk not configured'); },
  redirectToSignIn: () => { throw new Error('Clerk not configured'); },
};

/**
 * Safe version of auth() that returns empty values when Clerk is not configured
 */
export async function safeAuth() {
  if (!CLERK_CONFIGURED) {
    return noOpAuthResult;
  }

  try {
    const { auth } = await import('@clerk/nextjs/server');
    return await auth();
  } catch (error) {
    console.warn('Clerk auth() failed, returning no-op result:', error);
    return noOpAuthResult;
  }
}
