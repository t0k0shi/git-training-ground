# ADR-0006: AI レビュアーとして GitHub Copilot を採用（Claude API は将来の fallback）

- **Status**: **Superseded by [ADR-0008](./0008-coderabbit-over-copilot-for-reviews.md)**（2026-04-24 同日に逆転）
- **Date**: 2026-04-24
- **Context**: git-training-ground PR 自動 AI レビューの実装言語選定

> **⚠️ この決定は Superseded されました**
>
> Copilot code review は **リポジトリ所有アカウント／組織** に Copilot Business 以上のサブスクリプションが必要なことが判明。
> `t0k0shi/git-training-ground` は個人 repo であり、この要件を満たせないため、採用不可と結論。
>
> 代替として **CodeRabbit（public 永久無料 + 日本語対応）** を採用。詳細は ADR-0008 参照。

## Context

姉妹リポジトリ `lightrover-workspace` では Claude API 独自実装（`scripts/review_pr.py`）で PR レビューを行っていた。git-training-ground に同様の機能を導入するにあたり、以下の選択肢があった:

1. **Claude API 独自実装**（lightrover パターン）: `ANTHROPIC_API_KEY` を secret に保存、`ai-review.yml` 内で Python スクリプトを実行
2. **GitHub Copilot 純正**: `gh pr edit --add-reviewer @copilot` で Copilot を reviewer として自動アサイン、レビューコメントを GitHub Reviews API 経由で取得
3. **両者併用**: Copilot でコード品質 + Claude で verdict/日本語要約

ユーザーは GitHub Copilot Pro アカウントを新規取得しており、活用する動機があった。また 2026-03 に GitHub CLI 経由での Copilot アサイン (`gh pr edit --add-reviewer @copilot`) が GA になった。

## Decision

**Option 2: GitHub Copilot 純正を採用。Claude API は将来の fallback（Phase 3）として保留**。

## Consequences

### Positive
- **GitHub ネイティブ統合**: Copilot のレビューは通常の Review API 経由で投稿されるため、inline comment / reviewer アバター / Files changed タブの表示が自然
- **運用コスト削減**: 独自の Python スクリプト・プロンプト管理・Claude API キーが不要
- **Copilot の強み**: GitHub プラットフォームの文脈を理解した上でレビューする（例: リポジトリのコーディング規約を学習）
- **ユーザーが所持している Copilot アカウントの有効活用**

### Negative
- **verdict 判定の精度不明**: Copilot が `CHANGES_REQUESTED` をどの程度使うか未知数（実運用観察が必要、ADR-0005 参照）
- **言語の制約**: Copilot のレビューコメントは英語中心。初心者コントリビューター向けには案内文で緩和（PR テンプレートに明記）
- **SLA 不明**: Copilot のレビュー到着時間にばらつきの可能性。現時点では SLA 保証なし
- **Copilot が動かないリスク**: アカウント停止 / 設定ミス / fork PR での動作制限（未検証）

### Fallback 戦略（Phase 3 候補、OQ-2）

Copilot レビューが 15 分以上到着しないケースが頻発した場合:
- `ai-review.yml` に 3 つ目のジョブ `fallback-claude-review` を追加
- `pull_request_review: submitted` を待ち、タイムアウトで起動
- Claude API で独自レビュー → lightrover 同等のパターンで inline comment / verdict を生成

判断基準: Phase 2 運用後、Copilot 到着率が 70% を下回るか、到着遅延 PR が 5 件以上なら Phase 3 着手。
