import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmojiCard } from '@/components/home/EmojiCard';
import { Contributor } from '@/lib/types';

describe('EmojiCard', () => {
  const mockContributor: Contributor = {
    name: 'Test User',
    github: 'https://github.com/testuser',
    favoriteColor: '#FF5733',
    favoriteEmoji: '🎉',
    message: 'Hello World',
    joinedAt: '2026-01-15',
    prNumber: 1,
  };

  it('絵文字が表示される', () => {
    render(<EmojiCard contributor={mockContributor} />);
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('GitHubリンクが target="_blank" rel="noopener noreferrer" を持つ', () => {
    render(<EmojiCard contributor={mockContributor} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://github.com/testuser');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('ホバーでツールチップが表示される', () => {
    render(<EmojiCard contributor={mockContributor} />);
    const link = screen.getByRole('link');

    // 初期状態ではツールチップは表示されない
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    // ホバーするとツールチップが表示される
    fireEvent.mouseEnter(link);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();

    // ホバー解除するとツールチップが消える
    fireEvent.mouseLeave(link);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
