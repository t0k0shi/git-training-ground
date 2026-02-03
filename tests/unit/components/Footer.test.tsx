import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/common/Footer';

describe('Footer', () => {
  it('MIT License テキストが表示される', () => {
    render(<Footer />);
    const licenseText = screen.getByText(/MIT License/i);
    expect(licenseText).toBeInTheDocument();
  });

  it('GitHub リンクが存在する', () => {
    render(<Footer />);
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('Code of Conduct リンクが存在する', () => {
    render(<Footer />);
    const conductLink = screen.getByRole('link', { name: /code of conduct/i });
    expect(conductLink).toBeInTheDocument();
  });
});
