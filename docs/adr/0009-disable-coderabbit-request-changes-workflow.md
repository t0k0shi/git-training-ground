# ADR-0009: CodeRabbit の `request_changes_workflow` を無効化し verdict 判定を独自実装する

- **Status**: Accepted
- **Date**: 2026-04-25
- **Refines**: [ADR-0008](./0008-coderabbit-over-copilot-for-reviews.md)
- **Context**: PR #14 で発見した運用バグ（Issue #28）

## Context

PR #14 で以下の症状が発生:

1. CodeRabbit が `CHANGES_REQUESTED` を出して `do-not-merge` ラベルが付く
2. 指摘事項を修正してコミットを push
3. CodeRabbit が「No actionable comments were generated in the recent review.」とコメントを投稿
4. しかし `reviews` API には新しい review が submit されない（古い `CHANGES_REQUESTED` のまま）
5. 結果: post-verdict ジョブが起動せず、ラベル更新されず、merge-guard が永久に fail

### 根本原因

`.coderabbit.yaml` で `request_changes_workflow: true` を有効化していた。CodeRabbit 公式ドキュメントによると、この機能は:

> Once all comments are resolved, CodeRabbit automatically approves the PR.

つまり「コメントが GitHub の "Resolve conversation" ボタン、または `@coderabbitai resolve` コマンドで明示的に dismiss された時点で、自動 APPROVE する」という設計。**人間レビュアーが操作する前提**の機能であり、修正 push だけでは APPROVE 状態に移行しない。

我々の `ai-review.yml` post-verdict は `pull_request_review.submitted` イベントのみを起点にしているため、CodeRabbit が新しい review を submit しない限り反応せず、ラベルが古いまま固まる。

## Decision

**`request_changes_workflow: false`** に変更し、CodeRabbit のレビューを通常の `commented` 形式に統一する。verdict 判定は post-verdict 側で `inline_comments` 数を見て 3 値で行う:

| Review State | Inline Comments | Verdict | 付与ラベル |
|---|---|---|---|
| `changes_requested` | 任意 | CHANGES_REQUESTED | `do-not-merge`, `ai:changes-requested` |
| `approved` | 任意 | APPROVED | `ai:approved` |
| `commented` | 0 | APPROVED | `ai:approved` |
| `commented` | ≥ 1 | APPROVED_WITH_WARNINGS | `ai:approved-with-warnings` |
| その他 | - | UNKNOWN | （ラベル変更なし） |

## Consequences

### Positive

- **修正 push 後の自動的なラベル更新が機能する**: CodeRabbit は修正 push のたびに新しい `commented` review を submit するため、post-verdict が確実に起動する
- ラベル付与イベント不発火問題（GITHUB_TOKEN 起因）への耐性向上
- Phase 2 で予定していた 3 値判定が前倒しで実現

### Negative

- **CHANGES_REQUESTED の判定基準が変わる**: 以前は CodeRabbit 自身が `request_changes` を選んでいたが、今は `inline_comments ≥ 1` で判定するため、軽微な指摘でも `APPROVED_WITH_WARNINGS` 止まりになる
  - 重大な問題のみ blocker にしたい場合は、CodeRabbit が明示的に `changes_requested` を出す挙動（`profile: assertive` や critical 指摘の自動判定）に依存
- **inline コメントが 1 件でも付くと warnings 扱い**になるため、`profile: chill` でも頻繁に `ai:approved-with-warnings` が付く可能性
  - 運用 2 週間で実態を観察し、必要なら閾値（1 → 3 等）を調整

### 観察メトリクス

- 修正 push 後、ラベルが期待通りに更新されるか
- `APPROVED_WITH_WARNINGS` の発生比率が許容範囲か
- 真に止めるべき PR（重大バグ含み）が `CHANGES_REQUESTED` で止まるか

## 関連

- Issue: #28（本問題の記録）
- ADR-0005: 段階展開（本変更で Phase 2 が前倒しに）
- ADR-0008: CodeRabbit 採用
