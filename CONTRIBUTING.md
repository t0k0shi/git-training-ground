# Contributing to Git Training Ground

> [!IMPORTANT]
> はじめての PR を練習したい方は [README](./README.md) または [/tutorial ページ](./app/tutorial/page.tsx) を参照してください。
> このガイドは継続的な貢献やメンテナー向けです。

## Commit Message

[Conventional Commits](https://www.conventionalcommits.org/ja/v1.0.0/) 形式を採用します。**CI で検証されるため、規約違反があると merge できません**。

### 形式

```
<type>(<scope>)?: <subject>
```

### `<type>` 一覧

| type | 意味 |
|---|---|
| `feat` | 新機能の追加 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみの変更 |
| `style` | コードスタイル（機能に影響しない）|
| `refactor` | リファクタリング |
| `perf` | パフォーマンス改善 |
| `test` | テストの追加・修正 |
| `build` | ビルドシステムや依存の変更 |
| `ci` | CI 設定の変更 |
| `chore` | 雑事（上記に該当しないもの）|
| `revert` | コミットの取り消し |

破壊的変更は `!` を付与: `refactor!: remove legacy EmojiCard`

### 例

良い例:
- `feat: add floating bubbles to hero`
- `fix(ContributorCard): prevent overflow on small screens`
- `docs: update README.ja.md`
- `ci: add commit-lint workflow`

悪い例（CI で弾かれます）:
- `added new feature` — prefix なし
- `feat add feature` — コロンなし
- `feat:` — subject が空
- `📚 docs: xxx` — 絵文字プレフィックスは使わない

### 特例: contributors.json のみの PR

チュートリアル参加者は次の簡易形式も許容されます:

```
Add <yourname> to contributors
```

例: `Add oginochihiro to contributors`

## Branch

```
<type>/<short-desc>(-#<issue>)?
```

- 例: `feat/floating-bubbles-#42`, `fix/avatar-overflow`
- 特例（contributors PR）: `add-<yourname>`

## Pull Request

- 1 Issue に対して 1 PR を基本とする
- PR タイトルも Commit Message と同じ形式を推奨
- CI がすべて pass するまで修正
- AI レビュー（CodeRabbit）の指摘を確認

## AI Review

[CodeRabbit](https://www.coderabbit.ai/) が PR ごとに日本語で自動レビューを投稿します。

- `ai:approved` — 通過（マージ可）
- `do-not-merge` + `ai:changes-requested` — 要修正
- `@coderabbitai` にメンションで再レビュー依頼・質問が可能

## ローカル事前チェック

```bash
npx tsx scripts/validate-contributors.ts   # contributors.json 形式チェック
npm test                                    # ユニットテスト
npm run build                               # ビルド
```

## Code of Conduct

すべてのコントリビューターは [Code of Conduct](./CODE_OF_CONDUCT.md) を遵守してください。
