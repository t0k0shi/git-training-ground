import { EmojiCard as EmojiCardType } from '@/lib/types';

interface EmojiCardProps {
  emoji: string;
  size: 1 | 2 | 3;
}

const sizeClasses = {
  1: 'col-span-1 row-span-1 text-2xl w-12 h-12',
  2: 'col-span-2 row-span-2 text-4xl w-28 h-28',
  3: 'col-span-3 row-span-3 text-6xl w-44 h-44',
};

export function EmojiCard({ emoji, size }: EmojiCardProps) {
  return (
    <div
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        bg-gradient-to-br from-gray-100 to-gray-200
        rounded-xl shadow-sm
        hover:scale-105 transition-transform
      `}
    >
      {emoji}
    </div>
  );
}
