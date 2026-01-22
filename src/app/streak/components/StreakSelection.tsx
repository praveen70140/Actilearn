'use client';

import { Card } from '@heroui/react';
import { IconTrophy } from '@tabler/icons-react';

export function StreakSelection() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="rounded-lg border-2 border-purple-500 bg-surface p-4">
        <div className="text-3xl font-bold">900d</div>
        <div className="text-muted">1 hr streak</div>
        <div className="mt-2 flex items-center text-sm">
          <IconTrophy className="mr-1 h-4 w-4" /> #2
        </div>
      </Card>
      <Card className="rounded-lg border border-[#313244] bg-surface p-4">
        <div className="text-3xl font-bold">600d</div>
        <div className="text-muted">2 hr streak</div>
        <div className="mt-2 flex items-center text-sm">
          <IconTrophy className="mr-1 h-4 w-4" /> #5
        </div>
      </Card>
      <Card className="rounded-lg border border-[#313244] bg-surface p-4">
        <div className="text-3xl font-bold">300d</div>
        <div className="text-muted">4 hr streak</div>
        <div className="mt-2 flex items-center text-sm">
          <IconTrophy className="mr-1 h-4 w-4" /> #10
        </div>
      </Card>
    </div>
  );
}
