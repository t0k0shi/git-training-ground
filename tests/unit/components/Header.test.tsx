import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/common/Header';

describe('Header', () => {
  it('"Git Training Ground" ロゴテキストが表示される', () => {
    render(<Header />);
    const logo = screen.getByRole('link', { name: /git training ground/i });
    expect(logo).toBeInTheDocument();
  });

  it('Home, Tutorial, GitHub の3つのナビリンクが存在する', () => {
    render(<Header />);
    const homeLink = screen.getByRole('link', { name: /home/i });
    const tutorialLink = screen.getByRole('link', { name: /tutorial/i });
    const githubLink = screen.getByRole('link', { name: /github/i });

    expect(homeLink).toBeInTheDocument();
    expect(tutorialLink).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
  });

  it('GitHub リンクが target="_blank" を持つ', () => {
    render(<Header />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
