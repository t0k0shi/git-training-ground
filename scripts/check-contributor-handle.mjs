// 追加したエントリの github が、PR を出した人のハンドル名と同じかの検査（check-handle.yml から呼ばれる）
//
// 依存なしの ESM。pull_request_target で依存をインストールしないため、
// node の組み込みモジュール以外は import しない（ADR-0013 / ADR-0011 / ADR-0007）。
// PR 側の contributors.json は、実行せずにデータとして読むだけにする。
//
// CLI:
//   node scripts/check-contributor-handle.mjs <base の contributors.json> <PR 側の contributors.json>
//     env: PR_AUTHOR, REPO_OWNER
//          SUGGESTIONS_OUT（任意）: PR に付けるレビューコメント（[{ path, line, side, body }]）を書き出す先
//          EXISTING_COMMENTS（任意）: PR の既存のレビューコメント（API の結果）のパス。同じ提案を二重に付けないために使う
//   node scripts/check-contributor-handle.mjs threads-to-resolve <GraphQL の reviewThreads の結果>
//     -> 検査が通ったあとに閉じる、Bot の提案のスレッドの id を 1 行 1 件で出力

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';

const TRUSTED_BOTS = ['dependabot[bot]'];
const CONTRIBUTORS_PATH = 'data/contributors.json';
const SUGGESTION_BOT = 'github-actions[bot]';
// GraphQL では、同じ Bot のログイン名が [bot] なしで返る
const SUGGESTION_BOT_LOGINS = [SUGGESTION_BOT, 'github-actions'];

// lib/contributors.ts の entryKey・extractHandle と同じ規則（同じ結果になることをテストで確かめている）
const URL_PATTERN = /github\.com\/([^/?#]+)/;
// 2回目以降の参加を示す末尾の +数字
const REPEAT_SUFFIX = /\+\d+$/;
const GITHUB_LINE = /^(\s*)"github"\s*:\s*"((?:[^"\\]|\\.)*)"(\s*,?)\s*$/;

function entryKey(github) {
  const match = String(github).match(URL_PATTERN);
  if (match) {
    return match[1].replace(/\/$/, '');
  }
  return String(github).trim();
}

export function extractHandle(github) {
  return entryKey(github).replace(REPEAT_SUFFIX, '');
}

const sameUser = (a, b) => a.toLowerCase() === b.toLowerCase();

// base より多く出てくる分を「追加」とみなす。同じ値の既存のエントリがあっても、
// 増えた分は追加として扱う（他人の既存のハンドル名をそのまま使った追加を見逃さない）
export function findAddedEntries(base, head) {
  const remaining = new Map();
  for (const e of base) {
    const key = entryKey(e.github);
    remaining.set(key, (remaining.get(key) ?? 0) + 1);
  }
  const added = [];
  head.forEach((entry, index) => {
    const key = entryKey(entry.github);
    const left = remaining.get(key) ?? 0;
    if (left > 0) {
      remaining.set(key, left - 1);
    } else {
      added.push({ index, entry });
    }
  });
  return added;
}

// PR を出した人が書くべき github の値。すでに登録があれば +2、+3 と次の番号を付ける
export function expectedGithubValue(author, otherEntries) {
  const keys = new Set(otherEntries.map((e) => entryKey(e.github).toLowerCase()));
  if (!keys.has(author.toLowerCase())) {
    return author;
  }
  let n = 2;
  while (keys.has(`${author}+${n}`.toLowerCase())) n++;
  return `${author}+${n}`;
}

export function checkContributorHandle({ author, owner, base, head }) {
  if (author === owner) {
    return { ok: true, reason: 'オーナーの PR は検査の対象外です', mismatches: [] };
  }
  if (TRUSTED_BOTS.includes(author)) {
    return { ok: true, reason: '信頼済みボットの PR は検査の対象外です', mismatches: [] };
  }

  const mismatches = findAddedEntries(base, head)
    .filter(({ entry }) => !sameUser(extractHandle(entry.github), author))
    .map(({ index, entry }) => ({
      index,
      github: entry.github,
      expected: expectedGithubValue(
        author,
        head.filter((_, i) => i !== index)
      ),
    }));

  if (mismatches.length === 0) {
    return { ok: true, reason: 'github のハンドル名 OK', mismatches: [] };
  }
  return { ok: false, reason: 'github のハンドル名が PR を出した人と違います', mismatches };
}

// 違っているエントリの "github" の行を、正しい値に置き換える提案を作る（line は 1 始まり）。
// "github" の行の数がエントリの数と合わないときは、誤った行を指さないよう提案を作らない
export function buildSuggestions(text, mismatches) {
  let entries;
  try {
    entries = JSON.parse(text);
  } catch {
    return [];
  }
  const lines = text.split('\n');
  const githubLines = [];
  lines.forEach((line, i) => {
    if (GITHUB_LINE.test(line)) githubLines.push(i);
  });
  if (!Array.isArray(entries) || githubLines.length !== entries.length) {
    return [];
  }

  const suggestions = [];
  for (const m of mismatches) {
    const lineIndex = githubLines[m.index];
    const [, indent, value, trailing] = lines[lineIndex].match(GITHUB_LINE);
    if (value !== m.github) continue;
    suggestions.push({
      line: lineIndex + 1,
      replacement: `${indent}"github": "${m.expected}"${trailing.trim()}`,
    });
  }
  return suggestions;
}

// 提案を PR のレビューコメントの形にする。
// Bot が同じ行に同じ提案をすでに付けていれば除く（push のたびに同じ提案を増やさない）。
// 古くなったコメント（line が null）は、今の行を指していないので、すでにあるものとみなさない
export function toReviewComments(suggestions, existingComments) {
  const posted = new Set(
    existingComments
      .filter((c) => c.user?.login === SUGGESTION_BOT && c.path === CONTRIBUTORS_PATH && c.line != null)
      .map((c) => `${c.line}\n${c.body}`)
  );
  return suggestions
    .map((s) => ({
      path: CONTRIBUTORS_PATH,
      line: s.line,
      side: 'RIGHT',
      body: '```suggestion\n' + s.replacement + '\n```',
    }))
    .filter((c) => !posted.has(`${c.line}\n${c.body}`));
}

// 検査が通ったあとに閉じるスレッド。ブランチ保護で会話の解決を必須にしているため、
// Bot の提案のスレッドが残っていると、直したあとでもマージできない
export function threadsToResolve(threads) {
  return threads
    .filter((t) => !t.isResolved && t.path === CONTRIBUTORS_PATH)
    .filter((t) => {
      const first = t.comments?.nodes?.[0];
      return SUGGESTION_BOT_LOGINS.includes(first?.author?.login) && String(first?.body ?? '').startsWith('```suggestion');
    })
    .map((t) => t.id);
}

export function formatFailureMessage(author, mismatches) {
  const lines = [`❌ github のハンドル名が、PR を出した人（${author}）と違います`];
  for (const m of mismatches) {
    lines.push(
      '',
      `   エントリ[${m.index}] の "github": "${m.github}"`,
      `   → "github": "${m.expected}" にしてください`
    );
  }
  lines.push(
    '',
    '   💡 アバターとトップの泡には、このハンドル名の GitHub アカウントの画像を使います。',
    '   PR の「Files changed」に Bot が修正の提案を付けています。',
    '   「Commit suggestion」を押すと、そのまま直せます。'
  );
  return lines.join('\n');
}

function runCheck(basePath, headPath) {
  const author = process.env.PR_AUTHOR;
  const owner = process.env.REPO_OWNER;
  if (!author || !owner || !basePath || !headPath) {
    console.error('PR_AUTHOR・REPO_OWNER と、base・PR 側の contributors.json のパスを指定してください');
    return 1;
  }

  const headText = readFileSync(headPath, 'utf8');
  let base;
  let head;
  try {
    base = JSON.parse(readFileSync(basePath, 'utf8'));
    head = JSON.parse(headText);
  } catch {
    console.log('✅ contributors.json を読めないため検査しません（JSON の誤りは validate が案内します）');
    return 0;
  }
  if (!Array.isArray(base) || !Array.isArray(head)) {
    console.log('✅ contributors.json が配列でないため検査しません（validate が案内します）');
    return 0;
  }

  const result = checkContributorHandle({ author, owner, base, head });
  if (result.ok) {
    console.log(`✅ ${result.reason}`);
    return 0;
  }

  console.log(formatFailureMessage(author, result.mismatches));
  if (process.env.SUGGESTIONS_OUT) {
    const existing = process.env.EXISTING_COMMENTS
      ? JSON.parse(readFileSync(process.env.EXISTING_COMMENTS, 'utf8'))
      : [];
    const comments = toReviewComments(buildSuggestions(headText, result.mismatches), existing);
    writeFileSync(process.env.SUGGESTIONS_OUT, JSON.stringify(comments));
  }
  return 1;
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

function runThreadsToResolve(graphqlPath) {
  const result = JSON.parse(readFileSync(graphqlPath, 'utf8'));
  const threads = result?.data?.repository?.pullRequest?.reviewThreads?.nodes ?? [];
  for (const id of threadsToResolve(threads)) {
    console.log(id);
  }
  return 0;
}

if (isDirectlyExecuted()) {
  const command = process.argv[2];
  process.exit(
    command === 'threads-to-resolve' ? runThreadsToResolve(process.argv[3]) : runCheck(process.argv[2], process.argv[3])
  );
}
