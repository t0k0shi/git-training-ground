/**
 * パース後のカード情報
 */
export interface EmojiCard {
  emoji: string;      // 単一絵文字
  size: 1 | 2 | 3;    // カードサイズ
}

// ========== 旧型定義（移行期間中のみ維持）==========

/**
 * @deprecated v2で削除予定
 */
export interface Contributor {
  name: string;
  github: string;
  favoriteColor: string;
  favoriteEmoji: string;
  message?: string;
  joinedAt: string;
  prNumber: number;
}

/**
 * @deprecated v2で削除予定
 */
export interface ContributorsData {
  contributors: Contributor[];
}

/**
 * @deprecated v2で削除予定
 */
export interface Statistics {
  totalContributors: number;
  thisMonthPRs: number;
  recentContributors: Contributor[];
}
