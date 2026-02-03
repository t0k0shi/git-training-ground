import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HowItWorks } from '@/components/home/HowItWorks';

describe('HowItWorks', () => {
  it('3つのステップが表示される', () => {
    render(<HowItWorks />);
    const stepItems = screen.getAllByRole('heading', { level: 3 });
    expect(stepItems).toHaveLength(3);
  });

  it('各ステップにタイトルが存在する', () => {
    render(<HowItWorks />);
    expect(screen.getByText('Fork してクローン')).toBeInTheDocument();
    expect(screen.getByText('情報を追加')).toBeInTheDocument();
    expect(screen.getByText('PR を作成')).toBeInTheDocument();
  });
});
