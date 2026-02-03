import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Features } from '@/components/home/Features';

describe('Features', () => {
  it('3つの特徴が表示される', () => {
    render(<Features />);
    expect(screen.getByText('壊れない')).toBeInTheDocument();
    expect(screen.getByText('3分で完了')).toBeInTheDocument();
    expect(screen.getByText('実績になる')).toBeInTheDocument();
  });

  it('セクション見出しが表示される', () => {
    render(<Features />);
    expect(screen.getByText('なぜ Git Training Ground？')).toBeInTheDocument();
  });
});
