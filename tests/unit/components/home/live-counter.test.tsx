import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LiveCounter } from '@/components/home/LiveCounter';

describe('LiveCounter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('マウント直後の表示値は 0 である', () => {
    // rAF をスタブして即時には進めない
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0);

    render(<LiveCounter target={42} />);

    // カウントアップ前は 0 が表示されている
    expect(screen.getByTestId('live-counter-value')).toHaveTextContent('0');
  });

  it('rAF を進めると target に到達する', async () => {
    // rAF を即時実行するモック（登録したコールバックをキューに積む）
    let frameId = 0;
    let pendingCb: FrameRequestCallback | null = null;

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      frameId += 1;
      pendingCb = cb;
      return frameId;
    });

    render(<LiveCounter target={100} duration={1000} />);

    // 1フレーム目: startTimeRef を 0 で初期化（elapsed=0）
    act(() => {
      if (pendingCb) pendingCb(0);
    });

    // 2フレーム目: duration(1000ms) を超えるタイムスタンプで完了させる
    act(() => {
      if (pendingCb) pendingCb(1200);
    });

    expect(screen.getByTestId('live-counter-value')).toHaveTextContent('100');
  });

  it('duration パラメータを渡せる（デフォルト 1800ms）', () => {
    let frameId = 0;
    let pendingCb: FrameRequestCallback | null = null;

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      frameId += 1;
      pendingCb = cb;
      return frameId;
    });

    render(<LiveCounter target={50} duration={500} />);

    // 1フレーム目: startTimeRef を 0 で初期化
    act(() => {
      if (pendingCb) pendingCb(0);
    });

    // 2フレーム目: duration(500ms) の中間（250ms）でコールバック
    act(() => {
      if (pendingCb) pendingCb(250);
    });

    const value = parseInt(
      screen.getByTestId('live-counter-value').textContent ?? '0',
      10
    );
    // ease-out-cubic の途中なので 0 < value < 50
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(50);
  });

  it('rAF が stall した場合、setTimeout フォールバックで target に達する', () => {
    // rAF を止めたまま（コールバックを呼ばない）
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0);

    render(<LiveCounter target={99} duration={1000} />);

    // フォールバックは duration + 200 ms 後
    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.getByTestId('live-counter-value')).toHaveTextContent('99');
  });

  it('「人」「参加中」「LIVE」テキストが表示される', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0);

    render(<LiveCounter target={10} />);

    expect(screen.getByText('人')).toBeInTheDocument();
    expect(screen.getByText(/参加中/)).toBeInTheDocument();
    expect(screen.getByText(/LIVE/)).toBeInTheDocument();
  });
});
