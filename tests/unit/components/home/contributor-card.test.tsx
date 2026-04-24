import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContributorCard } from '@/components/home/ContributorCard';
import type { ContributorWithDerived } from '@/lib/types';

const makeContributor = (overrides: Partial<ContributorWithDerived> = {}): ContributorWithDerived => ({
  name: 'ketts',
  github: 't0k0shi',
  favoriteColor: '#E63946',
  favoriteEmoji: '🚀',
  message: 'はじめてのOSS貢献！',
  joinedAt: '2026-04-24',
  handle: 't0k0shi',
  avatarUrl: 'https://github.com/t0k0shi.png?size=80',
  isNew: false,
  ...overrides,
});

describe('ContributorCard', () => {
  it('favoriteEmoji / @handle / message / 参加日を表示する', () => {
    render(<ContributorCard contributor={makeContributor()} />);

    expect(screen.getByText('🚀')).toBeInTheDocument();
    expect(screen.getByText('@t0k0shi')).toBeInTheDocument();
    expect(screen.getByText('「はじめてのOSS貢献！」')).toBeInTheDocument();
    expect(screen.getByText('2026/04/24')).toBeInTheDocument();
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
    const img = screen.getByAltText('t0k0shi') as HTMLImageElement;
    expect(img.src).toContain('github.com/t0k0shi.png');
    expect(img.getAttribute('loading')).toBe('lazy');
  });

  it('onError で img の display が none になる', () => {
    render(<ContributorCard contributor={makeContributor()} />);
    const img = screen.getByAltText('t0k0shi') as HTMLImageElement;

    // Simulate image load error
    img.dispatchEvent(new Event('error'));

    expect(img.style.display).toBe('none');
  });

  it('favoriteColor がボーダー色に反映される', () => {
    const { container } = render(
      <ContributorCard contributor={makeContributor({ favoriteColor: '#AABBCC' })} />,
    );
    const card = container.querySelector('[data-testid="contributor-card"]') as HTMLElement;
    expect(card.style.borderColor).toBe('rgb(170, 187, 204)'); // #AABBCC
  });

  it('favoriteColor がグロー box-shadow に反映される', () => {
    const { container } = render(
      <ContributorCard contributor={makeContributor({ favoriteColor: '#112233' })} />,
    );
    const card = container.querySelector('[data-testid="contributor-card"]') as HTMLElement;
    expect(card.style.boxShadow).toContain('#112233');
  });
});
