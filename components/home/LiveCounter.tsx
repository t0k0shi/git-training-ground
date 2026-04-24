'use client';

import { useEffect, useRef, useState } from 'react';

interface LiveCounterProps {
  target: number;
  duration?: number;
}

// ease-out-cubic: 残り時間が少ないほど変化が緩やかになる
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function LiveCounter({ target, duration = 1800 }: LiveCounterProps) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // rAF stall フォールバック: duration + 200ms 後に強制 target
    const fallbackId = setTimeout(() => {
      setCount(target);
      cancelAnimationFrame(rafRef.current);
    }, duration + 200);

    function tick(timestamp: number) {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedValue = Math.round(easeOutCubic(progress) * target);

      setCount(easedValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        clearTimeout(fallbackId);
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(fallbackId);
    };
  }, [target, duration]);

  return (
    <div
      style={{ boxShadow: 'var(--shadow-card-lg)' }}
      className="inline-flex flex-col items-center gap-2 px-8 py-6 bg-paper rounded-xl border border-line"
    >
      <div className="flex items-end gap-1">
        <span
          data-testid="live-counter-value"
          className="font-mono text-5xl font-bold text-ink leading-none"
        >
          {count}
        </span>
        <span className="text-2xl font-bold text-ink mb-1">人</span>
      </div>

      <div className="flex items-center gap-2 text-muted text-sm">
        <span>参加中</span>
        <span className="flex items-center gap-1 font-mono font-semibold text-accent">
          LIVE
          <span
            className="inline-block w-2 h-2 rounded-full bg-accent"
            style={{ animation: 'pulse 1.4s ease-in-out infinite' }}
            aria-hidden="true"
          />
        </span>
      </div>
    </div>
  );
}
