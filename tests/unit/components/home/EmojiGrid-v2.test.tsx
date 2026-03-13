import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { EmojiGrid } from '@/components/home/EmojiGrid';
import type { EmojiCard } from '@/lib/types';

describe('EmojiGrid (v2)', () => {
  it('emojis prop で複数カードをレンダリングする', () => {
    const emojis: EmojiCard[] = [
      { emoji: '🚀', size: 1 },
      { emoji: '🎉', size: 2 },
      { emoji: '🌟', size: 3 },
    ];

    const { container } = render(<EmojiGrid emojis={emojis} />);

    expect(container.textContent).toContain('🚀');
    expect(container.textContent).toContain('🎉');
    expect(container.textContent).toContain('🌟');
  });

  it('emojis の数だけカードが表示される', () => {
    const emojis: EmojiCard[] = [
      { emoji: '🚀', size: 1 },
      { emoji: '🎉', size: 2 },
    ];

    const { container } = render(<EmojiGrid emojis={emojis} />);

    // flex wrapper 内の子要素をカウント
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children).toHaveLength(2);
  });

  it('空配列で子要素なしのグリッドを返す', () => {
    const { container } = render(<EmojiGrid emojis={[]} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children).toHaveLength(0);
  });
});
