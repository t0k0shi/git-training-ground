import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TutorialPage from '@/app/tutorial/page';

describe('TutorialPage', () => {
  it('ページタイトルが表示される', () => {
    render(<TutorialPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'はじめてのPRチュートリアル' })).toBeInTheDocument();
  });

  it('8つのステップが表示される', () => {
    render(<TutorialPage />);

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    expect(screen.getByText('Step 4')).toBeInTheDocument();
    expect(screen.getByText('Step 5')).toBeInTheDocument();
    expect(screen.getByText('Step 6')).toBeInTheDocument();
    expect(screen.getByText('Step 7')).toBeInTheDocument();
    expect(screen.getByText('Step 8')).toBeInTheDocument();
  });

  it('ステップタイトルが表示される', () => {
    render(<TutorialPage />);

    expect(screen.getByText('リポジトリをForkする')).toBeInTheDocument();
    expect(screen.getByText('contributors.json を開く')).toBeInTheDocument();
    expect(screen.getByText('Pull Requestを作成する')).toBeInTheDocument();
  });

  it('CLI版への案内セクションが存在する', () => {
    render(<TutorialPage />);

    expect(screen.getByText('CLIで操作したい方へ')).toBeInTheDocument();
    expect(screen.getByText('CLI版の手順を見る')).toBeInTheDocument();
  });

  it('FAQセクションが存在する', () => {
    render(<TutorialPage />);

    expect(screen.getByRole('heading', { level: 2, name: 'よくある質問' })).toBeInTheDocument();
  });

  it('前提条件セクションが存在する', () => {
    render(<TutorialPage />);

    expect(screen.getByRole('heading', { level: 2, name: '必要なもの' })).toBeInTheDocument();
    expect(screen.getByText(/GitHub アカウント/)).toBeInTheDocument();
    expect(screen.getByText(/これを読んでいるなら準備OK/)).toBeInTheDocument();
  });

  it('Gitインストール不要のメッセージが表示される', () => {
    render(<TutorialPage />);

    expect(screen.getByText(/Gitのインストールは不要/)).toBeInTheDocument();
  });
});
