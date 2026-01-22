'use client';

import NextLink from 'next/link';
import { Card, Button } from '@heroui/react';

export default function StreakPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
      <Card className="w-full max-w-md text-center">
        <Card.Header>
          <Card.Title className="text-2xl">Streak</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>This is where the "Streak" feature will be.</p>
        </Card.Content>
        <Card.Footer>
          <NextLink href="/dashboard">
            <Button variant="secondary">
              &larr; Back to Dashboard
            </Button>
          </NextLink>
        </Card.Footer>
      </Card>
    </div>
  );
}