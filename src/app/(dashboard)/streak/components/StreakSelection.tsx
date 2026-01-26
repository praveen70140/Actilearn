'use client';

import { Card } from '@heroui/react';
import { IconTrophy } from '@tabler/icons-react';

export function StreakSelection() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="rounded-lg border border-[#313244] bg-surface p-4">
        <div className="text-5xl font-bold text-center w-full">975d</div>
        <div className="text-muted text-center">1 hr streak</div>
        <div className="mt-2 flex items-center justify-center text-lg">
          <IconTrophy className="mr-1 h-4 w-4" /> #2
        </div>
      </Card>
      <Card className="rounded-lg border border-[#313244] bg-surface p-4">
        <div className="text-5xl font-bold text-center w-full">770d</div>
        <div className="text-muted text-center">2 hr streak</div>
        <div className="mt-2 flex items-center justify-center text-lg">
          <IconTrophy className="mr-1 h-4 w-4" /> #3
        </div>
      </Card>
      <Card className="rounded-lg border border-[#313244] bg-surface p-4">
        <div className="text-5xl font-bold text-center w-full">465d</div>
        <div className="text-muted text-center">4 hr streak</div>
        <div className="mt-2 flex items-center justify-center text-lg">
          <IconTrophy className="mr-1 h-4 w-4" /> #4
        </div>
      </Card>
    </div>
  );
}
