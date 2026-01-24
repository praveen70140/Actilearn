'use client';

import NextLink from 'next/link';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
} from '@heroui/react';

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
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-accent text-4xl font-bold">
            Welcome to ActiLearn
          </h1>
          <p className="text-foreground mb-8 text-lg">
            Your journey to better learning starts here
          </p>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-2xl">Get Started</h2>
            </CardHeader>
            <CardBody>
              Create an account or sign in to access your personalized learning
              dashboard
            </CardBody>
            <CardFooter className="gap-2 self-center">
              <NextLink href="/register">
                <Button color="primary" size="lg">
                  Register
                </Button>
              </NextLink>
              <NextLink href="/login">
                <Button variant="bordered" size="lg">
                  Log In
                </Button>
              </NextLink>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
