import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SiteHeader } from '@/components/layout/SiteHeader';

// Link を素の <a> として扱う
type LinkMockProps = AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode };
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: LinkMockProps) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const mockPathname = vi.fn<() => string>();
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

describe('SiteHeader', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/');
  });

  it('T1: ロゴ・チュートリアル・参加者・Repo のリンクがある', () => {
    render(<SiteHeader />);
    expect(screen.getByRole('link', { name: 'git-training-ground' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'チュートリアル' })).toHaveAttribute('href', '/tutorial');
    expect(screen.getByRole('link', { name: '参加者' })).toHaveAttribute('href', '/#contributors');
    expect(screen.getByRole('link', { name: 'Repo' })).toHaveAttribute(
      'href',
      'https://github.com/t0k0shi/git-training-ground',
    );
  });

  it('T2: /tutorial ではチュートリアルのリンクだけに aria-current="page" が付く', () => {
    mockPathname.mockReturnValue('/tutorial');
    render(<SiteHeader />);
    expect(screen.getByRole('link', { name: 'チュートリアル' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'git-training-ground' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: '参加者' })).not.toHaveAttribute('aria-current');
  });

  it('T2: 末尾にスラッシュがある /tutorial/ でもチュートリアルに付く', () => {
    mockPathname.mockReturnValue('/tutorial/');
    render(<SiteHeader />);
    expect(screen.getByRole('link', { name: 'チュートリアル' })).toHaveAttribute('aria-current', 'page');
  });

  it('T2: / ではロゴだけに aria-current="page" が付く', () => {
    render(<SiteHeader />);
    expect(screen.getByRole('link', { name: 'git-training-ground' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'チュートリアル' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: '参加者' })).not.toHaveAttribute('aria-current');
  });

  it('トップにいるときの「参加者」は、ページを移らずに参加者の一覧までスクロールする', () => {
    const target = document.createElement('section');
    target.id = 'contributors';
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);
    render(<SiteHeader />);
    const clicked = fireEvent.click(screen.getByRole('link', { name: '参加者' }));
    expect(clicked).toBe(false); // preventDefault された
    expect(target.scrollIntoView).toHaveBeenCalled();
    target.remove();
  });

  it('トップ以外では「参加者」のクリックを横取りしない（トップに移ってから移動する）', () => {
    mockPathname.mockReturnValue('/tutorial');
    render(<SiteHeader />);
    const clicked = fireEvent.click(screen.getByRole('link', { name: '参加者' }));
    expect(clicked).toBe(true);
  });

  it('リンクを navigation のランドマークで囲む', () => {
    render(<SiteHeader />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
