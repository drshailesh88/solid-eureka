import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

// Check if we have valid Clerk keys (not placeholder)
const hasValidClerkKeys = () => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return publishableKey && publishableKey.startsWith('pk_') && !publishableKey.includes('placeholder');
};

export default async function middleware(req: NextRequest) {
  // If Clerk keys are not configured (testing/dev mode), allow all routes
  if (!hasValidClerkKeys()) {
    return NextResponse.next();
  }

  // Use Clerk middleware for protected routes
  return clerkMiddleware(async (auth, req: NextRequest) => {
    if (isProtectedRoute(req)) await auth.protect();
  })(req, {} as any);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
