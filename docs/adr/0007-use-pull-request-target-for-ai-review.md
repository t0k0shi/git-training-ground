# ADR-0007: AI レビューに `pull_request_target` を採用

- **Status**: **Superseded by [ADR-0008](./0008-coderabbit-over-copilot-for-reviews.md)**（2026-04-24 同日）
- **Date**: 2026-04-24
- **Context**: AI レビュー用 GitHub Actions workflow のトリガー選定

> **⚠️ この決定は Superseded されました**
>
> ADR-0008 で CodeRabbit を採用したため、Copilot 用 workflow の `pull_request_target` による reviewer 自動アサインは不要に。
> CodeRabbit は GitHub App として独立して動作するため、workflow 側は CodeRabbit のレビューイベントに反応するだけで済み、
> `pull_request_review: submitted` トリガーのみで十分。`pull_request_target` のセキュリティリスクを避けられる利点もある。

## Context

`ai-review.yml` は fork からの PR に対しても Copilot を reviewer として追加する必要がある（練習プラットフォームとして外部コントリビューターを主要ユーザーとするため）。GitHub Actions には fork PR の扱い方に関して 2 つの選択肢がある:

1. **`pull_request` イベント**:
   - fork PR では `GITHUB_TOKEN` が read-only に制限される
   - secrets にアクセス不可
   - 悪意のある PR コードの実行リスクがない（コードは PR のヘッドを checkout）
2. **`pull_request_target` イベント**:
   - fork PR でも親リポジトリの secrets と write 権限を使える
   - **デフォルトで base ブランチの workflow を実行**（攻撃者が workflow を改変できない）
   - ただし、悪意あるコードを `actions/checkout` で取得し、スクリプト実行すると secret が漏洩するリスクあり

## Decision

**`pull_request_target` を採用**。ただし以下の緩和策を厳守:

1. **コード実行禁止**: `npm install`, `npm run *`, `bash scripts/*.sh`, `eval`, `source` 等を実行しない
2. **gh CLI と git diff のみ使用**: ラベル管理・reviewer アサインは `gh pr edit` で完結、差分検出は `git diff` のみ
3. **依存ライブラリ不使用**: Python や Node のインストールを行わない
4. **base ブランチの信頼**: workflow 自体を変更する PR は手動レビューでチェック後にマージする運用ルール

## Consequences

### Positive
- fork PR でも Copilot アサインとラベル管理が動作する
- secrets.GITHUB_TOKEN が write 権限で使える（PR labels の操作に必須）
- `gh pr edit` / `gh pr comment` / `gh api` が使える

### Negative
- `pull_request_target` のセキュリティリスクを常に意識する必要がある
- workflow を変更する PR は慎重にレビューが必要（base ブランチに悪意ある workflow 変更がマージされたら防げない）
- コード実行ができないため、「lint チェックを workflow 内で走らせる」等の用途には使えない（validate-pr.yml 側で行う）

### Operational Rules

- `.github/workflows/*` を変更する PR は、merge 前に必ず diff を目視確認
- AI レビュー用 workflow が secret を eval / shell 展開しないことを定期的に監査（3 ヶ月毎）
- `actions/checkout` で fork のコードを取得する場合、`ref: refs/pull/<PR#>/merge` を明示（base と head のマージ結果を使う）

### 関連ドキュメント
- [Keeping your GitHub Actions and workflows secure Part 1: Preventing pwn requests (GitHub Security Lab)](https://securitylab.github.com/research/github-actions-preventing-pwn-requests/)
- `.github/workflows/merge-guard.yml` は `pull_request` を使用（write 権限不要のため）
