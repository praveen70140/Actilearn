'use client';

import NextLink from 'next/link';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Alert, Button, Card, Spinner } from '@heroui/react';

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
            <Card.Header>
              <Card.Title className="text-2xl">Get Started</Card.Title>
            </Card.Header>
            <Card.Content>
              Create an account or sign in to access your personalized learning
              dashboard
            </Card.Content>
            <Card.Footer className="gap-2 self-center">
              <NextLink href="/register">
                <Button size="lg">Register</Button>
              </NextLink>
              <NextLink href="/login">
                <Button variant="secondary" size="lg">
                  Log In
                </Button>
              </NextLink>
            </Card.Footer>
          </Card>

          <Alert status="default">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Demo Cerdentials</Alert.Title>
              <Alert.Description className="">
                For testing, you can create a new account or use any
                email/password combination
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </div>
      </div>
    </div>
  );
}
