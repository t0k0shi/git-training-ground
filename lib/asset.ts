/**
 * 静的アセットのパスに basePath を付与するヘルパー
 *
 * Next.js の output: 'export' では <img src="..." /> 等の生の HTML タグに
 * basePath を自動付与しないため、この helper 経由で参照する。
 *
 * 環境変数 NEXT_PUBLIC_BASE_PATH が設定されている場合はその値を prefix として使う。
 * 設定されていない（ローカル dev / 通常 export）場合は空文字列。
 *
 * Usage:
 *   <img src={asset('/tutorial/step1-fork.png')} alt="..." />
 */
export function asset(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalized}`;
}
