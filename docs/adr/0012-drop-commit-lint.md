# ADR-0012: コミットメッセージと PR タイトルを CI で検証しない

- **Status**: Accepted
- **Date**: 2026-10-11
- **Related**: [ADR-0007](./0007-use-pull-request-target-for-ai-review.md)（`pull_request_target` の安全策）、[ADR-0011](./0011-guard-changed-files-on-pull-request-target.md)

## Context

`commit-lint.yml` は、PR の全コミットのメッセージが CONTRIBUTING.md の形式（`Add <yourname> to contributors` または Conventional Commits）に合うかを検証し、合わなければ失敗させていた。必須チェックにも入っていた。

参加者のアカウントで試したところ（PR #49）、次の問題が見つかった。

1. `pull_request_target` で PR のコード（`refs/pull/N/head`）を checkout していたため、Fork からの PR では `actions/checkout` が「Refusing to check out fork pull request code from a 'pull_request_target' workflow.」で拒否し、**メッセージが正しくても全員が失敗**していた。この checkout は ADR-0007 の安全策（PR のコードを checkout しない）にも反していた。
2. GitHub の Web エディタで編集すると、既定のメッセージは `Update contributors.json` になり、形式に合わない。直すには `git commit --amend` や `git rebase -i` と強制 push が要り、初めての PR の人には難しい。最初の PR が失敗の表示になるのは、「失敗しても許される練習場」という狙いに合わない。
3. PR は squash でマージしており、main に残るのは PR のタイトルだけで、個々のコミットメッセージは残らない。

## Decision

- `commit-lint.yml` を削除し、ブランチ保護の必須チェックからも `commit-lint` を外す。
- PR タイトルの検証も行わない。形式は CONTRIBUTING.md と PR テンプレートで「推奨」として示し、マージのときにメンテナーが squash のタイトルを整える。
- CodeRabbit にコミットメッセージの形式を指摘させる指示も削除する。

## Alternatives Considered

| 案 | 理由 |
|---|---|
| checkout をやめ、GitHub API でコミットメッセージを取得して検証する | 問題 1 は解消するが、問題 2・3 が残る |
| PR タイトルを検証し、失敗したら直し方をコメントで案内する | Web の画面だけで直せるが、初めての PR がいったん失敗の表示になる点は変わらない |
| **検証しない（採用）** | 参加者の負担がなく、main の履歴はマージのときに整えられる |

## Consequences

- **Positive**: Fork からの PR が、コミットメッセージの形式で止まらなくなる。`pull_request_target` で PR のコードを checkout する workflow がなくなる。
- **Negative**: main の履歴の形式は、メンテナーがマージのときに squash のタイトルを確認することで保つ。
