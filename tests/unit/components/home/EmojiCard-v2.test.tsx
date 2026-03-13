import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { EmojiCard } from '@/components/home/EmojiCard';

describe('EmojiCard (v2)', () => {
  it('emoji と size props でレンダリングされる', () => {
    const { container } = render(<EmojiCard emoji="🚀" size={1} />);
    expect(container.textContent).toBe('🚀');
  });

  it('size=1 で小サイズ CSS が適用される', () => {
    const { container } = render(<EmojiCard emoji="🐱" size={1} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('col-span-1');
    expect(card.className).toContain('row-span-1');
  });

  it('size=2 で中サイズ CSS が適用される', () => {
    const { container } = render(<EmojiCard emoji="🎉" size={2} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('col-span-2');
    expect(card.className).toContain('row-span-2');
  });

  it('size=3 で大サイズ CSS が適用される', () => {
    const { container } = render(<EmojiCard emoji="🌟" size={3} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('col-span-3');
    expect(card.className).toContain('row-span-3');
  });

  it('ホバーアニメーションのクラスを持つ', () => {
    const { container } = render(<EmojiCard emoji="🐱" size={2} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('hover:scale-105');
    expect(card.className).toContain('transition-transform');
  });
});
