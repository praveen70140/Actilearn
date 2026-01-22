'use client';

import { IconFlame } from '@tabler/icons-react';

export function StreakHeader() {
  return (
    <div className="flex items-center gap-4">
      <IconFlame className="h-8 w-8 text-orange-400" />
      <h1 className="text-3xl font-bold">Streak</h1>
    </div>
  );
}
