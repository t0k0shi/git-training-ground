# ADR-0014: フォントをリポジトリに置き、ビルド中に Google Fonts へ取りに行かない

- **Status**: Accepted
- **Date**: 2026-10-13

## Context

フォント（Noto Sans JP・Inter・JetBrains Mono）は `next/font/google` で読み込んでいた。`next/font/google` は、ビルドのたびに Google Fonts からファイルを取得して、サイトに同梱する。Noto Sans JP は日本語の文字を範囲ごとに分けた 124 ファイル（`@font-face` は太さ 3 つで 372 件）あり、1 回のビルドで数百の取得が走る。

取得に 1 つでも失敗するとビルドが落ちる（`next/font/google queries have exactly one entry`）。2026-10-13 だけで、PR #49 の test、PR #53 の validate、PR #59 の Vercel が、PR の中身と関係なくこれで失敗した。参加者から見ると、自分のミスではないのに赤い × が出る。

## Decision

- `next/font/google` をやめ、変更前のビルドが Google から受け取ったフォントのファイル（137 個、約 5.8MB）と `@font-face` の指定を、そのまま `app/fonts/` に置く。`app/layout.tsx` で `app/fonts/fonts.css` を読み込む
- 読み込み中に使う予備のフォント（`next/font` が生成していた、Arial の大きさを合わせた `... Fallback`）も同じ指定で置く
- フォントの OFL ライセンスを `app/fonts/licenses/` に置く（再配布の条件）
- 単体テストで、`next/font/google` を import していないこと、`fonts.css` が指すファイルがすべてあること、ライセンスがあることを確かめる

## Alternatives Considered

| 案 | 理由 |
|---|---|
| npm のパッケージ（Fontsource）から読み込む | 取得は npm に移るが、Google が今配信している版と字の幅が違い（例: 18px の `P` が 12px と 11px）、チュートリアルの説明文の折り返しが変わった。可変フォント版・太さごとの版のどちらでも同じ |
| `next/font/google` のまま、失敗したら再実行する | 参加者の PR で毎回赤い × が出うる。オーナーの手間も続く |
| **受け取ったファイルをそのまま置く（採用）** | 見た目が変わらない（変更前と画面を撮って比べ、差がないことを確認）。ビルドが外部に依存しない |

## Consequences

- **Positive**: ビルドが Google Fonts の調子に左右されない。見た目は変わらない
- **Negative**: リポジトリが約 5.8MB 大きくなる。フォントの版が 2026-10-13 時点で固定になる（更新するときは、`next/font/google` で一度ビルドして同じ手順で置き直す）。`next/font` がしていた英数字のフォントの先読み（preload）はなくなる
