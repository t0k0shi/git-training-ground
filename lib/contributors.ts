import fs from 'fs/promises';
import path from 'path';
import { ContributorsData, Contributor, Statistics } from './types';

/**
 * contributors.json を読み込む
 * ビルド時に1度だけ実行される（SSG）
 */
export async function getContributors(): Promise<Contributor[]> {
  const filePath = path.join(process.cwd(), 'data', 'contributors.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const data: ContributorsData = JSON.parse(fileContent);
  return data.contributors.sort((a, b) => b.prNumber - a.prNumber);
}

/**
 * 統計情報を計算する
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
