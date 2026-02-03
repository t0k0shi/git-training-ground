import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/home/Hero';

describe('Hero', () => {
  it('キャッチコピー「あなたの初めてのPRを、ここで。」が表示される', () => {
    render(<Hero />);
    expect(screen.getByText('あなたの初めてのPRを、ここで。')).toBeInTheDocument();
  });

  it('CTAリンクが /tutorial を指している', () => {
    render(<Hero />);
    const ctaLink = screen.getByRole('link', { name: /チュートリアルを見る/i });
    expect(ctaLink).toHaveAttribute('href', '/tutorial');
  });
});
