#!/usr/bin/env bash
#
# AI レビュー連動ラベルを GitHub に作成／同期するヘルパー
#
# Usage:
#   ./scripts/init-labels.sh                # 現在のリポジトリに対して実行
#   ./scripts/init-labels.sh owner/repo     # 指定リポジトリに対して実行
#
# Requires: gh CLI (https://cli.github.com/)
#
set -euo pipefail

REPO="${1:-$(gh repo view --json nameWithOwner --jq .nameWithOwner)}"

echo "🎨 Creating / updating AI review labels on $REPO"
echo ""

# name|color|description の連想配列
declare -A LABELS=(
  ["do-not-merge"]="B60205|AI レビューの指摘が未解決。修正してください"
  ["ai:changes-requested"]="D93F0B|AI レビューで変更が要求されている"
  ["ai:approved-with-warnings"]="FBCA04|AI レビューで軽微な指摘あり"
  ["ai:approved"]="0E8A16|AI レビューで承認"
)

for name in "${!LABELS[@]}"; do
  IFS='|' read -r color desc <<< "${LABELS[$name]}"
  gh label create "$name" \
    --color "$color" \
    --description "$desc" \
    --repo "$REPO" \
    --force
  echo "  ✅ $name"
done

echo ""
echo "🎉 Done. Verify with: gh label list --repo $REPO | grep -E '(do-not-merge|^ai:)'"
