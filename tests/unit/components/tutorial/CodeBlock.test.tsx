import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CodeBlock } from '@/components/tutorial/CodeBlock';

describe('CodeBlock', () => {
  it('コードテキストが表示される', () => {
    render(<CodeBlock code="git clone https://example.com" />);

    expect(screen.getByText('git clone https://example.com')).toBeInTheDocument();
  });

  it('languageが表示される', () => {
    render(<CodeBlock code="const x = 1;" language="javascript" />);

    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('デフォルトのlanguageはbashである', () => {
    render(<CodeBlock code="ls -la" />);

    expect(screen.getByText('bash')).toBeInTheDocument();
  });

  it('コピーボタンが存在する', () => {
    render(<CodeBlock code="git status" />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    expect(copyButton).toBeInTheDocument();
  });

  it('コピーボタンをクリックするとクリップボードにコピーされる', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<CodeBlock code="git add ." />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    expect(writeTextMock).toHaveBeenCalledWith('git add .');
  });

  it('コピー後にボタンテキストが変わる', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<CodeBlock code="npm install" />);

    const copyButton = screen.getByRole('button', { name: /copy/i });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
    });
  });

  it('ダークテーマのTailwindスタイルが適用される', () => {
    const { container } = render(<CodeBlock code="echo hello" />);

    const header = container.querySelector('.bg-gray-800');
    expect(header).toBeInTheDocument();

    const pre = container.querySelector('pre.bg-gray-900');
    expect(pre).toBeInTheDocument();
  });
});
