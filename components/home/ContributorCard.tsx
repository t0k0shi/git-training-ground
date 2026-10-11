'use client';

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

  // グローの色だけをインラインで渡し、hover 時の濃さ・広がりは globals.css の
  // .contributor-card:hover が CSS 変数を切り替えて表現する（JS 未ロードでも hover が効く）
  const cardStyle = {
    background: 'var(--paper)',
    borderColor: favoriteColor,
    '--glow-color': favoriteColor,
  } as React.CSSProperties;

  return (
    <article
      data-testid="contributor-card"
      className="contributor-card relative flex flex-col gap-2 p-4 rounded-xl border-2 hover:-translate-y-0.5"
      style={cardStyle}
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
