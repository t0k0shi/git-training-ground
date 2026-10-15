# ADR-0015: Vercel の連携をやめ、GitHub Pages だけにする

- **Status**: Accepted
- **Date**: 2026-10-15
- **Supersedes**: [ADR-0010](./0010-github-pages-as-primary-hosting.md) のうち「Vercel は PR ごとのプレビュー用に残す」

## Context

ADR-0010 では、初心者がマージ前に自分のカードの見た目を確認できるよう、Vercel を PR のプレビュー用に残した。しかし、参加者の PR はすべて Fork から来るため、Vercel は管理人が承認するまでプレビューを作らない。その結果、どの PR でも Vercel のチェックが「Authorization required to deploy.」の × になり、プレビューは一度も参加者の役に立っていなかった。

逆に、参加者を迷わせていた。PR #66 では、参加者が Vercel にログインして承認しようとし、「権限が不足しています」で止まった。チュートリアルと FAQ に「× は気にしなくてよい」と書いても、赤い × は目に入る。

## Decision

- Vercel とリポジトリの連携を外す（GitHub の Vercel アプリのリポジトリのアクセスから外すか、Vercel のプロジェクトで Git の連携を解除する。管理人が手で行う）。
- サイトの公開は GitHub Pages（`deploy.yml`）だけにする。
- チュートリアルの手順 8 と FAQ から Vercel の案内を消し、代わりに、初めての PR でチェックが「承認待ち」になることを案内する（承認の設定は `first_time_contributors` のまま）。

## Alternatives Considered

| 案 | 長所 | 短所 |
|---|---|---|
| **Vercel の連携を外す（採用）** | 赤い × と英語のコメントが出なくなる。外部サービスに依存しない | PR のプレビューがなくなる（もともと Fork の PR では動いていなかった） |
| Vercel の Fork 保護を切る | プレビューが自動で作られる | Fork のコードが管理人の Vercel のチームで実行される |
| 今のまま（案内だけ） | 作業がない | 参加者が迷い続ける |

## Consequences

- **Positive**: 参加者の PR のチェックが、必須のもの（GitHub Actions）だけになる。
- **Negative**: マージ前に見た目を確認する手段がない。必要になったら、GitHub Actions でビルドした成果物を Artifacts に置く形を検討する。
- **関連**: Vercel 側のプロジェクト（`git-training-ground.vercel.app`）を消すかは管理人が決める。残すと、古い URL が外部リンクで使われ続ける（ADR-0010 の Negative）。
