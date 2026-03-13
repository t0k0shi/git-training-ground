import fs from 'fs/promises';
import path from 'path';
import { EmojiCard } from './types';

/**
 * 1行の絵文字エントリをパースする
 */
export function parseEmojiLine(line: string): EmojiCard | null {
  const trimmed = line.trim();
  if (!trimmed) return null;  // 空行はスキップ

  const chars = [...trimmed];
  const emoji = chars[0];
  const size = Math.min(chars.length, 3) as 1 | 2 | 3;

  return { emoji, size };
}

/**
 * emojis.txt を読み込む（v2形式）
 * ビルド時に1度だけ実行される（SSG）
 */
export async function getEmojis(): Promise<EmojiCard[]> {
  const filePath = path.join(process.cwd(), 'data', 'emojis.txt');
  const content = await fs.readFile(filePath, 'utf-8');
  const lines = content.split('\n');

  return lines
    .map(parseEmojiLine)
    .filter((card): card is EmojiCard => card !== null);
}
