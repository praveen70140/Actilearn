'use client';

import { StreakHeader } from './components/StreakHeader';
import { PodiumBanner } from './components/PodiumBanner';
import { StreakSelection } from './components/StreakSelection';
import { ActivityDistribution } from './components/ActivityDistribution';
import { Leaderboard } from './components/Leaderboard';

export default function StreakPage() {
  return (
    <div className="min-h-screen bg-[#1e1e2e] text-[#cdd6f4]">
      {/* Top Navigation Bar */}
      <nav className="border-b border-[#313244]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-center">
            <span className="font-medium">Actilearn</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <StreakHeader />
              <PodiumBanner />
              <StreakSelection />
              <ActivityDistribution />
            </div>
          </div>

          {/* Right Column */}
          <Leaderboard />
        </div>
      </main>
    </div>
  );
}
