# ADR-0011: PR の変更ファイル検査を `pull_request_target` で行う

- **Status**: Accepted
- **Date**: 2026-10-04
- **Related**: [ADR-0007](./0007-use-pull-request-target-for-ai-review.md)（`pull_request_target` の安全策）

## Context

このリポジトリは、見知らぬ人が `data/contributors.json` に1行足す PR を練習する場所である。従来は `validate-pr.yml` の最初のステップで「contributors.json 以外の変更」を検出していたが、次の 2 つの穴があった。

1. `validate-pr.yml` は `paths: data/contributors.json` のときだけ起動するため、アプリのコードだけを変える PR では検査自体が走らない。
2. `pull_request` イベントでは PR 側の workflow 定義とスクリプトが使われるため、PR の中でガードを書き換えれば検査をすり抜けられる。

## Decision

- 変更ファイルの検査を独立した `guard-files.yml` に移し、**`pull_request_target`** で全 PR に対して実行する。base ブランチの定義で動くため、PR 側から書き換えられない。
- ADR-0007 の安全策に従い、**PR のコードを checkout・実行しない**。変更ファイルは GitHub API で取得し、判定は base ブランチの依存なしスクリプト `scripts/check-changed-files.mjs` で行う。依存のインストールもしない。権限は `contents: read` と `pull-requests: read` だけにする。
- オーナーの PR と信頼済みボット（`dependabot[bot]`）は検査の対象外とする。
- 参加者が触るのは原則 `data/contributors.json` だけとする（README・チュートリアルの案内どおり）。例外として、オーナーが `contribution-welcome` ラベルで開放した Issue を PR 本文で参照している（`Closes #番号` など）場合は、コードの変更も検査を通す。ラベルは書き込み権限のある人しか付けられないため、参加者が自分で開放することはできない。
- 最終的な防御は `CODEOWNERS` とブランチ保護（コードオーナー承認・必須チェック）で行う。この workflow は、初心者に「何がいけないか」を日本語で返す役割を担う。

## Alternatives Considered

| 案 | 理由 |
|---|---|
| `validate-pr.yml` の `paths` を外すだけ | 穴 2（PR 側で書き換えられる）が残る |
| CODEOWNERS とブランチ保護だけ | 初心者に失敗理由が伝わらない。練習場としては日本語の説明が要る |
| オーナーが PR ごとに許可ラベルを付ける | 参加者は PR を出すまで受け付けられるか分からない。オーナーの手間も PR ごとにかかる |
| **`pull_request_target` で分離（採用）** | 書き換えに強く、説明も返せる |

## Consequences

- **Positive**: どの PR にも検査が走り、PR 側から無効化できない。
- **Negative**: `pull_request_target` を使う workflow が増える。PR のコードを checkout しない、という制約を守り続ける必要がある（レビュー時の確認項目に加える）。
- **運用**: 外部に任せてよいコードの課題は、オーナーが Issue に `contribution-welcome` ラベルを付けて開放する。どの課題に取り組めるかが Issue 一覧で事前に分かる。
