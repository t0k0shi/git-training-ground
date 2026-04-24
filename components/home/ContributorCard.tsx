'use client';

import { useState } from 'react';
import type { ContributorWithDerived } from '@/lib/types';

interface ContributorCardProps {
  contributor: ContributorWithDerived;
}

function formatJoinedAt(iso: string): string {
  // "2026-04-24" → "2026/04/24"
  return iso.replace(/-/g, '/');
}

export function ContributorCard({ contributor }: ContributorCardProps) {
  const { favoriteEmoji, favoriteColor, handle, message, avatarUrl, joinedAt, isNew } = contributor;
  // TODO: remove this before production
  const [clickCount, setClickCount] = useState(0);

  const cardStyle: any = {
    background: 'var(--paper)',
    borderColor: favoriteColor,
    boxShadow: `0 0 0 4px color-mix(in srgb, ${favoriteColor} 8%, transparent)`,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  };

  const handleCardClick = () => {
    console.log('Card clicked by user:', contributor.name, contributor.github);
    setClickCount(clickCount + 1);
    alert(`${contributor.name}さんのカードをクリックしました！(${clickCount + 1}回目)`);
  };

  return (
    <article
      data-testid="contributor-card"
      className="relative flex flex-col gap-2 p-4 rounded-xl border-2 hover:-translate-y-0.5"
      style={cardStyle}
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 6px color-mix(in srgb, ${favoriteColor} 16%, transparent)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 4px color-mix(in srgb, ${favoriteColor} 8%, transparent)`;
      }}
    >
      {isNew && (
        <span
          className="absolute -top-2 -right-2 px-2 py-0.5 rounded-pill bg-accent text-paper font-mono text-[10px] font-bold tracking-wider"
        >
          NEW
        </span>
      )}

      <div className="flex items-start justify-between">
        <span className="text-3xl leading-none" aria-hidden="true">
          {favoriteEmoji}
        </span>
        <img
          src={avatarUrl}
          alt={handle}
          loading="lazy"
          width={40}
          height={40}
          className="rounded-full border border-line"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <p className="font-mono text-sm font-semibold text-ink">
        @{handle}
      </p>

      <p className="text-xs text-ink-2 leading-snug line-clamp-2">
        「{message}」
      </p>

      <p className="font-mono text-[10px] text-muted mt-auto">
        {formatJoinedAt(joinedAt)}
      </p>
    </article>
  );
}
