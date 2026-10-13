// GitHub Pages 用のビルド（out/）の HTML に、basePath の付いていないサイト内リンクがないかの検査
//
// GitHub Pages ではサイトが /git-training-ground の下に置かれるため、素の <a href="/tutorial"> は
// https://t0k0shi.github.io/tutorial を指して 404 になる。通常のビルド（basePath なし）で動く E2E では見つからない。
// 依存なしの ESM（node の組み込みモジュールだけを使う）。
//
// CLI:
//   node scripts/check-base-path-links.mjs <out ディレクトリ> <basePath（例: /git-training-ground）>

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readdirSync, readFileSync } from 'node:fs';

// href="/..." / src="/..." を拾う。// で始まるもの（プロトコル相対の URL）は除く
const ATTR_PATTERN = /\b(href|src)=(["'])(\/(?!\/)[^"']*)\2/g;

export function findLinksWithoutBasePath(html, basePath) {
  const found = [];
  for (const match of html.matchAll(ATTR_PATTERN)) {
    const url = match[3];
    // basePath そのもの、または basePath の直後が / ? # のものは OK（/git-training-groundX は NG）
    const rest = url.slice(basePath.length);
    const ok = url.startsWith(basePath) && (rest === '' || /^[/?#]/.test(rest));
    if (!ok) found.push(match[0]);
  }
  return found;
}

function listHtmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

function run(outDir, basePath) {
  if (!outDir || !basePath) {
    console.error('out ディレクトリと basePath を指定してください（例: node scripts/check-base-path-links.mjs out /git-training-ground）');
    return 1;
  }
  let problems = 0;
  for (const file of listHtmlFiles(outDir)) {
    const found = findLinksWithoutBasePath(readFileSync(file, 'utf8'), basePath);
    if (found.length === 0) continue;
    problems += found.length;
    console.log(`❌ ${path.relative(outDir, file)}: basePath（${basePath}）の付いていないリンク`);
    for (const link of [...new Set(found)]) console.log(`     - ${link}`);
  }
  if (problems > 0) {
    console.log('');
    console.log('   💡 サイト内リンクは next/link の <Link> で書いてください（basePath が自動で付きます）。');
    console.log('      画像などは lib の asset() を使ってください。');
    return 1;
  }
  console.log(`✅ すべてのサイト内リンクに basePath（${basePath}）が付いています`);
  return 0;
}

// 直接実行されたときだけ CLI として動かす（check-changed-files.mjs と同じ判定方法）
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
