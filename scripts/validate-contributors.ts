import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';
import { entryKey, extractHandle } from '../lib/contributors';

export interface ValidationError {
  check: string;
  message: string;
}

const REQUIRED_FIELDS = ['name', 'github', 'favoriteColor', 'favoriteEmoji', 'message', 'joinedAt'] as const;
const COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface ValidateOptions {
  /** PR を出した人の GitHub のログイン名。わかるときは、CV-07 の直し方をその人のハンドル名で案内する */
  author?: string;
}

// data の中で、author が使うべき github の値（未登録なら author、登録済みなら +2、+3）
function nextValueFor(author: string, data: unknown[]): string {
  const keys = new Set(
    data
      .map((e) => (e as Record<string, unknown>)?.github)
      .filter((g): g is string => typeof g === 'string')
      .map((g) => entryKey(g).toLowerCase())
  );
  if (!keys.has(author.toLowerCase())) return author;
  let n = 2;
  while (keys.has(`${author}+${n}`.toLowerCase())) n++;
  return `${author}+${n}`;
}

export function validateContributors(data: unknown, options: ValidateOptions = {}): ValidationError[] {
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
      const isBlankString = typeof val === 'string' && val.trim() === '';
      if (val === null || val === undefined || isBlankString) {
        errors.push({
          check: 'CV-04',
          message: `❌ CV-04: ${idx} の "${field}" が空です。null / undefined / 空文字列 / 空白だけの文字列は使えません。`,
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

    // CV-07: github ハンドル重複チェック（2回目以降の参加は末尾に +2、+3 を付けて区別する）
    if (typeof entry.github === 'string' && entry.github !== '') {
      const key = entryKey(entry.github);
      if (handles.has(key)) {
        const handle = extractHandle(entry.github);
        const { author } = options;
        if (author && handle.toLowerCase() !== author.toLowerCase()) {
          // 他人のハンドル名を使っている。+2 ではなく、自分のハンドル名を案内する（check-handle と案内をそろえる）
          errors.push({
            check: 'CV-07',
            message: `❌ CV-07: github ハンドル "${key}" はすでに登録されています（${idx}）。\n   github には、PR を出す自分のハンドル名を入れてください（例: "${nextValueFor(author, data)}"）。`,
          });
        } else {
          let n = 2;
          while (handles.has(`${handle}+${n}`)) n++;
          errors.push({
            check: 'CV-07',
            message: `❌ CV-07: github ハンドル "${key}" はすでに登録されています（${idx}）。\n   2回目以降の参加なら、後ろに +${n} を付けてください（例: "${handle}+${n}"）。アバターと表示は同じハンドルのままです。`,
          });
        }
      }
      handles.add(key);
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

  // validate-pr.yml から PR を出した人のログイン名を受け取る（ローカル実行では未設定）
  const errors = validateContributors(raw, { author: process.env.PR_AUTHOR || undefined });

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

// モジュールとして import された場合は main() を実行しない。
// 旧実装の process.argv[1]?.endsWith('...') は tsx シム経由・シンボリックリンク経由で
// silent に false negative になる可能性があったため、ESM 標準の import.meta.url ベースに変更。
// audit-v4 Critical C-3 対応 (Issue #16)
//
// 判定方法: 「自分自身が直接実行されているか」を URL レベルで比較する。
//   - tsx 経由実行時: process.argv[1] は .ts の絶対パス → fileURL に変換して一致確認
//   - シムや stdin (`-` や空文字) からの呼び出し: argv[1] が無効値 → 直接実行ではないと判定
function isDirectlyExecuted(): boolean {
  const argv1 = process.argv[1];
  if (!argv1) return false;
  try {
    const argvUrl = pathToFileURL(path.resolve(argv1)).href;
    return import.meta.url === argvUrl;
  } catch {
    return false;
  }
}

if (isDirectlyExecuted()) {
  main();
}
