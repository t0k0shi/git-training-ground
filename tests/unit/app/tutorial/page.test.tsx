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

    for (let i = 1; i <= 9; i++) {
      expect(screen.getByText(`Step ${i}`)).toBeInTheDocument();
    }
  });

  it('ステップタイトルが表示される', () => {
    render(<TutorialPage />);

    expect(screen.getByText('リポジトリをForkする')).toBeInTheDocument();
    expect(screen.getByText('emojis.txt を開く')).toBeInTheDocument();
    expect(screen.getByText('好きな絵文字を追加する')).toBeInTheDocument();
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

  it('Fork注意喚起が表示される (T-05)', () => {
    render(<TutorialPage />);

    expect(screen.getByText(/Forkにコミットしただけでは反映されません/)).toBeInTheDocument();
  });

  it('コンフリクト誘導リンクが存在する (T-05)', () => {
    render(<TutorialPage />);

    expect(screen.getByText(/コンフリクトについて/)).toBeInTheDocument();
  });

  it('コンフリクト解決セクションが存在する (T-06)', () => {
    render(<TutorialPage />);

    expect(screen.getByText('コンフリクトが起きたら')).toBeInTheDocument();
  });

  it('コンフリクト安心メッセージが表示される (T-06)', () => {
    render(<TutorialPage />);

    expect(screen.getByText(/心配しないでください/)).toBeInTheDocument();
    expect(screen.getByText(/管理人がマージ時に調整します/)).toBeInTheDocument();
  });

  it('コンフリクト解決ステップ A-D が表示される (T-06)', () => {
    render(<TutorialPage />);

    expect(screen.getByText(/upstream を登録する/)).toBeInTheDocument();
    expect(screen.getByText(/upstream の最新を取得する/)).toBeInTheDocument();
    expect(screen.getByText(/コンフリクトを解決する/)).toBeInTheDocument();
    expect(screen.getByText(/解決をコミットして push する/)).toBeInTheDocument();
  });

  it('コンフリクトセクションに「やらなくても大丈夫」メッセージがある (T-06)', () => {
    render(<TutorialPage />);

    expect(screen.getByText(/やらなくても大丈夫/)).toBeInTheDocument();
  });
});
