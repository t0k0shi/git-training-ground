import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContributorCard } from '@/components/home/ContributorCard';
import type { ContributorWithDerived } from '@/lib/types';

const makeContributor = (overrides: Partial<ContributorWithDerived> = {}): ContributorWithDerived => ({
  name: 'ketts',
  favoriteColor: '#E63946',
  favoriteEmoji: '🚀',
  message: 'はじめてのOSS貢献！',
  joinedAt: '2026-04-24',
  id: 'entry-0',
  avatarUrl: 'https://avatars.githubusercontent.com/u/3?s=80',
  isNew: false,
  ...overrides,
});

describe('ContributorCard', () => {
  it('favoriteEmoji / name / message / 参加日を表示する', () => {
    render(<ContributorCard contributor={makeContributor()} />);

    expect(screen.getByText('🚀')).toBeInTheDocument();
    expect(screen.getByText('ketts')).toBeInTheDocument();
    expect(screen.getByText('「はじめてのOSS貢献！」')).toBeInTheDocument();
    expect(screen.getByText('2026/04/24')).toBeInTheDocument();
  });

  it('github のハンドル名はカードに表示しない（本名に近いハンドル名の人もいるため、表示は name だけ）', () => {
    const { container } = render(<ContributorCard contributor={makeContributor()} />);
    expect(container.textContent).not.toContain('t0k0shi');
    expect(container.innerHTML).not.toContain('alt="t0k0shi"');
  });

  it('アバターがない（avatarUrl が null）ときは img を出さない', () => {
    const { container } = render(<ContributorCard contributor={makeContributor({ avatarUrl: null })} />);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('ketts')).toBeInTheDocument();
  });

  it('isNew=true のとき NEW バッジが表示される', () => {
    render(<ContributorCard contributor={makeContributor({ isNew: true })} />);
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('isNew=false のとき NEW バッジは表示されない', () => {
    render(<ContributorCard contributor={makeContributor({ isNew: false })} />);
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });

  it('アバター img の src に avatarUrl が設定される', () => {
    render(<ContributorCard contributor={makeContributor()} />);
    const img = screen.getByAltText('ketts') as HTMLImageElement;
    expect(img.src).toBe('https://avatars.githubusercontent.com/u/3?s=80');
    expect(img.getAttribute('loading')).toBe('lazy');
  });

  it('アバターの読み込みに失敗したら img を消す', () => {
    const { container } = render(<ContributorCard contributor={makeContributor()} />);
    fireEvent.error(screen.getByAltText('ketts'));
    expect(container.querySelector('img')).toBeNull();
  });

  it('favoriteColor がボーダー色に反映される', () => {
    const { container } = render(
      <ContributorCard contributor={makeContributor({ favoriteColor: '#AABBCC' })} />,
    );
    const card = container.querySelector('[data-testid="contributor-card"]') as HTMLElement;
    expect(card.style.borderColor).toBe('rgb(170, 187, 204)'); // #AABBCC
  });

  it('favoriteColor がグロー用 CSS 変数 --glow-color に反映される', () => {
    const { container } = render(
      <ContributorCard contributor={makeContributor({ favoriteColor: '#112233' })} />,
    );
    const card = container.querySelector('[data-testid="contributor-card"]') as HTMLElement;
    expect(card.style.getPropertyValue('--glow-color')).toBe('#112233');
  });
});
