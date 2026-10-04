# ADR-0010: 正式な公開先を GitHub Pages にし、Vercel は PR プレビュー用に残す

- **Status**: Accepted
- **Date**: 2026-10-04
- **Supersedes**: [ADR-0001](./0001-hosting-platform.md)、[ADR-0004](./0004-remove-github-pages-deploy.md)

## Context

ADR-0001 で Vercel を公開先に決め、ADR-0004 で GitHub Pages へのデプロイを削除した。その後 v4（2026-04）で `deploy.yml` による GitHub Pages デプロイを再導入し、現在は Vercel（`git-training-ground.vercel.app`）と GitHub Pages（`t0k0shi.github.io/git-training-ground/`）の両方で同じサイトが公開されている。README は GitHub Pages、`README.ja.md`・PR のウェルカムコメント・記事は Vercel を案内しており、どちらが正式か分からない。

## Decision

- 正式な公開先を **GitHub Pages** とし、README・ドキュメント・PR のコメント・記事の案内をすべてこちらに統一する。
- **Vercel は PR ごとのプレビュー用に残す**。初心者がマージ前に自分のカードの見た目を確認できるようにするため。案内には「プレビュー」として書き、本番 URL としては扱わない。

## Alternatives Considered

| 案 | 長所 | 短所 |
|---|---|---|
| GitHub Pages に一本化（Vercel 連携を外す） | 外部サービスに依存しない | PR プレビューがなくなる |
| **GitHub Pages を正式、Vercel はプレビュー（採用）** | 案内先は1つ、プレビューも残る | 2 系統の設定を保守する |
| Vercel に戻す（ADR-0001 のまま） | 設定が少ない | `deploy.yml` と basePath 対応（v4）が無駄になる。リポジトリと URL の対応が分かりにくい |

## Consequences

- **Positive**: 案内する URL が1つになる。ビルドからデプロイまで GitHub Actions で完結する。
- **Negative**: Vercel 側の本番 URL も引き続き表示されるため、外部リンクで古い URL が使われ続ける可能性がある。
- **関連**: basePath（`/git-training-ground`）は `NEXT_PUBLIC_GITHUB_PAGES=true` のビルドでのみ付く（`next.config.ts`）。Vercel のプレビューは basePath なしでビルドされる。
