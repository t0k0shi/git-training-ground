import fs from 'fs/promises';
import path from 'path';
import { Contributor, ContributorWithDerived } from './types';

/**
 * github フィールドから handle を抽出する
 * "https://github.com/t0k0shi" → "t0k0shi"
 * "t0k0shi" → "t0k0shi"（そのまま返す）
 */
export function extractHandle(github: string): string {
  const urlPattern = /github\.com\/([^/?#]+)/;
  const match = github.match(urlPattern);
  if (match) {
    return match[1].replace(/\/$/, '');
  }
  return github.trim();
}

/**
 * 基準日から何日経過したかを返す
 * テスト容易性のため now を引数に取る（デフォルトは現在日時）
 */
export function daysAgo(isoDate: string, now: Date = new Date()): number {
  const d = new Date(isoDate);
  return Math.floor((now.getTime() - d.getTime()) / 86400000);
}

/**
 * contributors.json を読み込み、派生フィールドを付与して返す
 * Server Component からのみ呼び出す（fs を使用するため）
 */
export async function getContributors(): Promise<ContributorWithDerived[]> {
  const filePath = path.join(process.cwd(), 'data', 'contributors.json');
  const content = await fs.readFile(filePath, 'utf-8');
  const raw: Contributor[] = JSON.parse(content);

  return raw.map((c) => {
    const handle = extractHandle(c.github);
    return {
      ...c,
      handle,
      avatarUrl: `https://github.com/${handle}.png?size=80`,
      isNew: daysAgo(c.joinedAt) <= 7,
    };
  });
}
