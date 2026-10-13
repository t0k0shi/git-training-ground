import fs from 'fs/promises';
import path from 'path';
import { Contributor, ContributorWithDerived } from './types';

/**
 * github フィールドから handle を抽出する
 * "https://github.com/t0k0shi" → "t0k0shi"
 * "t0k0shi" → "t0k0shi"（そのまま返す）
 */
/**
 * github フィールドを、エントリを見分けるキーにそろえる
 * URL 形式はハンドルの形にし、2回目以降の参加を示す末尾の +数字（例: "t0k0shi+2"）は残す
 */
export function entryKey(github: string): string {
  const urlPattern = /github\.com\/([^/?#]+)/;
  const match = github.match(urlPattern);
  if (match) {
    return match[1].replace(/\/$/, '');
  }
  return github.trim();
}

// 2回目以降の参加を示す末尾の +数字。GitHub のユーザー名には + を使えないため、他人のハンドルと重ならない
const REPEAT_SUFFIX = /\+\d+$/;

/**
 * github フィールドから、アバターと表示に使う GitHub のハンドルを取り出す
 * 末尾の +数字は取り除く（"t0k0shi+2" → "t0k0shi"）
 */
export function extractHandle(github: string): string {
  return entryKey(github).replace(REPEAT_SUFFIX, '');
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
      id: entryKey(c.github),
      handle,
      avatarUrl: `https://github.com/${handle}.png?size=80`,
      isNew: daysAgo(c.joinedAt) <= 7,
    };
  });
}
