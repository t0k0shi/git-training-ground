# ADR-0013: 追加したエントリの github が、PR を出した人と同じかを確かめる

- **Status**: Accepted
- **Date**: 2026-10-13
- **Related**: [ADR-0007](./0007-use-pull-request-target-for-ai-review.md)（`pull_request_target` の安全策）、[ADR-0011](./0011-guard-changed-files-on-pull-request-target.md)（変更ファイルの検査）

## Context

`contributors.json` の `github` は、アバター（`https://github.com/<ハンドル>.png`）とトップの泡に使う。CI は形式と重複しか確かめていなかったため、次のことが起きていた。

- 実在しないハンドル名でも通る。PR #49 で `Swsafsaij-github-8uhbgv`（GitHub に存在しない）が登録され、アバターが出ず、トップの泡にも現れなかった
- 他人の実在するハンドル名でも通り、他人の顔写真が自分のカードに出る

サイトは `contributors.json` だけからビルドするため、ハンドル名は JSON に書かれている必要がある。自動で書き込むには、Bot が Fork のブランチに push する（Actions のトークンではできない）か、保護された main に書き込む（保護を抜ける権限が要る）必要があり、どちらも採らない。

## Decision

- `check-handle.yml` を `pull_request_target` で全 PR に対して動かす。`contributors.json` を変更していない PR では、検査せずに成功にする
- base と PR 側の `contributors.json` を GitHub の API でデータとして取得し、依存なしのスクリプト `scripts/check-contributor-handle.mjs` で比べる。PR のコードは checkout・実行しない
- base より増えたエントリについて、`github` から末尾の `+数字` を除いたハンドル名が、PR を出した人のログイン名と同じか（大文字小文字は区別しない）を確かめる
- 違っていれば失敗にし、正しい値（2回目以降なら `+2`、`+3`）を示す。あわせて、PR の該当の行に GitHub の「Suggested change」でレビューコメントを付け、参加者が「Commit suggestion」を押すだけで直せるようにする
- Bot が同じ行に同じ提案をすでに付けていれば、付けない。push のたびに同じ提案が増えないようにする（2026-10-13 追記。PR #53 で、push 2 回で同じ提案が 2 つ並んだ）
- validate の CV-07（重複）も、PR を出した人のログイン名を受け取り、他人のハンドル名を使っているときは `+2` ではなく自分のハンドル名を案内する。check-handle と案内をそろえる（2026-10-13 追記）
- オーナーの PR と信頼済みボット（`dependabot[bot]`）は対象外とする
- `+数字` の扱いは `lib/contributors.ts` と同じ規則にし、同じ結果になることを単体テストで確かめる

## Alternatives Considered

| 案 | 理由 |
|---|---|
| GitHub の API でアカウントが実在するかだけ確かめる | 打ち間違いは防げるが、他人のハンドル名は通る |
| Bot がハンドル名を自動で書き込む | Fork への push や、保護された main への書き込みの権限が要る |
| アバターが読めないときに代わりの表示を出す | 見た目は保てるが、他人のハンドル名は防げない |
| **一致を確かめ、直し方を提案する（採用）** | 権限を広げずに防げて、参加者はボタン 1 つで直せる |

## Consequences

- **Positive**: 実在しないハンドル名と他人のハンドル名を、マージ前に止められる。参加者は Git の操作なしで直せる
- **Negative**: `pull_request_target` で書き込み権限（`pull-requests: write`）を持つ workflow が増える。PR のコードを checkout・実行しない制約を守り続ける必要がある
- **運用**: すでに main にある `Swsafsaij-github-8uhbgv` のエントリは、この検査の対象外（base にあるため）。直すかどうかはオーナーが判断する
