# ADR-0004: GitHub Pages デプロイワークフローの削除

## Status
Accepted

## Context
ADR-0001 で Vercel をホスティングに決定していたが、`deploy.yml` に GitHub Pages へのデプロイワークフローが残っていた。GitHub Pages は有効化されておらず、mainへの push ごとにワークフローが失敗していた。

## Decision
`.github/workflows/deploy.yml` を削除し、Vercel の自動デプロイに一本化する。

## Consequences
- **Positive**: CIの不要な失敗がなくなる、デプロイ経路が明確になる
- **Negative**: なし
- **関連**: ADR-0001 の決定と整合
