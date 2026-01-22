'use client';

export function ActivityDistribution() {
  return (
    <div>
      <h2 className="text-sm font-normal">Month Wise Distribution</h2>
      <div className="mt-4 rounded-xl border border-[#313244] bg-surface p-4">
        <div className="grid grid-cols-7 text-center text-xs text-muted">
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
          <div>S</div>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-2">
          {/* Week 1 */}
          <div className="h-8 rounded bg-purple-500"></div>
          <div className="h-8 rounded border border-dashed border-gray-600"></div>
          <div className="h-8 rounded bg-purple-500"></div>
          <div className="h-8 rounded border border-dashed border-gray-600"></div>
          <div className="h-8 rounded bg-purple-500"></div>
          <div className="h-8 rounded bg-purple-500"></div>
          <div className="h-8 rounded border border-dashed border-gray-600"></div>
          {/* Week 2 */}
          <div className="h-8 rounded border border-dashed border-gray-600"></div>
          <div className="h-8 rounded bg-purple-500"></div>
          <div className="h-8 rounded border border-dashed border-gray-600"></div>
          <div className="h-8 rounded bg-purple-500"></div>
          <div className="h-8 rounded border border-dashed border-gray-600"></div>
          <div className="h-8 rounded bg-purple-500"></div>
          <div className="h-8 rounded bg-purple-500"></div>
        </div>
      </div>
    </div>
  );
}
