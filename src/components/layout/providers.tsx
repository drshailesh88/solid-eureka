'use client';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import React from 'react';
import { ActiveThemeProvider } from '../active-theme';

// Check if we have valid Clerk keys
const hasValidClerkKeys = () => {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return publishableKey && publishableKey.startsWith('pk_') && !publishableKey.includes('placeholder');
};

export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  // we need the resolvedTheme value to set the baseTheme for clerk based on the dark or light theme
  const { resolvedTheme } = useTheme();

  // If no valid Clerk keys, render children directly without ClerkProvider
  if (!hasValidClerkKeys()) {
    return (
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        {children}
      </ActiveThemeProvider>
    );
  }

  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <ClerkProvider
          appearance={{
            baseTheme: resolvedTheme === 'dark' ? dark : undefined
          }}
        >
          {children}
        </ClerkProvider>
      </ActiveThemeProvider>
    </>
  );
}
