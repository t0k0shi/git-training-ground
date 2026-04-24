'use client';

import { ContributorWithDerived } from '@/lib/types';

interface BubbleTooltipProps {
  contributor: ContributorWithDerived | null;
  x: number;
  y: number;
}

export function BubbleTooltip({ contributor, x, y }: BubbleTooltipProps) {
  if (!contributor) return null;

  return (
    <div
      role="tooltip"
      style={{
        position: 'fixed',
        left: x + 16,
        top: y - 8,
        background: 'var(--paper)',
        border: `2px solid ${contributor.favoriteColor}`,
        zIndex: 50,
        pointerEvents: 'none',
      }}
      className="px-4 py-3 rounded-xl shadow-card min-w-[180px] max-w-[240px]"
    >
      <p className="font-mono font-semibold text-ink text-sm">
        @{contributor.handle}
      </p>
      <p className="text-muted text-xs mt-1">
        joined {contributor.joinedAt}
      </p>
      <p className="text-ink-2 text-xs mt-2 leading-snug">
        「{contributor.message}」
      </p>
    </div>
  );
}
