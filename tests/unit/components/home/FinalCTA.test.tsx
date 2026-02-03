import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FinalCTA } from '@/components/home/FinalCTA';

describe('FinalCTA', () => {
  it('見出しが表示される', () => {
    render(<FinalCTA />);
    expect(screen.getByText('準備はできましたか？')).toBeInTheDocument();
  });

  it('CTAリンクが /tutorial を指している', () => {
    render(<FinalCTA />);
    const ctaLink = screen.getByRole('link', { name: /チュートリアルを見る/i });
    expect(ctaLink).toHaveAttribute('href', '/tutorial');
  });
});
