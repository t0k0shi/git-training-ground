import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/home/Hero';

describe('Hero', () => {
  it('キャッチコピーが表示される', () => {
    render(<Hero />);
    expect(screen.getByText(/OSSへの貢献、難しそう？/)).toBeInTheDocument();
    expect(screen.getByText(/ここなら、3分で完了します。/)).toBeInTheDocument();
  });

  it('CTAリンクが /tutorial を指している', () => {
    render(<Hero />);
    const ctaLink = screen.getByRole('link', { name: /チュートリアルを見る/i });
    expect(ctaLink).toHaveAttribute('href', '/tutorial');
  });
});
