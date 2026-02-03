import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Statistics } from '@/components/home/Statistics';
import { Statistics as StatsType } from '@/lib/types';

describe('Statistics', () => {
  const mockStats: StatsType = {
    totalContributors: 42,
    thisMonthPRs: 7,
    recentContributors: [
      {
        name: 'Recent User 1',
        github: 'https://github.com/recent1',
        favoriteColor: '#FF5733',
        favoriteEmoji: '🎉',
        joinedAt: '2026-02-01',
        prNumber: 10,
      },
      {
        name: 'Recent User 2',
        github: 'https://github.com/recent2',
        favoriteColor: '#33FF57',
        favoriteEmoji: '🚀',
        joinedAt: '2026-02-02',
        prNumber: 9,
      },
    ],
  };

  it('totalContributors が表示される', () => {
    render(<Statistics stats={mockStats} />);
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('総貢献者数')).toBeInTheDocument();
  });

  it('thisMonthPRs が表示される', () => {
    render(<Statistics stats={mockStats} />);
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('今月のPR数')).toBeInTheDocument();
  });

  it('recentContributors のリンクが表示される', () => {
    render(<Statistics stats={mockStats} />);

    const link1 = screen.getByRole('link', { name: 'Recent User 1' });
    expect(link1).toHaveAttribute('href', 'https://github.com/recent1');
    expect(link1).toHaveAttribute('target', '_blank');
    expect(link1).toHaveAttribute('rel', 'noopener noreferrer');

    const link2 = screen.getByRole('link', { name: 'Recent User 2' });
    expect(link2).toHaveAttribute('href', 'https://github.com/recent2');
    expect(link2).toHaveAttribute('target', '_blank');
    expect(link2).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
