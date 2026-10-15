// 参加者の PR が、他の人のエントリを消したり書き換えたりしていないかの検査（validate-pr.yml から呼ばれる）
//
// v5 までは github の値の集合で比べていたが、v6 で github 欄をなくしたため（ADR-0016）、
// エントリの中身（build-avatars.mjs と同じ指紋。github 欄は除く）で比べる。
// base にあるエントリは、PR 側にすべて同じ中身で残っていなければならない（並べ替えは許す）。
// オーナーの PR は飛ばす。v6 の移行や誤字の修正は、オーナーの PR で行うため（guard-files と同じ扱い）。
//
// 依存なしの ESM（node の組み込みモジュールだけを使う）。
//
// CLI:
//   node scripts/check-existing-entries.mjs <base の contributors.json> <PR 側の contributors.json>
//     env: PR_AUTHOR, REPO_OWNER

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import { fingerprint } from './build-avatars.mjs';

/** base にあって head に残っていない（消された・書き換えられた）エントリを返す */
export function findMissingEntries(base, head) {
  const remaining = new Map();
  for (const e of head) {
    const fp = fingerprint(e);
    remaining.set(fp, (remaining.get(fp) ?? 0) + 1);
  }
  const missing = [];
  for (const e of base) {
    const fp = fingerprint(e);
    const left = remaining.get(fp) ?? 0;
    if (left > 0) {
      remaining.set(fp, left - 1);
    } else {
      missing.push(e);
    }
  }
  return missing;
}

/** PR の作成者がリポジトリのオーナーなら、検査を飛ばす */
export function shouldSkip(author, owner) {
  if (!author || !owner) return false;
  return author.toLowerCase() === owner.toLowerCase();
}

function run(basePath, headPath) {
  if (shouldSkip(process.env.PR_AUTHOR, process.env.REPO_OWNER)) {
    console.log('⏭️ オーナーの PR なので、既存エントリの保護の検査を飛ばします');
    return 0;
  }
  const base = JSON.parse(readFileSync(basePath, 'utf8'));
  const head = JSON.parse(readFileSync(headPath, 'utf8'));
  const missing = findMissingEntries(base, head);
  if (missing.length === 0) {
    console.log('✅ 既存エントリの削除・変更なし');
    return 0;
  }
  console.log('😅 既存エントリの保護');
  console.log('');
  console.log('他の人のエントリが削除または変更されています。');
  console.log('自分のエントリを追加するだけにしてください（他の人のエントリは元のままにします）。');
  console.log('');
  console.log('元に戻してほしいエントリ:');
  for (const e of missing.slice(0, 5)) {
    console.log(`  - name: "${e.name}"`);
  }
  console.log('');
  console.log('わからない場合はそのまま PR を出してください。管理人が確認します。');
  return 1;
}

// 直接実行されたときだけ CLI として動かす（check-base-path-links.mjs と同じ判定方法）
function isDirectlyExecuted() {
  const argv1 = process.argv[1];
  if (!argv1) return false;
  try {
    return import.meta.url === pathToFileURL(path.resolve(argv1)).href;
  } catch {
    return false;
  }
}

if (isDirectlyExecuted()) {
  process.exit(run(process.argv[2], process.argv[3]));
}
