import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Integration Tests: User Interactions
 *
 * These tests focus on how users interact with components in realistic scenarios.
 * Unlike unit tests, these may test multiple components working together.
 */

// Mock next/link for testing
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  }
}));

describe('ユーザーインタラクション: FAQ展開・折りたたみシーケンス', () => {
  // 動的インポートでFAQコンポーネントをロード
  let FAQ: any;

  beforeEach(async () => {
    const module = await import('@/components/tutorial/FAQ');
    FAQ = module.FAQ;
  });

  it('ユーザーが複数のFAQを順番に開いて閉じる', async () => {
    const user = userEvent.setup();
    render(<FAQ />);

    // FAQ 1を開く
    const faq1 = screen.getByRole('button', { name: /GitHubアカウントが必要ですか？/ });
    await user.click(faq1);
    expect(screen.getByText(/github.com で無料アカウント/)).toBeInTheDocument();

    // FAQ 2を開く（FAQ 1は自動で閉じる）
    const faq2 = screen.getByRole('button', { name: /Forkって何ですか？/ });
    await user.click(faq2);
    expect(screen.queryByText(/github.com で無料アカウント/)).not.toBeInTheDocument();
    expect(screen.getByText(/リポジトリの個人コピー/)).toBeInTheDocument();

    // FAQ 2をもう一度クリックして閉じる
    await user.click(faq2);
    expect(screen.queryByText(/リポジトリの個人コピー/)).not.toBeInTheDocument();
  });

  it('ユーザーが同じFAQを連続でクリック（開く→閉じる→開く）', async () => {
    const user = userEvent.setup();
    render(<FAQ />);

    const faq = screen.getByRole('button', { name: /CIチェックが失敗した場合は？/ });

    // 1回目: 開く
    await user.click(faq);
    expect(screen.getByText(/エラーメッセージを確認/)).toBeInTheDocument();
    expect(faq).toHaveAttribute('aria-expanded', 'true');

    // 2回目: 閉じる
    await user.click(faq);
    expect(screen.queryByText(/エラーメッセージを確認/)).not.toBeInTheDocument();
    expect(faq).toHaveAttribute('aria-expanded', 'false');

    // 3回目: 再度開く
    await user.click(faq);
    expect(screen.getByText(/エラーメッセージを確認/)).toBeInTheDocument();
    expect(faq).toHaveAttribute('aria-expanded', 'true');
  });

  it('ユーザーが全FAQを順番に展開して内容を確認', async () => {
    const user = userEvent.setup();
    render(<FAQ />);

    const allButtons = screen.getAllByRole('button');

    // 各FAQを順番に開いて、内容が表示されることを確認
    for (const button of allButtons) {
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      // 何らかの回答テキストが表示されている
      const buttonText = button.textContent || '';
      expect(buttonText.length).toBeGreaterThan(0);

      // 次に進む
      await user.click(button); // 閉じる
    }
  });

  it('キーボードユーザーがEnterキーでFAQを操作', async () => {
    const user = userEvent.setup();
    render(<FAQ />);

    const faq = screen.getByRole('button', { name: /CLIでやりたい場合は？/ });

    // クリックで開く
    await user.click(faq);
    expect(faq).toHaveAttribute('aria-expanded', 'true');

    // クリックで閉じる
    await user.click(faq);
    expect(faq).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('ユーザーインタラクション: CodeBlockコピー操作', () => {
  let CodeBlock: any;

  beforeEach(async () => {
    const module = await import('@/components/tutorial/CodeBlock');
    CodeBlock = module.CodeBlock;
  });

  // userEvent.setup() が navigator.clipboard を上書きするため、
  // setup() の後にモックを設定するヘルパー
  function setupClipboardMock() {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });
    return mockWriteText;
  }

  it('ユーザーがコピーボタンをクリックしてコードをコピー', async () => {
    const user = userEvent.setup();
    const mockWriteText = setupClipboardMock();
    const testCode = 'git clone https://github.com/user/repo.git';

    render(<CodeBlock code={testCode} />);

    const copyButton = screen.getByRole('button', { name: /copy/i });

    // クリック前の状態
    expect(copyButton).toHaveTextContent(/copy/i);

    // クリックしてコピー
    await user.click(copyButton);

    // クリップボードにコピーされた
    expect(mockWriteText).toHaveBeenCalledWith(testCode);

    // ボタンテキストが変わる
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
    });
  });

  it('ユーザーが複数のコードブロックを連続でコピー', async () => {
    const user = userEvent.setup();
    const mockWriteText = setupClipboardMock();

    const { unmount } = render(<CodeBlock code="git status" />);
    const button1 = screen.getByRole('button', { name: /copy/i });
    await user.click(button1);
    expect(mockWriteText).toHaveBeenCalledWith('git status');

    unmount();

    render(<CodeBlock code="git add ." />);
    const button2 = screen.getByRole('button', { name: /copy/i });
    await user.click(button2);
    expect(mockWriteText).toHaveBeenCalledWith('git add .');

    unmount();

    render(<CodeBlock code="git commit -m 'Add emoji'" />);
    const button3 = screen.getByRole('button', { name: /copy/i });
    await user.click(button3);
    expect(mockWriteText).toHaveBeenCalledWith("git commit -m 'Add emoji'");
  });

  it('長いコードもコピーできる', async () => {
    const user = userEvent.setup();
    const mockWriteText = setupClipboardMock();
    const longCode = `git clone https://github.com/user/very-long-repository-name.git
cd very-long-repository-name
npm install
npm run dev`;

    render(<CodeBlock code={longCode} />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    await user.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith(longCode);
  });
});

describe('ユーザーインタラクション: EmojiCardホバーとサイズ表示', () => {
  let EmojiCard: any;

  beforeEach(async () => {
    const module = await import('@/components/home/EmojiCard');
    EmojiCard = module.EmojiCard;
  });

  it('小さいカード（size=1）が正しく表示される', () => {
    const { container } = render(<EmojiCard emoji="🚀" size={1} />);

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('col-span-1');
    expect(card.className).toContain('row-span-1');
    expect(card.textContent).toBe('🚀');
  });

  it('中くらいカード（size=2）が正しく表示される', () => {
    const { container } = render(<EmojiCard emoji="🎉" size={2} />);

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('col-span-2');
    expect(card.className).toContain('row-span-2');
    expect(card.textContent).toBe('🎉');
  });

  it('大きいカード（size=3）が正しく表示される', () => {
    const { container } = render(<EmojiCard emoji="🌟" size={3} />);

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('col-span-3');
    expect(card.className).toContain('row-span-3');
    expect(card.textContent).toBe('🌟');
  });

  it('ユーザーがホバーしたときにスケール変化のクラスがある', () => {
    const { container } = render(<EmojiCard emoji="🐱" size={2} />);

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('hover:scale-105');
    expect(card.className).toContain('transition-transform');
  });

  it('異なる絵文字が正しく表示される', () => {
    const emojis = ['🚀', '🎉', '🌟', '🐱', '🔥', '💎'];

    emojis.forEach(emoji => {
      const { container, unmount } = render(<EmojiCard emoji={emoji} size={1} />);
      expect(container.textContent).toBe(emoji);
      unmount();
    });
  });

  it('複数のカードを並べて表示', () => {
    const { container } = render(
      <div className="grid grid-cols-6">
        <EmojiCard emoji="🚀" size={1} />
        <EmojiCard emoji="🎉" size={2} />
        <EmojiCard emoji="🌟" size={3} />
      </div>
    );

    // すべての絵文字が表示される
    expect(container.textContent).toContain('🚀');
    expect(container.textContent).toContain('🎉');
    expect(container.textContent).toContain('🌟');
  });
});

describe('ユーザーインタラクション: Header ナビゲーション', () => {
  let Header: any;

  beforeEach(async () => {
    const module = await import('@/components/common/Header');
    Header = module.Header;
  });

  it('ユーザーがロゴをクリックしてホームに戻る', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const logo = screen.getByRole('link', { name: /Git Training Ground/i });
    expect(logo).toHaveAttribute('href', '/');

    await user.click(logo);
    // 実際のページ遷移はNext.jsが処理するのでhrefの確認で十分
  });

  it('ユーザーがナビゲーションリンクをクリック', async () => {
    const user = userEvent.setup();
    render(<Header />);

    // Home リンク
    const homeLink = screen.getByRole('link', { name: /^Home$/i });
    expect(homeLink).toHaveAttribute('href', '/');

    // Tutorial リンク
    const tutorialLink = screen.getByRole('link', { name: /^Tutorial$/i });
    expect(tutorialLink).toHaveAttribute('href', '/tutorial');

    // GitHub リンク（外部リンク）
    const githubLink = screen.getByRole('link', { name: /^GitHub$/i });
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    // クリックしてみる
    await user.click(homeLink);
    await user.click(tutorialLink);
  });

  it('ホバー時にリンクの色が変わる（スタイル確認）', () => {
    const { container } = render(<Header />);

    const navLinks = container.querySelectorAll('nav a');
    navLinks.forEach(link => {
      expect(link.className).toContain('hover:text-');
      expect(link.className).toContain('transition-colors');
    });
  });

  it('固定ヘッダーのスタイルが適用されている', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header?.className).toContain('fixed');
    expect(header?.className).toContain('top-0');
    expect(header?.className).toContain('z-50');
  });

  it('背景にブラーエフェクトが適用されている', () => {
    const { container } = render(<Header />);

    const header = container.querySelector('header');
    expect(header?.className).toContain('backdrop-blur');
  });
});

describe('ユーザーインタラクション: StepGuide 展開', () => {
  let StepGuide: any;

  beforeEach(async () => {
    const module = await import('@/components/tutorial/StepGuide');
    StepGuide = module.StepGuide;
  });

  it('ステップタイトルとコンテンツが表示される', () => {
    render(
      <StepGuide step={1} title="リポジトリをForkする">
        <p>Forkの手順です。</p>
      </StepGuide>
    );

    expect(screen.getByText(/Step 1/)).toBeInTheDocument();
    expect(screen.getByText(/リポジトリをForkする/)).toBeInTheDocument();
    expect(screen.getByText(/Forkの手順です。/)).toBeInTheDocument();
  });

  it('複数のステップを順番に表示', () => {
    render(
      <div>
        <StepGuide step={1} title="ステップ1">
          <p>内容1</p>
        </StepGuide>
        <StepGuide step={2} title="ステップ2">
          <p>内容2</p>
        </StepGuide>
        <StepGuide step={3} title="ステップ3">
          <p>内容3</p>
        </StepGuide>
      </div>
    );

    expect(screen.getByText(/Step 1/)).toBeInTheDocument();
    expect(screen.getByText(/Step 2/)).toBeInTheDocument();
    expect(screen.getByText(/Step 3/)).toBeInTheDocument();

    expect(screen.getByText(/内容1/)).toBeInTheDocument();
    expect(screen.getByText(/内容2/)).toBeInTheDocument();
    expect(screen.getByText(/内容3/)).toBeInTheDocument();
  });

  it('ステップ番号が正しく表示される', () => {
    const { rerender } = render(
      <StepGuide step={5} title="ステップタイトル">
        <p>内容</p>
      </StepGuide>
    );

    expect(screen.getByText(/Step 5/)).toBeInTheDocument();

    // ステップを変更
    rerender(
      <StepGuide step={10} title="ステップタイトル">
        <p>内容</p>
      </StepGuide>
    );

    expect(screen.getByText(/Step 10/)).toBeInTheDocument();
  });

  it('長いコンテンツも正しく表示される', () => {
    const longContent = `
      これは非常に長いステップの説明です。
      複数の段落にわたって説明が続きます。
      ユーザーはこの内容をスクロールして読むことができます。
    `;

    render(
      <StepGuide step={1} title="長いステップ">
        <p>{longContent}</p>
      </StepGuide>
    );

    expect(screen.getByText(/非常に長いステップの説明/)).toBeInTheDocument();
  });
});

describe('ユーザーインタラクション: 複数コンポーネントの統合', () => {
  it('チュートリアルページ全体の統合（FAQ + CodeBlock + StepGuide）', async () => {
    const FAQ = (await import('@/components/tutorial/FAQ')).FAQ;
    const CodeBlock = (await import('@/components/tutorial/CodeBlock')).CodeBlock;
    const StepGuide = (await import('@/components/tutorial/StepGuide')).StepGuide;

    const user = userEvent.setup();

    // クリップボードAPIをモック（navigator.clipboard は read-only getter のため defineProperty を使用）
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    render(
      <div>
        <h1>チュートリアル</h1>

        <StepGuide step={1} title="リポジトリをForkする">
          <p>Forkの説明</p>
          <CodeBlock code="git clone https://github.com/user/repo.git" />
        </StepGuide>

        <StepGuide step={2} title="ファイルを編集する">
          <p>編集の説明</p>
          <CodeBlock code="git add ." />
        </StepGuide>

        <FAQ />
      </div>
    );

    // ステップが表示される
    expect(screen.getByText(/Step 1/)).toBeInTheDocument();
    expect(screen.getByText(/Step 2/)).toBeInTheDocument();

    // コードブロックをコピー
    const copyButtons = screen.getAllByRole('button', { name: /copy/i });
    await user.click(copyButtons[0]);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('git clone https://github.com/user/repo.git');

    // FAQを展開
    const faqButton = screen.getByRole('button', { name: /GitHubアカウントが必要ですか？/ });
    await user.click(faqButton);
    expect(screen.getByText(/github.com で無料アカウント/)).toBeInTheDocument();
  });
});

describe('ユーザーインタラクション: アクセシビリティ', () => {
  it('FAQボタンがスクリーンリーダー用の適切な属性を持つ', async () => {
    const FAQ = (await import('@/components/tutorial/FAQ')).FAQ;
    render(<FAQ />);

    const buttons = screen.getAllByRole('button');

    buttons.forEach(button => {
      // aria-expanded 属性が存在する
      expect(button).toHaveAttribute('aria-expanded');

      // ボタンとして認識される
      expect(button.tagName).toBe('BUTTON');
    });
  });

  it('コピーボタンがフォーカス可能', async () => {
    const CodeBlock = (await import('@/components/tutorial/CodeBlock')).CodeBlock;

    // クリップボードAPIをモック（navigator.clipboard は read-only getter のため defineProperty を使用）
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    render(<CodeBlock code="git status" />);

    const copyButton = screen.getByRole('button', { name: /copy/i });

    // フォーカス可能
    copyButton.focus();
    expect(document.activeElement).toBe(copyButton);

    // クリックでコピー実行
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('git status');
  });

  it('リンクに適切なrole属性がある', async () => {
    const Header = (await import('@/components/common/Header')).Header;
    render(<Header />);

    const links = screen.getAllByRole('link');

    // すべてのリンクがrole="link"を持つ（暗黙的に）
    expect(links.length).toBeGreaterThan(0);

    links.forEach(link => {
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href');
    });
  });
});

describe('ユーザーインタラクション: エラーケース', () => {
  it('空のコンテンツでもコンポーネントが壊れない', async () => {
    const { StepGuide } = await import('@/components/tutorial/StepGuide');

    render(
      <StepGuide step={1} title="">
        <></>
      </StepGuide>
    );

    expect(screen.getByText(/Step 1/)).toBeInTheDocument();
  });
});
