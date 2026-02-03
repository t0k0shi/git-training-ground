import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TutorialPage from '@/app/tutorial/page';

describe('TutorialPage', () => {
  it('ページタイトルが表示される', () => {
    render(<TutorialPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'はじめてのPRチュートリアル' })).toBeInTheDocument();
  });

  it('9つのステップが表示される', () => {
    render(<TutorialPage />);

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    expect(screen.getByText('Step 4')).toBeInTheDocument();
    expect(screen.getByText('Step 5')).toBeInTheDocument();
    expect(screen.getByText('Step 6')).toBeInTheDocument();
    expect(screen.getByText('Step 7')).toBeInTheDocument();
    expect(screen.getByText('Step 8')).toBeInTheDocument();
    expect(screen.getByText('Step 9')).toBeInTheDocument();
  });

  it('ステップタイトルが表示される', () => {
    render(<TutorialPage />);

    expect(screen.getByText('リポジトリをForkする')).toBeInTheDocument();
    expect(screen.getByText('ローカルにCloneする')).toBeInTheDocument();
    expect(screen.getByText('Pull Requestを作成する')).toBeInTheDocument();
  });

  it('CodeBlockコンポーネントが含まれる', () => {
    render(<TutorialPage />);

    expect(screen.getByText(/git clone https:\/\/github.com/)).toBeInTheDocument();
    expect(screen.getByText(/git checkout -b/)).toBeInTheDocument();
  });

  it('FAQセクションが存在する', () => {
    render(<TutorialPage />);

    expect(screen.getByRole('heading', { level: 2, name: 'よくある質問' })).toBeInTheDocument();
  });

  it('前提条件セクションが存在する', () => {
    render(<TutorialPage />);

    expect(screen.getByRole('heading', { level: 2, name: '前提条件' })).toBeInTheDocument();
    expect(screen.getByText('git --version')).toBeInTheDocument();
    expect(screen.getByText(/GitHub アカウント/)).toBeInTheDocument();
  });
});
