import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BubbleTooltip } from '@/components/home/BubbleTooltip';
import type { ContributorWithDerived } from '@/lib/types';

const contributor: ContributorWithDerived = {
  name: 'ketts',
  favoriteColor: '#E63946',
  favoriteEmoji: '🚀',
  message: 'はじめてのOSS貢献！',
  joinedAt: '2026-04-24',
  id: 'entry-0',
  avatarUrl: 'https://avatars.githubusercontent.com/u/3?s=80',
  isNew: false,
};

describe('BubbleTooltip', () => {
  it('name を表示し、github のハンドル名は表示しない', () => {
    render(<BubbleTooltip contributor={contributor} x={0} y={0} />);
    const tooltip = screen.getByRole('tooltip');
    expect(screen.getByText('ketts')).toBeInTheDocument();
    expect(tooltip.textContent).not.toContain('t0k0shi');
  });

  it('contributor が null のときは何も描画しない', () => {
    const { container } = render(<BubbleTooltip contributor={null} x={0} y={0} />);
    expect(container.innerHTML).toBe('');
  });
});
