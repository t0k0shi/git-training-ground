import { describe, it, expect, vi } from 'vitest';

vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(),
  },
  readFile: vi.fn(),
}));

import fs from 'fs/promises';
import { getEmojis } from '@/lib/contributors';

describe('getEmojis', () => {
  it('ファイルを読み込んで EmojiCard[] を返す', async () => {
    vi.mocked(fs.readFile).mockResolvedValue('🚀\n🎉🎉\n🌟🌟🌟\n');

    const result = await getEmojis();

    expect(result).toEqual([
      { emoji: '🚀', size: 1 },
      { emoji: '🎉', size: 2 },
      { emoji: '🌟', size: 3 },
    ]);
  });

  it('空行をフィルタする', async () => {
    vi.mocked(fs.readFile).mockResolvedValue('🚀\n\n🎉🎉\n\n');

    const result = await getEmojis();

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ emoji: '🚀', size: 1 });
    expect(result[1]).toEqual({ emoji: '🎉', size: 2 });
  });

  it('空ファイルで空配列を返す', async () => {
    vi.mocked(fs.readFile).mockResolvedValue('');

    const result = await getEmojis();

    expect(result).toEqual([]);
  });
});
