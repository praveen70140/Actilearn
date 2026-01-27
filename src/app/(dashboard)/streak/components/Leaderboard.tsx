'use client';

import { Button } from '@heroui/react';
import { IconTrophy } from '@tabler/icons-react';
import { useState } from 'react'; // Import useState

export function Leaderboard() {
  // Hardcoded data for 1-hour streak leaderboard
  const leaderboardData1h = [
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
  ];

  // Hardcoded data for 2-hour streak leaderboard
  const leaderboardData2h = [
    { rank: 1, name: 'Mike Ross', score: 780 },
    { rank: 2, name: 'Harvey Specter', score: 775 },
    { rank: 3, name: 'You', score: 770, isUser: true },
    { rank: 4, name: 'Louis Litt', score: 765 },
    { rank: 5, name: 'Donna Paulsen', score: 760 },
    { rank: 6, name: 'Jessica Pearson', score: 755 },
    { rank: 7, name: 'Rachel Zane', score: 750 },
    { rank: 8, name: 'Katrina Bennett', score: 745 },
    { rank: 9, name: 'Samantha Wheeler', score: 740 },
    { rank: 10, name: 'Alex Williams', score: 735 },
  ];

  // Hardcoded data for 4-hour streak leaderboard
  const leaderboardData4h = [
    { rank: 1, name: 'Sheldon Cooper', score: 480 },
    { rank: 2, name: 'Leonard Hofstadter', score: 475 },
    { rank: 3, name: 'Penny', score: 470 },
    { rank: 4, name: 'You', score: 465, isUser: true },
    { rank: 5, name: 'Amy Farrah Fowler', score: 460 },
    { rank: 6, name: 'Howard Wolowitz', score: 455 },
    { rank: 7, name: 'Bernadette Rostenkowski', score: 450 },
    { rank: 8, name: 'Raj Koothrappali', score: 445 },
    { rank: 9, name: 'Stuart Bloom', score: 440 },
    { rank: 10, name: 'Emily Sweeney', score: 435 },
  ];

  // State to manage the currently selected streak duration (1h, 2h, 4h)
  const [selectedStreak, setSelectedStreak] = useState('1h');

  // Determine which leaderboard data to display based on the selected streak
  let currentLeaderboardData;
  switch (selectedStreak) {
    case '1h':
      currentLeaderboardData = leaderboardData1h;
      break;
    case '2h':
      currentLeaderboardData = leaderboardData2h;
      break;
    case '4h':
      currentLeaderboardData = leaderboardData4h;
      break;
    default:
      currentLeaderboardData = leaderboardData1h; // Default to 1h if state is somehow invalid
  }

  // Function to determine row styling based on rank and if it's the user
  const getRowClass = (rank: number, isUser: boolean) => {
    const baseClasses = 'grid grid-cols-3 items-center rounded p-1';

    switch (rank) {
      case 1:
        return `${baseClasses} bg-yellow-500/30 border-2 border-yellow-500`;
      case 2:
        return `${baseClasses} bg-gray-500/30 border-2 border-gray-500`;
      case 3:
        return `${baseClasses} bg-orange-500/30 border-2 border-orange-500`;
    }

    if (isUser) {
      return `${baseClasses} border-2 border-secondary`;
    }

    return 'grid grid-cols-3 items-center p-1';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <IconTrophy className="h-8 w-8 text-yellow-400" />
        <h2 className="text-2xl font-bold">Leaderboard</h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Button for 1-hour streak */}
        <Button
          size="sm"
          color={selectedStreak === '1h' ? 'primary' : 'content1'}
          onClick={() => setSelectedStreak('1h')}
          className={`rounded-full border-2 ${selectedStreak === '1h' ? 'border-primary' : 'border-content2'}`}
        >
          1h
        </Button>
        {/* Button for 2-hour streak */}
        <Button
          size="sm"
          color={selectedStreak === '2h' ? 'primary' : 'content1'}
          onClick={() => setSelectedStreak('2h')}
          className={`rounded-full border-2 ${selectedStreak === '2h' ? 'border-primary' : 'border-content2'}`}
        >
          2h
        </Button>
        {/* Button for 4-hour streak */}
        <Button
          size="sm"
          color={selectedStreak === '4h' ? 'primary' : 'content1'}
          onClick={() => setSelectedStreak('4h')}
          className={`rounded-full border-2 ${selectedStreak === '4h' ? 'border-primary' : 'border-content2'}`}
        >
          4h
        </Button>
      </div>

      <div className="rounded-xl border border-[#313244] bg-surface p-4">
        <div className="space-y-4">
          {currentLeaderboardData.map(({ rank, name, score, isUser }) => (
            <div key={rank} className={getRowClass(rank, isUser)}>
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
