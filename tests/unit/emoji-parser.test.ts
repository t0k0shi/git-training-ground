import { describe, it, expect } from 'vitest';
import { parseEmojiLine } from '@/lib/contributors';

describe('parseEmojiLine', () => {
  it('単一絵文字で size=1 のカードを返す', () => {
    const result = parseEmojiLine('🚀');
    expect(result).toEqual({ emoji: '🚀', size: 1 });
  });

  it('2つの絵文字で size=2 のカードを返す', () => {
    const result = parseEmojiLine('🎉🎉');
    expect(result).toEqual({ emoji: '🎉', size: 2 });
  });

  it('3つの絵文字で size=3 のカードを返す', () => {
    const result = parseEmojiLine('🌟🌟🌟');
    expect(result).toEqual({ emoji: '🌟', size: 3 });
  });

  it('4つ以上の絵文字でも size=3 にキャップされる', () => {
    const result = parseEmojiLine('🚀🚀🚀🚀');
    expect(result).not.toBeNull();
    expect(result!.size).toBe(3);
  });

  it('空文字は null を返す', () => {
    expect(parseEmojiLine('')).toBeNull();
  });

  it('空白のみは null を返す', () => {
    expect(parseEmojiLine('   ')).toBeNull();
  });

  it('前後の空白をトリムして処理する', () => {
    const result = parseEmojiLine('  🚀  ');
    expect(result).toEqual({ emoji: '🚀', size: 1 });
  });
});
