#!/bin/bash
# test_pr_comment_workflow.sh
#
# PR 自動コメントワークフロー (pr-comment.yml) の構造検証テスト。
# TC-C-01, TC-C-02 の前提条件を検証する。

PASS=0
FAIL=0
FILE=".github/workflows/pr-comment.yml"

assert_contains() {
  local desc="$1"
  local pattern="$2"
  if grep -q "$pattern" "$FILE" 2>/dev/null; then
    echo "  ✅ PASS: $desc"
    ((PASS++))
  else
    echo "  ❌ FAIL: $desc (pattern not found: $pattern)"
    ((FAIL++))
  fi
}

assert_not_contains() {
  local desc="$1"
  local pattern="$2"
  if ! grep -q "$pattern" "$FILE" 2>/dev/null; then
    echo "  ✅ PASS: $desc"
    ((PASS++))
  else
    echo "  ❌ FAIL: $desc (pattern should not exist: $pattern)"
    ((FAIL++))
  fi
}

echo "=== PR Comment Workflow Tests ==="
echo ""

# ファイル存在チェック
echo "[構造] ファイル存在"
if [ -f "$FILE" ]; then
  echo "  ✅ PASS: $FILE が存在する"
  ((PASS++))
else
  echo "  ❌ FAIL: $FILE が存在しない"
  ((FAIL++))
  echo ""
  echo "=== Results: $PASS passed, $FAIL failed ==="
  exit 1
fi

# トリガー設定
echo "[TC-C-02] トリガーが opened のみ"
assert_contains "pull_request トリガーがある" "pull_request"
assert_contains "types: [opened] がある" "opened"
assert_not_contains "synchronize が含まれない（重複防止）" "synchronize"

# パーミッション
echo "[構造] パーミッション設定"
assert_contains "pull-requests: write がある" "pull-requests: write"

# actions/github-script 使用
echo "[構造] github-script 使用"
assert_contains "actions/github-script@v7 を使用" "actions/github-script@v7"

# コメント本文の内容チェック
echo "[TC-C-01] コメント本文"
assert_contains "感謝メッセージがある" "PR ありがとうございます"
assert_contains "反映待機の期待値設定がある" "数日かかる"
assert_contains "コンフリクト解決ガイドリンクがある" "conflict-resolution"
assert_contains "CI エラーの案内がある" "エラーメッセージ"

# API 呼び出し
echo "[構造] API 呼び出し"
assert_contains "createComment を呼んでいる" "createComment"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
