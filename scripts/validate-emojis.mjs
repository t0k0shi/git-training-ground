#!/usr/bin/env node

/**
 * validate-emojis.mjs
 *
 * CI バリデーションスクリプト: data/emojis.txt のフォーマットを検証する。
 * - 各行が絵文字のみで構成されていること
 * - 1行あたり 1-3 文字（grapheme cluster 単位）
 * - 同一行は同じ絵文字の繰り返し
 * - 空行はスキップ
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * grapheme cluster 単位で文字列をセグメントに分割する
 */
function segmentGraphemes(str) {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  return [...segmenter.segment(str)].map((s) => s.segment);
}

/**
 * 単一の grapheme cluster が絵文字であるか判定する
 * Extended_Pictographic を含むことを必須とし、数字や記号単体を排除する
 */
function isEmojiGrapheme(grapheme) {
  return /\p{Extended_Pictographic}/u.test(grapheme);
}

/**
 * 文字列が絵文字のみで構成されているか判定する
 * 各 grapheme cluster が Extended_Pictographic を含むことを確認する
 */
function isEmojiOnly(str) {
  const graphemes = segmentGraphemes(str);
  if (graphemes.length === 0) return false;
  return graphemes.every(isEmojiGrapheme);
}

/**
 * 1行を検証し、エラーがあればメッセージを返す
 */
export function validateLine(line, lineNumber) {
  const trimmed = line.replace(/\r$/, '');

  // 空行はスキップ
  if (trimmed === '') return null;

  // 絵文字のみで構成されているかチェック
  if (!isEmojiOnly(trimmed)) {
    return {
      line: lineNumber,
      content: trimmed,
      type: 'not-emoji',
      message: [
        `❌ 絵文字以外の文字が含まれています`,
        `   問題の行 (${lineNumber}行目): "${trimmed}"`,
        ``,
        `   💡 emojis.txt には絵文字のみ入力できます`,
        `   例: 🚀 / 🎉🎉 / 🌟🌟🌟`,
      ].join('\n'),
    };
  }

  // grapheme cluster 単位でカウント
  const graphemes = segmentGraphemes(trimmed);

  // 1-3 文字チェック
  if (graphemes.length > 3) {
    return {
      line: lineNumber,
      content: trimmed,
      type: 'too-many',
      message: [
        `❌ 1行に4文字以上の絵文字があります`,
        `   問題の行 (${lineNumber}行目): "${trimmed}"`,
        ``,
        `   💡 絵文字は1行に1〜3個まで（カードの大きさになります）`,
        `   🐱 → 小 / 🐱🐱 → 中 / 🐱🐱🐱 → 大`,
      ].join('\n'),
    };
  }

  // 同一絵文字チェック（2文字以上の場合）
  if (graphemes.length >= 2) {
    const first = graphemes[0];
    const allSame = graphemes.every((g) => g === first);
    if (!allSame) {
      return {
        line: lineNumber,
        content: trimmed,
        type: 'mixed-emoji',
        message: [
          `❌ 1行に異なる絵文字が混在しています`,
          `   問題の行 (${lineNumber}行目): "${trimmed}"`,
          ``,
          `   💡 1行には同じ絵文字を繰り返してください`,
          `   ✅ 🎉🎉🎉  ❌ 🎉🚀🌟`,
        ].join('\n'),
      };
    }
  }

  return null;
}

/**
 * ファイル全体を検証する
 */
export function validateFile(content) {
  const lines = content.split('\n');
  const errors = [];

  for (let i = 0; i < lines.length; i++) {
    const error = validateLine(lines[i], i + 1);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
}

/**
 * メインエントリポイント（CLI 実行時）
 */
function main() {
  const filePath = resolve(process.cwd(), 'data', 'emojis.txt');

  let content;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (e) {
    console.error(`❌ ファイルが見つかりません: ${filePath}`);
    process.exit(1);
  }

  const errors = validateFile(content);

  if (errors.length > 0) {
    console.error(`\n🔍 emojis.txt のバリデーションに失敗しました\n`);
    for (const error of errors) {
      console.error(error.message);
      console.error('');
    }
    console.error(`合計 ${errors.length} 件のエラーが見つかりました。`);
    process.exit(1);
  }

  console.log('✅ emojis.txt のバリデーションに成功しました');
}

// CLI 実行時のみ main() を呼び出す
const isMain =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));

// import.meta.url ベースの判定（Node.js ESM）
if (isMain || process.argv[1]?.endsWith('validate-emojis.mjs')) {
  main();
}
