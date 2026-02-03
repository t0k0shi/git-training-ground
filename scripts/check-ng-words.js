/**
 * Normalize text for comparison (全角/半角を正規化)
 * @param {string} text - Text to normalize
 * @returns {string} - Normalized text
 */
function normalize(text) {
  return text
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    )
    .toLowerCase();
}

/**
 * Check contributors data for NG words
 * @param {object} contributorsData - Contributors data
 * @param {object} ngWordsData - NG words data with categories
 * @returns {object} - { valid: boolean, violations: array }
 */
function checkNgWords(contributorsData, ngWordsData) {
  // 全カテゴリからワードを結合
  const ngWords = Object.values(ngWordsData.categories).flatMap(
    (category) => category.words
  );

  // NGワードを正規化してキャッシュ
  const normalizedNgWords = ngWords.map((word) => ({
    original: word,
    normalized: normalize(word),
  }));

  const violations = [];

  for (const contributor of contributorsData.contributors) {
    if (contributor.message) {
      const normalizedMessage = normalize(contributor.message);

      for (const ngWord of normalizedNgWords) {
        if (normalizedMessage.includes(ngWord.normalized)) {
          violations.push({
            contributor: contributor.name,
            message: contributor.message,
            detectedWord: ngWord.original,
          });
          break; // 1つ見つかれば十分
        }
      }
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

// CLI実行時
if (require.main === module) {
  const fs = require('fs');

  try {
    const contributorsContent = fs.readFileSync('data/contributors.json', 'utf-8');
    const ngWordsContent = fs.readFileSync('data/ng-words.json', 'utf-8');

    const contributorsData = JSON.parse(contributorsContent);
    const ngWordsData = JSON.parse(ngWordsContent);

    const result = checkNgWords(contributorsData, ngWordsData);

    if (!result.valid) {
      console.error('❌ コンテンツチェック失敗');
      console.error('message フィールドに不適切な表現が含まれています。');
      console.error('Code of Conduct を確認し、内容を修正してください。');
      process.exit(1);
    }

    console.log('✅ NGワードチェック成功');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ エラー: 必要なデータファイルが見つかりません');
    } else if (error instanceof SyntaxError) {
      console.error('❌ エラー: JSON の構文が不正です');
    } else {
      console.error('❌ エラー:', error.message);
    }
    process.exit(1);
  }
}

module.exports = { checkNgWords };
