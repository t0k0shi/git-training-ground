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
  const [mounted, setMounted] = useState(false);

  // 表示するバブルを density に基づいてフィルタ
  const visibleContributors = contributors.filter((_, i) => {
    // density=1.0 → 全員表示, density=0.7 → 70% 表示
    return (i % 10) / 10 < density;
  });

  useEffect(() => {
    // hydration mismatch 対策: useEffect 後に座標を計算
    const newPositions: BubblePosition[] = visibleContributors.map((_, index) => {
      const zone = ZONES[index % 4];
      return {
        x: randomInRange(zone.xMin, zone.xMax),
        y: randomInRange(zone.yMin, zone.yMax),
        duration: 3.5 + Math.random() * 3.5,
        delay: Math.random() * 3,
      };
    });

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
