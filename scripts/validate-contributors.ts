import fs from 'fs/promises';
import path from 'path';
import { extractHandle } from '../lib/contributors';

export interface ValidationError {
  check: string;
  message: string;
}

const REQUIRED_FIELDS = ['name', 'github', 'favoriteColor', 'favoriteEmoji', 'message', 'joinedAt'] as const;
const COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function validateContributors(data: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!Array.isArray(data)) {
    errors.push({
      check: 'CV-02',
      message: `❌ CV-02: トップレベルが配列ではありません。配列形式 [ {...}, {...} ] で記述してください。`,
    });
    return errors;
  }

  const handles = new Set<string>();

  for (let i = 0; i < data.length; i++) {
    const entry = data[i] as Record<string, unknown>;
    const idx = `エントリ[${i}]`;

    // CV-03: 全フィールド存在チェック
    for (const field of REQUIRED_FIELDS) {
      if (!(field in entry)) {
        errors.push({
          check: 'CV-03',
          message: `❌ CV-03: ${idx} に "${field}" フィールドがありません。`,
        });
      }
    }

    // CV-04: 空値チェック
    for (const field of REQUIRED_FIELDS) {
      const val = entry[field];
      if (val === null || val === undefined || val === '') {
        errors.push({
          check: 'CV-04',
          message: `❌ CV-04: ${idx} の "${field}" が空です。null / undefined / 空文字列は使えません。`,
        });
      }
    }

    // CV-05: favoriteColor 形式チェック
    if (typeof entry.favoriteColor === 'string' && entry.favoriteColor !== '') {
      if (!COLOR_PATTERN.test(entry.favoriteColor)) {
        errors.push({
          check: 'CV-05',
          message: `❌ CV-05: ${idx} (github: "${entry.github}") の favoriteColor が不正です: "${entry.favoriteColor}"\n   期待: "#RRGGBB" 形式（例: "#E63946"）`,
        });
      }
    }

    // CV-06: joinedAt 形式チェック
    if (typeof entry.joinedAt === 'string' && entry.joinedAt !== '') {
      if (!DATE_PATTERN.test(entry.joinedAt)) {
        errors.push({
          check: 'CV-06',
          message: `❌ CV-06: ${idx} の joinedAt が不正です: "${entry.joinedAt}"\n   期待: "YYYY-MM-DD" 形式（例: "2026-04-24"）`,
        });
      }
    }

    // CV-07: github ハンドル重複チェック
    if (typeof entry.github === 'string' && entry.github !== '') {
      const handle = extractHandle(entry.github);
      if (handles.has(handle)) {
        errors.push({
          check: 'CV-07',
          message: `❌ CV-07: github ハンドル "${handle}" が重複しています（${idx}）。1人1エントリのみ登録できます。`,
        });
      }
      handles.add(handle);
    }

    // CV-08: favoriteEmoji が grapheme cluster 1 文字チェック
    if (typeof entry.favoriteEmoji === 'string' && entry.favoriteEmoji !== '') {
      const segmenter = new Intl.Segmenter();
      const segments = [...segmenter.segment(entry.favoriteEmoji)];
      if (segments.length !== 1) {
        errors.push({
          check: 'CV-08',
          message: `❌ CV-08: ${idx} の favoriteEmoji が 1 文字ではありません: "${entry.favoriteEmoji}" (${segments.length} 文字)\n   絵文字を 1 つだけ入力してください。`,
        });
      }
    }
  }

  return errors;
}

async function main(): Promise<void> {
  const filePath = path.join(process.cwd(), 'data', 'contributors.json');

  let raw: unknown;
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    raw = JSON.parse(content);
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error(`❌ CV-01: contributors.json が正しい JSON ではありません: ${e.message}`);
    } else {
      console.error(`❌ contributors.json を読み込めませんでした: ${e}`);
    }
    process.exit(1);
  }

  const errors = validateContributors(raw);

  if (errors.length > 0) {
    for (const err of errors) {
      console.error(err.message);
    }
    console.error(`\n合計 ${errors.length} 件のエラーが見つかりました。`);
    process.exit(1);
  }

  const count = Array.isArray(raw) ? raw.length : 0;
  console.log(`✅ contributors.json の検証が完了しました（${count} 件のエントリ）`);
}

// モジュールとして import された場合は main() を実行しない
const isMain = process.argv[1]?.endsWith('validate-contributors.ts') ||
               process.argv[1]?.endsWith('validate-contributors.js');
if (isMain) {
  main();
}
