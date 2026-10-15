import fs from 'fs/promises';
import path from 'path';
import { AvatarEntry, Contributor, ContributorWithDerived } from './types';

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
 * 生成ファイル（data/avatars.generated.json）から、エントリの位置ごとのアバターの URL を作る
 * ファイルがない・読めない・件数が合わないときは、全員アバターなし（古いファイルを使わない）
 */
async function readAvatarUrls(count: number): Promise<(string | null)[]> {
  const none = new Array<string | null>(count).fill(null);
  let entries: AvatarEntry[];
  try {
    const content = await fs.readFile(path.join(process.cwd(), 'data', 'avatars.generated.json'), 'utf-8');
    entries = JSON.parse(content).entries;
  } catch {
    return none;
  }
  if (!Array.isArray(entries) || entries.length !== count) return none;
  return entries.map((e) => (e.id ? `https://avatars.githubusercontent.com/u/${e.id}?s=80` : null));
}

/**
 * contributors.json を読み込み、派生フィールドを付与して返す
 * Server Component からのみ呼び出す（fs を使用するため）
 *
 * github 欄は返さない。GitHub のユーザー名がページに出ないように、表示に渡すデータから外す（ADR-0016）
 */
export async function getContributors(): Promise<ContributorWithDerived[]> {
  const filePath = path.join(process.cwd(), 'data', 'contributors.json');
  const content = await fs.readFile(filePath, 'utf-8');
  const raw: Contributor[] = JSON.parse(content);
  const avatarUrls = await readAvatarUrls(raw.length);

  return raw.map((c, index) => ({
    name: c.name,
    favoriteColor: c.favoriteColor,
    favoriteEmoji: c.favoriteEmoji,
    message: c.message,
    joinedAt: c.joinedAt,
    id: `entry-${index}`,
    avatarUrl: avatarUrls[index],
    isNew: daysAgo(c.joinedAt) <= 7,
  }));
}
