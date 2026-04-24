# ADR-0005: AI レビューの段階的展開（2 値 → 3 値）

- **Status**: Accepted
- **Date**: 2026-04-24
- **Context**: git-training-ground PR 自動 AI レビュー（Phase 1）の実装時

## Context

GitHub Copilot による PR 自動レビューを導入するにあたり、Copilot の `review.state` 分布が未知のため、verdict 判定ロジックの精度に不確実性がある。

参考にした lightrover-workspace の `ai-review.yml` は Claude API 独自実装で 3 値判定（`CHANGES_REQUESTED` / `APPROVED_WITH_WARNINGS` / `APPROVED`）を採用していたが、Claude は明示的に verdict を返すのに対し、Copilot は `review.state` として `commented` / `approved` / `changes_requested` のいずれかを返す仕様。

**初期判定の候補**:
- A. 初日から 3 値判定（lightrover パターン踏襲）
- B. 2 値判定から開始、運用データで判断して 3 値に拡張
- C. 単純に merge-guard のみ（verdict 判定なし）

## Decision

**B. 2 値判定から開始、2 週間観察後に 3 値拡張を判断する**。

具体的には:
- **Phase 1**: `changes_requested` → `CHANGES_REQUESTED`、その他（`approved` / `commented`）→ `APPROVED`
- **Phase 2**: 観察データで必要と判断した場合、`commented && inline_count ≥ N` → `APPROVED_WITH_WARNINGS` を追加

## Consequences

### Positive
- 最初は単純で、実装・デバッグが容易
- Copilot の実際の `review.state` 分布を観察してから閾値を決められる
- 実装 PR の規模を小さく保てる（PR-02 = M、PR-04 = S）

### Negative
- `APPROVED_WITH_WARNINGS` が Phase 1 では得られないため、メンテナーが「警告はあるが通す」判断に即応できない
- Phase 2 着手まで最低 2 週間の観察期間が必要（計画遅延リスク）

### Observation Metrics（Phase 2 移行判断の閾値）
- Copilot レビュー到着率 ≥ 80%（目標）
- 「commented + inline_comments ≥ 1」の比率が 30% 超なら Phase 2 価値あり
- 誤検出率 20% 以下を維持すれば Phase 2 移行
