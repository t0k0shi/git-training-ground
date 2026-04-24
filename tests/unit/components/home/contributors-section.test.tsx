import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContributorsSection } from '@/components/home/ContributorsSection';
import type { ContributorWithDerived } from '@/lib/types';

const makeContributor = (overrides: Partial<ContributorWithDerived> = {}): ContributorWithDerived => ({
  name: 'user',
  github: 'user',
  favoriteColor: '#123456',
  favoriteEmoji: '🎉',
  message: 'hi',
  joinedAt: '2026-04-24',
  handle: 'user',
  avatarUrl: 'https://github.com/user.png?size=80',
  isNew: false,
  ...overrides,
});

const mixed: ContributorWithDerived[] = [
  makeContributor({ handle: 'alice', github: 'alice', isNew: true }),
  makeContributor({ handle: 'bob', github: 'bob', isNew: false }),
  makeContributor({ handle: 'carol', github: 'carol', isNew: true }),
  makeContributor({ handle: 'dave', github: 'dave', isNew: false }),
];

describe('ContributorsSection', () => {
  it('見出しに contributors の人数が含まれる', () => {
    render(<ContributorsSection contributors={mixed} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('4');
  });

  it('初期表示は全員フィルターで全 contributors を表示する', () => {
    render(<ContributorsSection contributors={mixed} />);
    expect(screen.getByText('@alice')).toBeInTheDocument();
    expect(screen.getByText('@bob')).toBeInTheDocument();
    expect(screen.getByText('@carol')).toBeInTheDocument();
    expect(screen.getByText('@dave')).toBeInTheDocument();
  });

  it('セグメント「今週の新顔」ボタンのラベルに isNew の件数が含まれる', () => {
    render(<ContributorsSection contributors={mixed} />);
    const newButton = screen.getByRole('button', { name: /今週の新顔/ });
    expect(newButton).toHaveTextContent('2'); // alice + carol
  });

  it('「今週の新顔」に切り替えると isNew=true のカードのみ表示される', async () => {
    const user = userEvent.setup();
    render(<ContributorsSection contributors={mixed} />);

    await user.click(screen.getByRole('button', { name: /今週の新顔/ }));

    expect(screen.getByText('@alice')).toBeInTheDocument();
    expect(screen.getByText('@carol')).toBeInTheDocument();
    expect(screen.queryByText('@bob')).not.toBeInTheDocument();
    expect(screen.queryByText('@dave')).not.toBeInTheDocument();
  });

  it('「全員」に戻すと再び全 contributors が表示される', async () => {
    const user = userEvent.setup();
    render(<ContributorsSection contributors={mixed} />);

    await user.click(screen.getByRole('button', { name: /今週の新顔/ }));
    await user.click(screen.getByRole('button', { name: /全員/ }));

    expect(screen.getByText('@bob')).toBeInTheDocument();
    expect(screen.getByText('@dave')).toBeInTheDocument();
  });
});
