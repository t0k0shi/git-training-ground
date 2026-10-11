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

const MS_PER_DAY = 86400000;

/**
 * UTC の暦日（その日の 00:00:00 UTC）をミリ秒で返す
 */
function utcDayStart(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/**
 * 基準日から何日経過したかを返す
 *
 * UTC の暦日を基準に数える。実行環境のタイムゾーンには依存しない。
 * 'YYYY-MM-DD' は UTC 0 時として解釈され、時刻やオフセット付きの値も UTC の暦日に正規化する。
 * テスト容易性のため now を引数に取る（デフォルトは現在日時）
 */
export function daysAgo(isoDate: string, now: Date = new Date()): number {
  const d = new Date(isoDate);
  return Math.round((utcDayStart(now) - utcDayStart(d)) / MS_PER_DAY);
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
