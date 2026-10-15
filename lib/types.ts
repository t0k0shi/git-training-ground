/**
 * v4 参加者エントリ
 * contributors.json の 1 要素に対応する
 */
export interface Contributor {
  /** サイトに表示する名前（ニックネーム） */
  name: string;
  /** v5 までの欄。表示にもアバターにも使わない（ADR-0016） */
  github?: string;
  favoriteColor: string;
  favoriteEmoji: string;
  message: string;
  joinedAt: string;
}

/**
 * ビルド時に派生した拡張型（コンポーネントに渡す際に使用）
 */
export interface ContributorWithDerived extends Omit<Contributor, 'github'> {
  /** React の key。contributors.json での位置から作る（"entry-0" など） */
  id: string;
  /** エントリを追加した人のアバターの URL。わからなければ null */
  avatarUrl: string | null;
  isNew: boolean;
}

/** scripts/build-avatars.mjs が書き出す data/avatars.generated.json の 1 件 */
export interface AvatarEntry {
  index: number;
  login: string | null;
  id: number | null;
  source: 'pr' | 'commit' | 'none';
  pr: number | null;
}
