# ADR-0008: AI レビュアーとして CodeRabbit を採用（Copilot 案を撤回）

- **Status**: Accepted
- **Date**: 2026-04-24
- **Supersedes**: [ADR-0006](./0006-copilot-over-claude-for-reviews.md), [ADR-0007](./0007-use-pull-request-target-for-ai-review.md)
- **Context**: ADR-0006 採用判断の制約発覚と、より適切な代替案の登場

## Context

ADR-0006 で GitHub Copilot を採用したが、実装直前に以下の制約が判明した:

1. **GitHub Copilot code review は「リポジトリ所有アカウント／組織」に Copilot サブスクリプションが必要**
   - Copilot Pro（個人）: 自分が作った PR しか auto-review できない
   - Copilot Business/Enterprise（組織）: 組織配下 repo の全 PR 対象、seat $19〜$39/月
2. `t0k0shi/git-training-ground` は **個人所有の personal repo** であり、メンテナーの Copilot 契約（別アカウントの company subscription）では有効化できない
3. 会社組織へ repo を移動する選択肢は、IP 帰属・退職時の取扱いなどのポリシー観点で非現実的

同時に、候補として再調査した **CodeRabbit** が以下の特性を持つことを確認:

- **Public リポジトリは Pro プラン全機能が永久無料** ([pricing page](https://www.coderabbit.ai/pricing))
- `.coderabbit.yaml` で `language: ja-JP` を指定すればレビューコメントが **日本語で投稿される**
- GitHub App として動作するため、repo 所有権やサブスクリプション構成に依存しない
- CodeRabbit の submit するレビューは標準の GitHub Review API 経由 → 既存の `post-verdict` ロジック（`review.user.login` で bot 検出してラベル管理）がほぼそのまま流用可能

## Decision

**GitHub Copilot 採用を撤回し、CodeRabbit を採用する。**

- `.coderabbit.yaml` をリポジトリルートに配置（`language: ja-JP` / path_filters / auto_review 設定）
- `ai-review.yml` は CodeRabbit のレビュー結果を verdict 化してラベル付与するだけのシンプルな workflow に簡素化
- Copilot アサイン用の `assign-copilot` ジョブは削除
- `pull_request_target` トリガーは不要（CodeRabbit 自体が GitHub App として独立動作するため、verdict 用 workflow は `pull_request_review: submitted` のみで足りる）→ ADR-0007 も Superseded

## Consequences

### Positive

- **コストゼロ**: public repo は CodeRabbit Pro プラン全機能が永続無料
- **日本語レビュー**: `language: ja-JP` 設定で初心者向け練習場として本来の趣旨にマッチ（Copilot の英語レビュー問題 OQ-3 が根本解決）
- **OSS 業界の定番 bot**: コントリビューターが他の OSS でも見かける bot で、練習場として「リアルな OSS 体験」を提供
- **実装シンプル化**: `ai-review.yml` が 2 ジョブ（assign-copilot + post-verdict）から 1 ジョブへ、size check / paths check は CodeRabbit の `.coderabbit.yaml` 側に移譲
- **セキュリティ向上**: `pull_request_target` 不要になり、code execution の懸念が残存するトリガーを使わなくて済む
- **メンテナンス負荷ほぼゼロ**: GitHub App のインストール後、設定ファイル以外のメンテ不要。Anthropic API キー管理も不要

### Negative

- **CodeRabbit の rate limit**: 4 PR/hour/developer の制限あり。git-training-ground の想定規模（週数件〜十数件）では問題なしだが、将来バースト的な流入があれば詰まる可能性
- **外部サービス依存**: CodeRabbit のサービス停止や方針変更（無料枠終了など）に対して対応が必要になる可能性
  - 対策: 2026 Q1 に $100k を OSS ツールへ拠出するなど OSS への継続コミットが見える。打ち切りリスクは低いと判断
- **レビュー品質のブラックボックス性**: CodeRabbit は裏で Claude / GPT 等を呼ぶが、プロンプトやモデルは CodeRabbit 側の管理。細かい品質チューニングは自前 Claude API より劣る
  - 対策: `.coderabbit.yaml` の `profile: chill` や path_filters で初心者向けに丸める
- **bot login 名の依存**: `coderabbitai[bot]` を決め打ちで使用しているため、CodeRabbit 側で bot rename されたら workflow 要調整
  - 対策: env variable `CODERABBIT_BOT_LOGIN` で一箇所化

### Migration from ADR-0006 (Copilot)

既に push 済みの実装のうち以下を修正:

| 成果物 | 対応 |
|---|---|
| `.github/workflows/ai-review.yml` | `assign-copilot` ジョブ削除、`post-verdict` の bot login を `copilot-pull-request-reviewer[bot]` → `coderabbitai[bot]` に変更 |
| `.github/workflows/merge-guard.yml` | 変更なし |
| `.github/labels.yml` | 変更なし（4 ラベルはそのまま使用）|
| `.github/PULL_REQUEST_TEMPLATE.md` | 「英語で投稿されます」の案内を削除、CodeRabbit に言及する日本語案内に差替 |
| `CONTRIBUTING.md` | 同上 |
| `.coderabbit.yaml` | **新規作成** |
| `ADR-0006` | Status を Superseded に更新 |
| `ADR-0007` | Status を Superseded に更新 |

### Phase 3 の Claude API fallback 位置付け変更

ADR-0006 で予定していた「Phase 3: Claude API fallback」は、CodeRabbit の public 無料提供が打ち切られる場合のリスクヘッジとして **lightrover-workspace の実装パターンを保持** する形で維持する。運用上のトリガー条件は引き続き「レビュー到着率 < 70% の状態が 2 週間継続」とする。

## 関連資料

- [CodeRabbit Documentation - Configuration Reference](https://docs.coderabbit.ai/reference/configuration)
- [CodeRabbit Pricing](https://www.coderabbit.ai/pricing)
- lightrover-workspace `.github/workflows/ai-review.yml`（Phase 3 fallback 時の参考実装）
