'use client';

import { StreakHeader } from './components/StreakHeader';
import { PodiumBanner } from './components/PodiumBanner';
import { StreakSelection } from './components/StreakSelection';
import { ActivityDistribution } from './components/ActivityDistribution';
import { Leaderboard } from './components/Leaderboard';

export default function StreakPage() {
  return (
    <div className="min-h-screen bg-[#1e1e2e] text-[#cdd6f4]">
      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <StreakHeader />
              <PodiumBanner />
              <StreakSelection />
            </div>
          </div>

          {/* Right Column */}
          <Leaderboard />
        </div>
      </main>
    </div>
  );
}
