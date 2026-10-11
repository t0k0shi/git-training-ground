import { describe, it, expect, afterEach, vi } from 'vitest';
import { shareSite } from '@/lib/share';

describe('shareSite', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('navigator.share があるとき、タイトルと現在の URL を渡して呼ぶ', () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { share });

    shareSite();

    expect(share).toHaveBeenCalledTimes(1);
    expect(share).toHaveBeenCalledWith({
      title: 'git-training-ground',
      url: window.location.href,
    });
  });

  it('navigator.share がないとき、何もせず例外も出さない', () => {
    vi.stubGlobal('navigator', {});

    expect(() => shareSite()).not.toThrow();
  });

  it('share が reject されても、未処理の rejection にならない', async () => {
    const share = vi.fn().mockRejectedValue(new DOMException('cancel', 'AbortError'));
    vi.stubGlobal('navigator', { share });
    const onUnhandled = vi.fn();
    process.on('unhandledRejection', onUnhandled);

    shareSite();
    await new Promise((resolve) => setTimeout(resolve, 0));

    process.off('unhandledRejection', onUnhandled);
    expect(onUnhandled).not.toHaveBeenCalled();
  });
});
