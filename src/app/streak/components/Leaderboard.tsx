'use client';

import { Button } from '@heroui/react';
import { IconTrophy } from '@tabler/icons-react';

export function Leaderboard() {
  const leaderboardData = [
    { rank: 1, name: 'Jane Doe', score: 980 },
    { rank: 2, name: 'You', score: 975, isUser: true },
    { rank: 3, name: 'John Smith', score: 970 },
    { rank: 4, name: 'Peter Jones', score: 965 },
    { rank: 5, name: 'Mary White', score: 960 },
    { rank: 6, name: 'Chris Green', score: 955 },
    { rank: 7, name: 'David Black', score: 950 },
    { rank: 8, name: 'Sarah Brown', score: 945 },
    { rank: 9, name: 'Michael Grey', score: 940 },
    { rank: 10, name: 'Emily Blue', score: 935 },
    { rank: 11, name: 'James Purple', score: 930 },
    { rank: 12, name: 'Linda Orange', score: 925 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <IconTrophy className="h-8 w-8 text-yellow-400" />
        <h2 className="text-2xl font-bold">Leaderboard</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" className="rounded-full ring-2 ring-purple-500">
          1h
        </Button>
        <Button size="sm" variant="bordered" className="rounded-full">
          2h
        </Button>
        <Button size="sm" variant="bordered" className="rounded-full">
          4h
        </Button>
      </div>

      <div className="rounded-xl border border-[#313244] bg-surface p-4">
        <div className="space-y-4">
          {leaderboardData.map(({ rank, name, score, isUser }) => (
            <div key={rank} className="grid grid-cols-3 items-center">
              <div className="text-left">{rank}</div>
              <div className={`text-center ${isUser ? 'font-bold' : ''}`}>{name}</div>
              <div className="text-right">{score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
