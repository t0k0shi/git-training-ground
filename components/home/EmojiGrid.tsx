import { Contributor } from '@/lib/types';
import { EmojiCard } from './EmojiCard';

interface EmojiGridProps {
  contributors: Contributor[];
}

export function EmojiGrid({ contributors }: EmojiGridProps) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4 justify-items-center">
      {contributors.map((contributor) => (
        <EmojiCard key={contributor.github} contributor={contributor} />
      ))}
    </div>
  );
}
