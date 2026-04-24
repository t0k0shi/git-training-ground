/**
 * v4 参加者エントリ
 * contributors.json の 1 要素に対応する
 */
export interface Contributor {
  name: string;
  github: string;
  favoriteColor: string;
  favoriteEmoji: string;
  message: string;
  joinedAt: string;
}

/**
 * ビルド時に派生した拡張型（コンポーネントに渡す際に使用）
 */
export interface ContributorWithDerived extends Contributor {
  handle: string;
  avatarUrl: string;
  isNew: boolean;
}
