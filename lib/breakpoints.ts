/**
 * レスポンシブブレークポイント (SSOT)
 *
 * 各コンポーネントの inline `<style>` ブロックでメディアクエリの
 * `max-width` 値を直書きするのを避け、 ここから template literal で
 * 参照することで値を 1 箇所に集約する。
 *
 * 将来 Tailwind v4 の `@theme inline { --breakpoint-mobile }` に
 * 移行する場合は、 この定数を撤廃して utility class (例: `max-mobile:`)
 * に統一する (関連: Issue #19)。
 */
export const BP_MOBILE_PX = 820;
