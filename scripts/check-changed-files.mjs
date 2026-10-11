// PR の変更ファイル検査（guard-files.yml から呼ばれる）
//
// 依存なしの ESM。pull_request_target で依存をインストールしないため、
// node の組み込みモジュール以外は import しない（ADR-0011 / ADR-0007）。
//
// CLI:
//   node scripts/check-changed-files.mjs
//     env: PR_AUTHOR, REPO_OWNER, LINKED_OPEN_ISSUE ("true" / "false")
//     stdin: 変更ファイル一覧（改行区切り）
//   node scripts/check-changed-files.mjs extract-issues
//     env: PR_BODY  -> 参照 Issue 番号を 1 行 1 件で出力

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';

const ALLOWED_FILE = 'data/contributors.json';
const TRUSTED_BOTS = ['dependabot[bot]'];
const MAX_LISTED_FILES = 10;

// close(s|d) / fix(es|ed) / resolve(s|d) の直後の #数字。単語境界で "prefix #1" を除外する。
const LINK_PATTERN = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\b\s*:?\s*#(\d+)/gi;

export function extractLinkedIssues(body) {
  if (!body) return [];
  const numbers = [];
  for (const match of String(body).matchAll(LINK_PATTERN)) {
    const n = Number(match[1]);
    if (!numbers.includes(n)) numbers.push(n);
  }
  return numbers;
}

export function checkChangedFiles({ author, owner, linkedOpenIssue, files }) {
  if (author === owner) {
    return { ok: true, reason: 'オーナーの PR は検査の対象外です', invalidFiles: [] };
  }
  if (TRUSTED_BOTS.includes(author)) {
    return { ok: true, reason: '信頼済みボットの PR は検査の対象外です', invalidFiles: [] };
  }
  if (linkedOpenIssue) {
    return {
      ok: true,
      reason: 'contribution-welcome の Issue を参照しているため、コードの変更を許可します',
      invalidFiles: [],
    };
  }

  const invalidFiles = files.filter((file) => file !== ALLOWED_FILE);
  if (invalidFiles.length === 0) {
    return { ok: true, reason: '変更対象ファイル OK', invalidFiles: [] };
  }
  return {
    ok: false,
    reason: 'contributors.json 以外のファイルが変更されています',
    invalidFiles,
  };
}

export function formatFailureMessage(invalidFiles) {
  const listed = invalidFiles.slice(0, MAX_LISTED_FILES);
  const rest = invalidFiles.length - listed.length;

  const lines = [
    '❌ contributors.json 以外のファイルが変更されています',
    '   変更されたファイル:',
    ...listed.map((file) => `     - ${file}`),
  ];
  if (rest > 0) {
    lines.push(`     ほか ${rest} 件`);
  }
  lines.push(
    '',
    '   💡 この PR では data/contributors.json のみ変更してください',
    '',
    '   コードを直したい場合は、`contribution-welcome` ラベルの付いた Issue を選び、',
    '   PR の本文に `Closes #番号` を書いてください。'
  );
  return lines.join('\n');
}

function runCheck() {
  const author = process.env.PR_AUTHOR;
  const owner = process.env.REPO_OWNER;
  if (!author || !owner) {
    console.error('PR_AUTHOR と REPO_OWNER を環境変数で指定してください');
    return 1;
  }

  const files = readFileSync(0, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');

  const result = checkChangedFiles({
    author,
    owner,
    linkedOpenIssue: process.env.LINKED_OPEN_ISSUE === 'true',
    files,
  });

  if (!result.ok) {
    console.log(formatFailureMessage(result.invalidFiles));
    return 1;
  }
  console.log(`✅ ${result.reason}`);
  return 0;
}

function runExtractIssues() {
  for (const n of extractLinkedIssues(process.env.PR_BODY)) {
    console.log(n);
  }
  return 0;
}

// 直接実行されたときだけ CLI として動かす（validate-contributors.ts と同じ判定方法）
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
  const command = process.argv[2];
  process.exit(command === 'extract-issues' ? runExtractIssues() : runCheck());
}
