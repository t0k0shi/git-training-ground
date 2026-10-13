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
  /** エントリごとに一意なキー（2回目以降の参加の +数字を含む）。React の key に使う */
  id: string;
  /** アバターと表示に使う GitHub のハンドル（+数字を除く） */
  handle: string;
  avatarUrl: string;
  isNew: boolean;
}
