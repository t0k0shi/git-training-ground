import { Contributor } from '@/lib/types';
import { EmojiCard } from './EmojiCard';

interface EmojiGridProps {
  contributors: Contributor[];
}

export function EmojiGrid({ contributors }: EmojiGridProps) {
  return (
    <section className="emoji-grid-section">
      <h2>貢献者の皆さん</h2>
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
        {contributors.map((contributor) => (
          <EmojiCard key={contributor.github} contributor={contributor} />
        ))}
      </div>
    </section>
  );
}
