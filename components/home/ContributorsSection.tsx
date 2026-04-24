'use client';

import { useMemo, useState } from 'react';
import type { ContributorWithDerived } from '@/lib/types';
import { ContributorCard } from './ContributorCard';

type Filter = 'all' | 'new';

interface ContributorsSectionProps {
  contributors: ContributorWithDerived[];
}

export function ContributorsSection({ contributors }: ContributorsSectionProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const newCount = useMemo(
    () => contributors.filter((c) => c.isNew).length,
    [contributors],
  );

  const visible = useMemo(
    () => (filter === 'all' ? contributors : contributors.filter((c) => c.isNew)),
    [contributors, filter],
  );

  return (
    <section
      id="contributors"
      className="bg-bg"
      style={{ padding: '80px 40px' }}
    >
      <div className="max-w-[1120px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="font-mono text-xs text-accent tracking-widest mb-2">
              the playground
            </p>
            <h2
              className="font-bold text-ink leading-tight"
              style={{ fontSize: 'var(--fs-section)' }}
            >
              一緒に練習中の {contributors.length} 人
            </h2>
          </div>

          <div
            role="group"
            aria-label="参加者フィルター"
            className="inline-flex items-center p-1 rounded-pill border-2 border-ink bg-paper self-start md:self-end"
          >
            <button
              type="button"
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-pill text-sm font-semibold transition-colors ${
                filter === 'all' ? 'bg-ink text-bg' : 'text-ink hover:bg-ink/5'
              }`}
            >
              全員
            </button>
            <button
              type="button"
              aria-pressed={filter === 'new'}
              onClick={() => setFilter('new')}
              className={`px-4 py-1.5 rounded-pill text-sm font-semibold transition-colors ${
                filter === 'new' ? 'bg-ink text-bg' : 'text-ink hover:bg-ink/5'
              }`}
            >
              今週の新顔 {newCount}
            </button>
          </div>
        </div>

        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
        >
          {visible.map((c) => (
            <ContributorCard key={c.handle} contributor={c} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="text-center text-muted text-sm mt-8">
            今週の新顔はまだいません。
          </p>
        )}
      </div>
    </section>
  );
}
