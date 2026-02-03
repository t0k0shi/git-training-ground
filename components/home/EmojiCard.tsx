'use client';
import { useState } from 'react';
import { Contributor } from '@/lib/types';
import { Tooltip } from '@/components/common/Tooltip';

interface EmojiCardProps {
  contributor: Contributor;
}

export function EmojiCard({ contributor }: EmojiCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <a
      href={contributor.github}
      target="_blank"
      rel="noopener noreferrer"
      className="emoji-card relative flex items-center justify-center w-16 h-16 rounded-xl text-3xl transition-transform hover:scale-110"
      style={{ backgroundColor: contributor.favoriteColor }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span>{contributor.favoriteEmoji}</span>
      {showTooltip && (
        <Tooltip>
          <p className="font-semibold">{contributor.name}</p>
          {contributor.message && <p className="text-gray-300">{contributor.message}</p>}
        </Tooltip>
      )}
    </a>
  );
}
