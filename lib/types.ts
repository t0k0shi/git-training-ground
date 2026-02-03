/**
 * 貢献者エンティティ
 */
export interface Contributor {
  name: string;            // 3-20文字、英数字+ハイフン+アンダースコア
  github: string;          // GitHub プロフィールURL
  favoriteColor: string;   // 16進数カラーコード (#XXXXXX)
  favoriteEmoji: string;   // 絵文字1文字
  message?: string;        // 一言メッセージ（50文字以内、オプショナル）
  joinedAt: string;        // 参加日（YYYY-MM-DD）
  prNumber: number;        // PR番号
}

/**
 * contributors.json のスキーマ
 */
export interface ContributorsData {
  contributors: Contributor[];
}

/**
 * 統計情報
 */
export interface Statistics {
  totalContributors: number;
  thisMonthPRs: number;
  recentContributors: Contributor[];  // 直近5人
}
