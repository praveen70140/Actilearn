'use client';

import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (session && !isPending) {
      router.push('/dashboard');
    }
  }, [session, isPending, router]);

  // Don't show anything if pending or already redirecting
  if (isPending || session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              Welcome to ActiLearn
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              Your journey to better learning starts here
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border bg-white p-8 shadow-md">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                Get Started
              </h2>
              <p className="mb-6 text-gray-600">
                Create an account or sign in to access your personalized
                learning dashboard
              </p>

              <div className="space-y-3">
                <Link
                  href="/register"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                  Create New Account
                </Link>

                <Link
                  href="/login"
                  className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                  Sign In
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-2 text-lg font-medium text-blue-900">
                Demo Credentials
              </h3>
              <p className="text-sm text-blue-700">
                For testing, you can create a new account or use any
                email/password combination
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
