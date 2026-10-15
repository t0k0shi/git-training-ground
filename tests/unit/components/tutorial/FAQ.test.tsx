import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FAQ } from '@/components/tutorial/FAQ';

describe('FAQ', () => {
  it('質問テキストが表示される', () => {
    render(<FAQ />);

    expect(screen.getByText('GitHubアカウントが必要ですか？')).toBeInTheDocument();
    expect(screen.getByText('Forkって何ですか？')).toBeInTheDocument();
    expect(screen.getByText('CIチェックが失敗した場合は？')).toBeInTheDocument();
    expect(screen.getByText('PRがマージされない場合は？')).toBeInTheDocument();
    expect(screen.getByText('コンフリクトが起きた場合は？')).toBeInTheDocument();
    expect(screen.getByText('コマンドラインでやりたい場合は？')).toBeInTheDocument();
    expect(screen.getByText('「JSONの形式が不正」というエラーが出た')).toBeInTheDocument();
    expect(screen.getByText('「他の人のエントリが削除または変更されています」エラーが出た')).toBeInTheDocument();
  });

  // v6: github 欄をなくし、表示はニックネームにした（ADR-0016）
  it('ニックネームと 2 回目の参加の質問があり、ハンドル名・+2 の案内は残っていない', () => {
    const { container } = render(<FAQ />);

    expect(screen.getByText('本名を出したくない')).toBeInTheDocument();
    expect(screen.getByText('2回目も参加できますか？')).toBeInTheDocument();
    expect(screen.queryByText(/github のハンドル名が、PR を出した人と違います/)).not.toBeInTheDocument();

    // 回答は 1 つずつしか開かないので、1 問ずつ開いて確かめる
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(10);
    for (const button of buttons) {
      fireEvent.click(button);
      expect(container.textContent, button.textContent ?? '').not.toContain('+2');
      expect(container.textContent, button.textContent ?? '').not.toContain('CV-07');
      expect(container.textContent, button.textContent ?? '').not.toContain('Commit suggestion');
    }
  });

  it('初期状態では回答が表示されない', () => {
    render(<FAQ />);

    expect(screen.queryByText(/github.com で無料アカウント/)).not.toBeInTheDocument();
  });

  it('クリックで回答が表示される', () => {
    render(<FAQ />);

    const question = screen.getByRole('button', { name: /GitHubアカウントが必要ですか？/ });
    fireEvent.click(question);

    expect(screen.getByText(/github.com で無料アカウント/)).toBeInTheDocument();
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

    const question1 = screen.getByRole('button', { name: /GitHubアカウントが必要ですか？/ });
    const question2 = screen.getByRole('button', { name: /CIチェックが失敗した場合は？/ });

    fireEvent.click(question1);
    expect(screen.getByText(/github.com で無料アカウント/)).toBeInTheDocument();

    fireEvent.click(question2);
    expect(screen.queryByText(/github.com で無料アカウント/)).not.toBeInTheDocument();
    expect(screen.getByText(/エラーメッセージを確認/)).toBeInTheDocument();
  });

  it('aria-expanded属性が適切に設定される', () => {
    render(<FAQ />);

    const question = screen.getByRole('button', { name: /Forkって何ですか？/ });

    expect(question).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(question);
    expect(question).toHaveAttribute('aria-expanded', 'true');
  });
});
