#!/bin/bash
# test_detect_modifications.sh
#
# CI-03 の grep パターンをテストする。
# サンプル diff 出力に対して、削除・変更の検出が正しく動作するか確認。

PASS=0
FAIL=0

assert_detected() {
  local desc="$1"
  local input="$2"
  local count
  count=$(echo "$input" | grep '^-' | grep -v '^---' | wc -l)
  if [ "$count" -gt 0 ]; then
    echo "  ✅ PASS: $desc (detected $count lines)"
    ((PASS++))
  else
    echo "  ❌ FAIL: $desc (expected detection, got 0)"
    ((FAIL++))
  fi
}

assert_not_detected() {
  local desc="$1"
  local input="$2"
  local count
  count=$(echo "$input" | grep '^-' | grep -v '^---' | wc -l)
  if [ "$count" -eq 0 ]; then
    echo "  ✅ PASS: $desc (no detection)"
    ((PASS++))
  else
    echo "  ❌ FAIL: $desc (expected no detection, got $count)"
    ((FAIL++))
  fi
}

echo "=== CI-03 grep pattern tests ==="
echo ""

# TC-N-07: 既存行の削除
echo "[TC-N-07] 既存行の削除"
DIFF_DELETE=$(cat <<'EOF'
--- a/data/emojis.txt
+++ b/data/emojis.txt
@@ -1,3 +1,2 @@
 🚀
-🎉🎉
 🌟🌟🌟
EOF
)
assert_detected "削除を検出" "$DIFF_DELETE"

# TC-N-08: 既存行の改ざん（変更）
echo "[TC-N-08] 既存行の改ざん"
DIFF_MODIFY=$(cat <<'EOF'
--- a/data/emojis.txt
+++ b/data/emojis.txt
@@ -1,3 +1,3 @@
 🚀
-🎉🎉
+🎃🎃
 🌟🌟🌟
EOF
)
assert_detected "変更を検出" "$DIFF_MODIFY"

# TC-N-09: 全体を空にする
echo "[TC-N-09] 全体を空にする"
DIFF_EMPTY=$(cat <<'EOF'
--- a/data/emojis.txt
+++ b/data/emojis.txt
@@ -1,3 +0,0 @@
-🚀
-🎉🎉
-🌟🌟🌟
EOF
)
assert_detected "全削除を検出" "$DIFF_EMPTY"

# 正常系: 追加のみ
echo "[正常系] 追加のみ"
DIFF_ADD=$(cat <<'EOF'
--- a/data/emojis.txt
+++ b/data/emojis.txt
@@ -1,3 +1,4 @@
 🚀
 🎉🎉
 🌟🌟🌟
+🐱🐱
EOF
)
assert_not_detected "追加のみは検出しない" "$DIFF_ADD"

# エッジケース: diff ヘッダーの --- を誤検出しない
echo "[エッジ] diff ヘッダー"
DIFF_HEADER_ONLY=$(cat <<'EOF'
--- a/data/emojis.txt
+++ b/data/emojis.txt
@@ -1,3 +1,4 @@
 🚀
+🐱
EOF
)
assert_not_detected "ヘッダーの --- を誤検出しない" "$DIFF_HEADER_ONLY"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
