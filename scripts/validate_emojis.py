#!/usr/bin/env python3
"""
validate_emojis.py

CI-01: data/emojis.txt の絵文字形式を検証する。
各行が同一絵文字の 1〜3 個の繰り返しであることを確認する。

検証条件:
  C1: 1行が1種類の絵文字のみで構成される
  C2: ASCII 文字（U+0000〜U+007F）を含まない
  C3: 繰り返し回数が 1〜3 である
  C4: 同一絵文字の繰り返しである（異種混在禁止）
"""

import sys
import os


def validate_line(line, line_number):
    """1行を検証し、エラーがあれば dict を返す。正常なら None。"""
    trimmed = line.rstrip("\r")

    # 空行・空白のみはスキップ
    if trimmed.strip() == "":
        return None

    # C2: ASCII 文字チェック
    for c in trimmed:
        if ord(c) < 128:
            return {
                "line": line_number,
                "content": trimmed,
                "type": "not-emoji",
                "message": (
                    f"😅 絵文字形式チェック（行 {line_number}）\n"
                    f"\n"
                    f'"{trimmed}" は絵文字ではないようです。\n'
                    f"好きな絵文字を 1〜3 個入力してください。\n"
                    f"\n"
                    f"例:\n"
                    f"  🚀     → 小さいカード\n"
                    f"  🚀🚀   → 中くらいのカード\n"
                    f"  🚀🚀🚀 → 大きいカード"
                ),
            }

    # コードポイント分割
    codepoints = list(trimmed)

    # C3: コードポイント数が 1〜3 か確認
    if len(codepoints) > 3:
        return {
            "line": line_number,
            "content": trimmed,
            "type": "too-many",
            "message": (
                f"😅 絵文字形式チェック（行 {line_number}）\n"
                f"\n"
                f'"{trimmed}" は絵文字が多すぎます（{len(codepoints)}個）。\n'
                f"絵文字は 1〜3 個にしてください。\n"
                f"\n"
                f"例:\n"
                f"  🚀     → 1個（小さいカード）\n"
                f"  🚀🚀🚀 → 3個（大きいカード）"
            ),
        }

    # C4: 全コードポイントが同一か確認（2個以上の場合）
    if len(codepoints) >= 2:
        first = codepoints[0]
        if not all(c == first for c in codepoints):
            return {
                "line": line_number,
                "content": trimmed,
                "type": "mixed-emoji",
                "message": (
                    f"😅 絵文字形式チェック（行 {line_number}）\n"
                    f"\n"
                    f'"{trimmed}" に異なる絵文字が混在しています。\n'
                    f"同じ絵文字を 1〜3 個繰り返してください。\n"
                    f"\n"
                    f"例:\n"
                    f"  🚀🚀🚀 ← OK（同じ絵文字3個）\n"
                    f"  🚀🎉   ← NG（異なる絵文字の混在）"
                ),
            }

    return None


def validate_file(content):
    """ファイル全体を検証し、エラーのリストを返す。"""
    lines = content.split("\n")
    errors = []
    for i, line in enumerate(lines):
        error = validate_line(line, i + 1)
        if error:
            errors.append(error)
    return errors


def main():
    file_path = os.path.join(os.getcwd(), "data", "emojis.txt")

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"❌ ファイルが見つかりません: {file_path}", file=sys.stderr)
        sys.exit(1)

    errors = validate_file(content)

    if errors:
        print("\n🔍 emojis.txt のバリデーションに失敗しました\n", file=sys.stderr)
        for error in errors:
            print(error["message"], file=sys.stderr)
            print("", file=sys.stderr)
        print(f"合計 {len(errors)} 件のエラーが見つかりました。", file=sys.stderr)
        sys.exit(1)

    print("✅ 絵文字形式OK")


if __name__ == "__main__":
    main()
