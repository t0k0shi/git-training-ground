import { EmojiCard as EmojiCardType } from '@/lib/types';
import { EmojiCard } from './EmojiCard';

interface EmojiGridProps {
  emojis: EmojiCardType[];
}

export function EmojiGrid({ emojis }: EmojiGridProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center items-center">
      {emojis.map((card, i) => (
        <EmojiCard key={i} emoji={card.emoji} size={card.size} />
      ))}
    </div>
  );
}
