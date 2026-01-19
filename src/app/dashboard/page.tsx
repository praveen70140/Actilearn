'use client';

import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, isPending, error } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/login');
          },
        },
      });
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  // Show loading state
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Error loading session: {error.message}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If no session, don't render anything (useEffect will redirect)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="ml-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="rounded-lg border-4 border-dashed border-gray-200 p-8">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Welcome to your Dashboard!
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                You have successfully logged in.
              </p>

              {/* User Information */}
              <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Your Account Information
                </h3>
                <div className="space-y-3 text-left">
                  <div className="flex">
                    <span className="w-20 font-medium text-gray-700">
                      Email:
                    </span>
                    <span className="font-semibold text-indigo-600">
                      {session.user.email}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-20 font-medium text-gray-700">
                      Name:
                    </span>
                    <span className="text-gray-900">{session.user.name}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20 font-medium text-gray-700">
                      User ID:
                    </span>
                    <span className="font-mono text-sm text-gray-500">
                      {session.user.id}
                    </span>
                  </div>
                  {session.user.image && (
                    <div className="flex">
                      <span className="w-20 font-medium text-gray-700">
                        Avatar:
                      </span>
                      <img
                        src={session.user.image}
                        alt="User avatar"
                        className="h-10 w-10 rounded-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Session Information */}
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">
                  Session expires:{' '}
                  {new Date(session.session.expiresAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
