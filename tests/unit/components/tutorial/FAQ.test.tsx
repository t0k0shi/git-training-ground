import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FAQ } from '@/components/tutorial/FAQ';

describe('FAQ', () => {
  it('質問テキストが表示される', () => {
    render(<FAQ />);

    expect(screen.getByText('コンフリクトが起きた場合は？')).toBeInTheDocument();
    expect(screen.getByText('CIチェックが失敗した場合は？')).toBeInTheDocument();
    expect(screen.getByText('PRがマージされない場合は？')).toBeInTheDocument();
    expect(screen.getByText('Gitをインストールしていません')).toBeInTheDocument();
    expect(screen.getByText('GitHubアカウントが必要ですか？')).toBeInTheDocument();
    expect(screen.getByText('Forkって何ですか？')).toBeInTheDocument();
    expect(screen.getByText('prNumberは何を書けばいいですか？')).toBeInTheDocument();
  });

  it('初期状態では回答が表示されない', () => {
    render(<FAQ />);

    expect(screen.queryByText(/最新のmainブランチ/)).not.toBeInTheDocument();
  });

  it('クリックで回答が表示される', () => {
    render(<FAQ />);

    const question = screen.getByRole('button', { name: /コンフリクトが起きた場合は？/ });
    fireEvent.click(question);

    expect(screen.getByText(/最新のmainブランチ/)).toBeInTheDocument();
  });

  it('再クリックで回答が閉じる', () => {
    render(<FAQ />);

    const question = screen.getByRole('button', { name: /CIチェックが失敗した場合は？/ });

    // 1回目クリック: 開く
    fireEvent.click(question);
    expect(screen.getByText(/エラーメッセージを確認/)).toBeInTheDocument();

    // 2回目クリック: 閉じる
    fireEvent.click(question);
    expect(screen.queryByText(/エラーメッセージを確認/)).not.toBeInTheDocument();
  });

  it('別の質問をクリックすると前の回答が閉じる', () => {
    render(<FAQ />);

    const question1 = screen.getByRole('button', { name: /コンフリクトが起きた場合は？/ });
    const question2 = screen.getByRole('button', { name: /CIチェックが失敗した場合は？/ });

    fireEvent.click(question1);
    expect(screen.getByText(/最新のmainブランチ/)).toBeInTheDocument();

    fireEvent.click(question2);
    expect(screen.queryByText(/最新のmainブランチ/)).not.toBeInTheDocument();
    expect(screen.getByText(/エラーメッセージを確認/)).toBeInTheDocument();
  });

  it('aria-expanded属性が適切に設定される', () => {
    render(<FAQ />);

    const question = screen.getByRole('button', { name: /コンフリクトが起きた場合は？/ });

    expect(question).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(question);
    expect(question).toHaveAttribute('aria-expanded', 'true');
  });
});
