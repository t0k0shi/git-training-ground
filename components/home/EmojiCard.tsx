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
      className="emoji-card"
      style={{ backgroundColor: contributor.favoriteColor }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="emoji">{contributor.favoriteEmoji}</span>
      {showTooltip && (
        <Tooltip>
          <p className="name">{contributor.name}</p>
          {contributor.message && <p className="message">{contributor.message}</p>}
        </Tooltip>
      )}
    </a>
  );
}
