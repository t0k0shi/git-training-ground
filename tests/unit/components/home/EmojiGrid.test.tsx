import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmojiGrid } from '@/components/home/EmojiGrid';
import { Contributor } from '@/lib/types';

describe('EmojiGrid', () => {
  const mockContributors: Contributor[] = [
    {
      name: 'User 1',
      github: 'https://github.com/user1',
      favoriteColor: '#FF5733',
      favoriteEmoji: '🎉',
      joinedAt: '2026-01-15',
      prNumber: 1,
    },
    {
      name: 'User 2',
      github: 'https://github.com/user2',
      favoriteColor: '#33FF57',
      favoriteEmoji: '🚀',
      message: 'Test message',
      joinedAt: '2026-01-16',
      prNumber: 2,
    },
    {
      name: 'User 3',
      github: 'https://github.com/user3',
      favoriteColor: '#3357FF',
      favoriteEmoji: '🌟',
      joinedAt: '2026-01-17',
      prNumber: 3,
    },
  ];

  it('contributors の数だけ EmojiCard がレンダリングされる', () => {
    render(<EmojiGrid contributors={mockContributors} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(mockContributors.length);

    // 各絵文字が表示されることを確認
    expect(screen.getByText('🎉')).toBeInTheDocument();
    expect(screen.getByText('🚀')).toBeInTheDocument();
    expect(screen.getByText('🌟')).toBeInTheDocument();
  });
});
