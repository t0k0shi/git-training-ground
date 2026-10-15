import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContributorsSection } from '@/components/home/ContributorsSection';
import type { ContributorWithDerived } from '@/lib/types';

const makeContributor = (overrides: Partial<ContributorWithDerived> = {}): ContributorWithDerived => ({
  name: 'user',
  favoriteColor: '#123456',
  favoriteEmoji: '🎉',
  message: 'hi',
  joinedAt: '2026-04-24',
  id: 'entry-0',
  avatarUrl: 'https://avatars.githubusercontent.com/u/3?s=80',
  isNew: false,
  ...overrides,
});

const mixed: ContributorWithDerived[] = [
  makeContributor({ id: 'alice', name: 'alice', isNew: true }),
  makeContributor({ id: 'bob', name: 'bob', isNew: false }),
  makeContributor({ id: 'carol', name: 'carol', isNew: true }),
  makeContributor({ id: 'dave', name: 'dave', isNew: false }),
];

describe('ContributorsSection', () => {
  it('同じ人の 2 回目の参加（+2）も別のカードとして表示し、key がぶつからない', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const twice = [
      makeContributor({ id: 'alice', name: 'alice', message: '1回目' }),
      makeContributor({ id: 'alice+2', name: 'alice', message: '2回目' }),
    ];
    render(<ContributorsSection contributors={twice} />);
    expect(screen.getAllByText('alice')).toHaveLength(2);
    const keyWarnings = errorSpy.mock.calls.filter((args) => String(args[0]).includes('same key'));
    errorSpy.mockRestore();
    expect(keyWarnings).toEqual([]);
  });

  it('見出しに contributors の人数が含まれる', () => {
    render(<ContributorsSection contributors={mixed} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('4');
  });

  it('初期表示は全員フィルターで全 contributors を表示する', () => {
    render(<ContributorsSection contributors={mixed} />);
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('bob')).toBeInTheDocument();
    expect(screen.getByText('carol')).toBeInTheDocument();
    expect(screen.getByText('dave')).toBeInTheDocument();
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

    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('carol')).toBeInTheDocument();
    expect(screen.queryByText('bob')).not.toBeInTheDocument();
    expect(screen.queryByText('dave')).not.toBeInTheDocument();
  });

  it('「全員」に戻すと再び全 contributors が表示される', async () => {
    const user = userEvent.setup();
    render(<ContributorsSection contributors={mixed} />);

    await user.click(screen.getByRole('button', { name: /今週の新顔/ }));
    await user.click(screen.getByRole('button', { name: /全員/ }));

    expect(screen.getByText('bob')).toBeInTheDocument();
    expect(screen.getByText('dave')).toBeInTheDocument();
  });
  // contributors.json の並び（追加された順）の逆。joinedAt は手で書くので、並びには使わない
  it('カードは新しく追加された順（contributors.json の後ろから）に並ぶ', () => {
    render(<ContributorsSection contributors={mixed} />);
    const names = screen.getAllByTestId('contributor-card').map((card) => card.querySelector('p')?.textContent);
    expect(names).toEqual(['dave', 'carol', 'bob', 'alice']);
  });

  it('「今週の新顔」でも新しい順に並ぶ', async () => {
    const user = userEvent.setup();
    render(<ContributorsSection contributors={mixed} />);

    await user.click(screen.getByRole('button', { name: /今週の新顔/ }));

    const names = screen.getAllByTestId('contributor-card').map((card) => card.querySelector('p')?.textContent);
    expect(names).toEqual(['carol', 'alice']);
  });

  it('並べ替えても、渡された配列は書き換えない', () => {
    const input = [...mixed];
    render(<ContributorsSection contributors={input} />);
    expect(input.map((c) => c.name)).toEqual(['alice', 'bob', 'carol', 'dave']);
  });
});
