'use client';

import { useState } from 'react';
import type { ContributorWithDerived } from '@/lib/types';
import { FloatingBubbles } from './FloatingBubbles';
import { BubbleTooltip } from './BubbleTooltip';
import { LiveCounter } from './LiveCounter';

interface HeroSectionProps {
  contributors: ContributorWithDerived[];
}

/**
 * Render the hero section with navigation, headline, CTAs, animated contributor bubbles, counters, avatars, and an interactive tooltip that follows hover.
 *
 * @param contributors - Array of contributors used to populate floating bubbles, the live counter, weekly-new count, and the latest avatars
 * @returns The hero section JSX element containing navigation, introduction content, call-to-action buttons, contributor visuals, and the hover-follow tooltip
 */
export function HeroSection({ contributors }: HeroSectionProps) {
  const [hovered, setHovered] = useState<ContributorWithDerived | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleHover = (
    contributor: ContributorWithDerived | null,
    event: MouseEvent,
  ) => {
    setHovered(contributor);
    if (contributor) {
      setMouse({ x: event.clientX, y: event.clientY });
    }
  };

  const count = contributors.length;
  const newThisWeek = contributors.filter((c) => c.isNew).length;

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ padding: '80px 40px 120px' }}
    >
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-bg/90 backdrop-blur border-b border-line"
      >
        <a
          href="/"
          className="font-mono font-bold text-ink text-sm tracking-tight"
        >
          git-training-ground
        </a>
        <div className="flex items-center gap-4">
          <a
            href="/tutorial"
            className="hero-nav-link hidden md:inline text-ink-2 text-sm hover:text-accent transition-colors"
          >
            チュートリアル
          </a>
          <a
            href="#contributors"
            className="hero-nav-link hidden md:inline text-ink-2 text-sm hover:text-accent transition-colors"
          >
            参加者
          </a>
          <a
            href="https://github.com/t0k0shi/git-training-ground"
            className="px-4 py-1.5 text-sm rounded-pill border-2 border-ink font-semibold text-ink hover:bg-ink hover:text-bg transition-colors"
          >
            Repo
          </a>
        </div>
      </nav>

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <div className="absolute inset-0" style={{ pointerEvents: 'auto' }}>
          <FloatingBubbles contributors={contributors} onHover={handleHover} />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto pt-20 text-center">
        <p className="inline-flex items-center gap-2 mb-6 font-mono text-xs text-muted">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-accent"
            aria-hidden="true"
          />
          first contribution, first win
        </p>

        <h1
          className="font-bold text-ink leading-tight mb-8"
          style={{ fontSize: 'var(--fs-hero)' }}
        >
          <span className="block">はじめての PR を、</span>
          <span
            className="relative inline-block"
            style={{
              backgroundImage:
                'linear-gradient(transparent 60%, #FFE066 60%, #FFE066 90%, transparent 90%)',
            }}
          >
            ここで。
          </span>
          <span className="block">安全に、楽しく。</span>
        </h1>

        <p className="text-ink-2 text-base md:text-lg mb-10 max-w-2xl mx-auto">
          <code
            className="font-mono px-2 py-0.5 rounded-sm bg-ink/5 text-accent"
          >
            contributors.json
          </code>
          {' '}
          に自分のエントリを 1 行追加するだけ。
          OSS の PR フローを手で覚えよう。
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          <a
            href="/tutorial"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-accent text-paper font-bold shadow-card hover:-translate-y-0.5 transition-transform"
          >
            参加する
            <span aria-hidden="true">→</span>
          </a>
          <a
            href="https://github.com/t0k0shi/git-training-ground"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-pill border-2 border-ink font-semibold text-ink hover:bg-ink hover:text-bg transition-colors"
          >
            リポジトリを見る
          </a>
          <button
            type="button"
            aria-label="シェア"
            className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-ink text-ink hover:bg-ink hover:text-bg transition-colors"
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator.share({
                  title: 'git-training-ground',
                  url: typeof window !== 'undefined' ? window.location.href : '',
                }).catch(() => { });
              }
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <LiveCounter target={count} />

          <div className="text-left text-sm text-muted">
            <p>今週 <span className="font-bold text-accent">+{newThisWeek}</span> 人</p>
            <div className="flex items-center gap-1 mt-2">
              {contributors.slice(-6).map((c) => (
                <img
                  key={c.handle}
                  src={c.avatarUrl}
                  alt={c.handle}
                  loading="lazy"
                  width={24}
                  height={24}
                  className="rounded-full border border-line"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ))}
              {contributors.length > 6 && (
                <span className="text-xs text-muted ml-1">…</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <BubbleTooltip contributor={hovered} x={mouse.x} y={mouse.y} />
    </section>
  );
}
