import fs from 'fs/promises';
import path from 'path';
import { EmojiCard, ContributorsData, Contributor, Statistics } from './types';

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

// ========== 旧API（移行期間中のみ維持）==========

/**
 * @deprecated v2ではgetEmojis()を使用
 */
export async function getContributors(): Promise<Contributor[]> {
  const filePath = path.join(process.cwd(), 'data', 'contributors.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const data: ContributorsData = JSON.parse(fileContent);
  return data.contributors.sort((a, b) => b.prNumber - a.prNumber);
}

/**
 * @deprecated v2で削除予定
 */
export async function calculateStatistics(): Promise<Statistics> {
  const contributors = await getContributors();
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);
  const thisMonthPRs = contributors.filter((c) =>
    c.joinedAt.startsWith(currentMonth)
  ).length;
  const recentContributors = contributors.slice(0, 5);
  return {
    totalContributors: contributors.length,
    thisMonthPRs,
    recentContributors,
  };
}
