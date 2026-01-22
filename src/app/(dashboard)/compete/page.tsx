'use client';

import NextLink from 'next/link';
import { Card, Button, CardHeader, CardBody, CardFooter } from '@heroui/react';

export default function CompetePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <h2 className="text-2xl">Compete</h2>
        </CardHeader>
        <CardBody>
          <p>This is where the "Compete" feature will be.</p>
        </CardBody>
        <CardFooter>
          <NextLink href="/dashboard">
            <Button variant="bordered">&larr; Back to Dashboard</Button>
          </NextLink>
        </CardFooter>
      </Card>
    </div>
  );
}
