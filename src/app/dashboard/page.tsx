import { safeAuth, CLERK_SERVER_CONFIGURED } from '@/lib/clerk-safe-server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  // If Clerk is not configured, redirect to overview (for testing/demo)
  if (!CLERK_SERVER_CONFIGURED) {
    redirect('/dashboard/overview');
  }

  const { userId } = await safeAuth();

  if (!userId) {
    return redirect('/auth/sign-in');
  } else {
    redirect('/dashboard/overview');
  }
}
