'use client';

import { useEffect, useState } from 'react';
import { ContributorWithDerived } from '@/lib/types';

interface BubblePosition {
  x: number;
  y: number;
  duration: number;
  delay: number;
}

// ゾーン定義（index % 4 でゾーンを割り当て）
const ZONES = [
  { xMin: 0.02, xMax: 0.22, yMin: 0.05, yMax: 0.95 }, // 左帯
  { xMin: 0.78, xMax: 0.98, yMin: 0.05, yMax: 0.95 }, // 右帯
  { xMin: 0.22, xMax: 0.78, yMin: 0.02, yMax: 0.12 }, // 上帯
  { xMin: 0.22, xMax: 0.78, yMin: 0.88, yMax: 0.98 }, // 下帯
] as const;

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Fisher-Yates シャッフルで配列の先頭 sampleSize 件をランダムに置き換える。
 * 元の順序は保持されないが、毎回呼び出すごとに異なる組み合わせが返る。
 */
export function sampleRandom<T>(items: readonly T[], sampleSize: number): T[] {
  const size = Math.max(0, Math.min(sampleSize, items.length));
  const copy = items.slice();
  for (let i = 0; i < size; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, size);
}

interface FloatingBubblesProps {
  contributors: ContributorWithDerived[];
  density?: number;
  onHover: (contributor: ContributorWithDerived | null, event: MouseEvent) => void;
}

export function FloatingBubbles({
  contributors,
  density = 0.7,
  onHover,
}: FloatingBubblesProps) {
  const [positions, setPositions] = useState<BubblePosition[]>([]);
  const [visibleContributors, setVisibleContributors] = useState<ContributorWithDerived[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // density に基づいて表示数を決定し、Fisher-Yates でランダムサンプリング
    // hydration mismatch を避けるため、サンプリングと座標計算は client mount 後に実施
    const targetCount = Math.ceil(contributors.length * density);
    const sampled = sampleRandom(contributors, targetCount);

    const newPositions: BubblePosition[] = sampled.map((_, index) => {
      const zone = ZONES[index % 4];
      return {
        x: randomInRange(zone.xMin, zone.xMax),
        y: randomInRange(zone.yMin, zone.yMax),
        duration: 3.5 + Math.random() * 3.5,
        delay: Math.random() * 3,
      };
    });

    setVisibleContributors(sampled);
    setPositions(newPositions);
    setMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contributors.length, density]);

  return (
    <>
      {visibleContributors.map((contributor, index) => {
        const pos = positions[index];
        const style: React.CSSProperties = mounted && pos
          ? {
              position: 'absolute',
              left: `calc(${pos.x * 100}%)`,
              top: `calc(${pos.y * 100}%)`,
              transform: 'translate(-50%, -50%)',
              animation: `float ${pos.duration}s ease-in-out infinite`,
              animationDelay: `-${pos.delay}s`,
              opacity: 1,
              transition: 'transform 0.15s ease, filter 0.15s ease',
            }
          : {
              position: 'absolute',
              opacity: 0,
            };

        return (
          <div
            key={contributor.handle}
            style={style}
            onMouseEnter={(e) => onHover(contributor, e.nativeEvent)}
            onMouseLeave={(e) => onHover(null, e.nativeEvent)}
          >
            <img
              src={contributor.avatarUrl}
              alt={contributor.handle}
              loading="lazy"
              width={48}
              height={48}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: `2px solid ${contributor.favoriteColor}`,
                cursor: 'pointer',
                display: 'block',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = 'scale(1.08)';
                el.style.filter = 'brightness(1.05)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = '';
                el.style.filter = '';
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        );
      })}
    </>
  );
}
