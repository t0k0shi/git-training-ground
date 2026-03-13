"""
test_validate_emojis.py

CI-01 絵文字形式チェックのテスト。
requirements-v3.md G章のテストケースに対応。
"""

import unittest
from validate_emojis import validate_line, validate_file


class TestValidateLine(unittest.TestCase):
    """validate_line の単体テスト"""

    # --- 正常系 (TC-P-01 ~ TC-P-04) ---

    def test_single_emoji(self):
        """TC-P-01: 絵文字1個 → OK"""
        result = validate_line("🚀", 1)
        self.assertIsNone(result)

    def test_two_same_emoji(self):
        """TC-P-02: 同じ絵文字2個 → OK"""
        result = validate_line("🎉🎉", 1)
        self.assertIsNone(result)

    def test_three_same_emoji(self):
        """TC-P-03: 同じ絵文字3個 → OK"""
        result = validate_line("🌟🌟🌟", 1)
        self.assertIsNone(result)

    def test_empty_line_skipped(self):
        """TC-P-04: 空行 → スキップ(None)"""
        result = validate_line("", 1)
        self.assertIsNone(result)

    def test_whitespace_only_skipped(self):
        """空白のみの行もスキップ"""
        result = validate_line("   ", 1)
        self.assertIsNone(result)

    # --- 異常系: ASCII (TC-N-01 ~ TC-N-03) ---

    def test_ascii_text(self):
        """TC-N-01: ASCII文字 'hello' → FAIL"""
        result = validate_line("hello", 1)
        self.assertIsNotNone(result)
        self.assertEqual(result["type"], "not-emoji")

    def test_ascii_numbers(self):
        """TC-N-02: 数字 '123' → FAIL"""
        result = validate_line("123", 1)
        self.assertIsNotNone(result)
        self.assertEqual(result["type"], "not-emoji")

    def test_emoji_with_ascii_comment(self):
        """TC-N-03: 絵文字+ASCIIコメント → FAIL"""
        result = validate_line("🚀 これです", 1)
        self.assertIsNotNone(result)
        self.assertEqual(result["type"], "not-emoji")

    def test_emoji_with_space(self):
        """絵文字の間にスペース → FAIL (ASCII混在)"""
        result = validate_line("🚀 🚀", 1)
        self.assertIsNotNone(result)
        self.assertEqual(result["type"], "not-emoji")

    # --- 異常系: 異種混在 (TC-N-04) ---

    def test_mixed_emoji(self):
        """TC-N-04: 異なる絵文字混在 → FAIL"""
        result = validate_line("🚀🎉", 1)
        self.assertIsNotNone(result)
        self.assertEqual(result["type"], "mixed-emoji")

    def test_three_different_emoji(self):
        """3種類の異なる絵文字 → FAIL"""
        result = validate_line("🚀🎉🌟", 1)
        self.assertIsNotNone(result)
        self.assertEqual(result["type"], "mixed-emoji")

    # --- 異常系: 文字数オーバー (TC-N-05) ---

    def test_four_emoji(self):
        """TC-N-05: 4個以上 → FAIL"""
        result = validate_line("🚀🚀🚀🚀", 1)
        self.assertIsNotNone(result)
        self.assertEqual(result["type"], "too-many")

    def test_five_emoji(self):
        """5個 → FAIL"""
        result = validate_line("🎉🎉🎉🎉🎉", 1)
        self.assertIsNotNone(result)
        self.assertEqual(result["type"], "too-many")

    # --- エラーメッセージに必要な情報が含まれるか ---

    def test_error_has_line_number(self):
        """エラーメッセージに行番号が含まれる"""
        result = validate_line("hello", 5)
        self.assertIn("5", result["message"])

    def test_error_has_content(self):
        """エラーメッセージに問題の内容が含まれる"""
        result = validate_line("hello", 1)
        self.assertIn("hello", result["message"])

    def test_error_has_example(self):
        """エラーメッセージに修正例が含まれる"""
        result = validate_line("hello", 1)
        self.assertIn("🚀", result["message"])

    # --- CR/LF 処理 ---

    def test_cr_stripped(self):
        """CR文字が除去される"""
        result = validate_line("🚀\r", 1)
        self.assertIsNone(result)


class TestValidateFile(unittest.TestCase):
    """validate_file の統合テスト"""

    def test_valid_file(self):
        """正常なファイル → エラー0件"""
        content = "🚀\n🎉🎉\n🌟🌟🌟\n"
        errors = validate_file(content)
        self.assertEqual(len(errors), 0)

    def test_file_with_empty_lines(self):
        """空行を含むファイル → エラー0件"""
        content = "🚀\n\n🎉🎉\n\n"
        errors = validate_file(content)
        self.assertEqual(len(errors), 0)

    def test_file_with_errors(self):
        """エラーを含むファイル → エラー件数が正しい"""
        content = "🚀\nhello\n🎉🎉\n123\n"
        errors = validate_file(content)
        self.assertEqual(len(errors), 2)

    def test_empty_file(self):
        """空ファイル → エラー0件"""
        errors = validate_file("")
        self.assertEqual(len(errors), 0)


if __name__ == "__main__":
    unittest.main()
