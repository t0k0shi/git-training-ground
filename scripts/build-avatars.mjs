// contributors.json の各エントリを「誰が追加したか」を調べ、アバター用の生成ファイルを書き出す（deploy.yml から呼ばれる）
//
// アバターは JSON に書かれた値ではなく、エントリを追加した PR の作成者から作る（ADR-0016）。
// git の履歴を main に入った順にたどり、エントリ単位の差分で「最初に追加したコミット」を決める。
// 行単位の git blame は使わない。末尾にエントリを足すと、直前の人の `}` や同じ日付の行が差分の上でずれ、
// 直前の人が新しいコミットに付け替えられることがあるため。
//
// 依存なしの ESM（node の組み込みモジュールと、Node 22 の fetch だけを使う）。
//
// CLI:
//   node scripts/build-avatars.mjs
//     env: GITHUB_TOKEN（任意。なければ API を使わず、全員アバターなし）
//          GITHUB_REPOSITORY（任意。既定は t0k0shi/git-training-ground）
//     -> data/avatars.generated.json を書き出す。API の失敗ではビルドを止めないよう、終了コードは常に 0

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const CONTRIBUTORS_PATH = 'data/contributors.json';
const OUTPUT_PATH = 'data/avatars.generated.json';
const DEFAULT_REPOSITORY = 't0k0shi/git-training-ground';
const NONE = Object.freeze({ login: null, id: null, source: 'none', pr: null });

// v5 までの github 欄は比べない。v6 の移行で github 欄を消しても、エントリが「書き換わった」とみなされないように
const IGNORED_KEYS = new Set(['github']);

/** エントリの中身を、キーの順をそろえた文字列にする */
export function fingerprint(entry) {
  const keys = Object.keys(entry)
    .filter((k) => !IGNORED_KEYS.has(k))
    .sort();
  return JSON.stringify(keys.map((k) => [k, entry[k]]));
}

/** 2 つの並びの LCS で、対応する位置の組 [i, j] を前から順に返す */
function lcsPairs(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const pairs = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      pairs.push([i, j]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      i++;
    } else {
      j++;
    }
  }
  return pairs;
}

/**
 * 古い順の版の並び（[{ commit, entries }]、読めない版は entries: null）から、
 * 最後の版の各エントリを追加したコミットを返す
 *
 * 対応しなかった部分（古い m 件・新しい n 件）は、先頭から min(m, n) 件を「書き換え」として元のコミットを引き継ぎ、
 * 残りの新しいエントリをその版のコミットが追加したとみなす。誤字の修正や github 欄の削除では追加者が変わらない
 */
export function attributeEntries(versions) {
  let prev = []; // [{ fp, commit }]
  for (const { commit, entries } of versions) {
    if (!Array.isArray(entries)) continue;
    const next = entries.map((e) => fingerprint(e));
    const pairs = [...lcsPairs(prev.map((p) => p.fp), next), [prev.length, next.length]];
    const result = [];
    let i = 0;
    let j = 0;
    for (const [pi, pj] of pairs) {
      // 対応しなかった区間: prev[i..pi)、next[j..pj)
      for (let k = 0; j + k < pj; k++) {
        const inherited = i + k < pi ? prev[i + k].commit : commit;
        result.push({ fp: next[j + k], commit: inherited });
      }
      if (pj < next.length) result.push({ fp: next[pj], commit: prev[pi].commit });
      i = pi + 1;
      j = pj + 1;
    }
    prev = result;
  }
  return prev.map((p) => p.commit);
}

const isBot = (user) => user?.type === 'Bot';

/**
 * コミットから追加者を引く。api(path) は `repos/{owner}/{repo}/` に続くパスを受け取り、JSON を返す
 * 1. そのコミットを含む、マージ済みの PR の作成者（merge_commit_sha が一致するものを優先）
 * 2. PR がなければ、コミットの作成者（main に直接 push できるのは管理人だけ）
 * どちらも取れない・API が失敗したときは「なし」。例外は投げない
 */
export async function resolveAdder(sha, api) {
  try {
    const pulls = await api(`commits/${sha}/pulls`);
    const merged = (Array.isArray(pulls) ? pulls : []).filter((p) => p.merged_at);
    const pr = merged.find((p) => p.merge_commit_sha === sha) ?? merged[0];
    if (pr) {
      if (!pr.user || isBot(pr.user)) return { ...NONE };
      return { login: pr.user.login, id: pr.user.id, source: 'pr', pr: pr.number };
    }
    const commit = await api(`commits/${sha}`);
    const author = commit?.author;
    if (!author || isBot(author)) return { ...NONE };
    return { login: author.login, id: author.id, source: 'commit', pr: null };
  } catch {
    return { ...NONE };
  }
}

/** 版の並びから、生成ファイルの中身を作る。同じコミットへの問い合わせは 1 回にまとめる */
export async function buildAvatarFile(versions, api, now = () => new Date().toISOString()) {
  const commits = attributeEntries(versions);
  const cache = new Map();
  const entries = [];
  for (const [index, sha] of commits.entries()) {
    if (!cache.has(sha)) cache.set(sha, await resolveAdder(sha, api));
    entries.push({ index, ...cache.get(sha) });
  }
  return { generatedAt: now(), entries };
}

function git(...args) {
  // そのコミットにファイルがない版（削除された版）では git show が失敗する。そのエラー出力は表示しない
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] });
}

/** main に入った順に、contributors.json の各版を読む */
function readVersions() {
  const shas = git('log', '--first-parent', '--reverse', '--format=%H', 'HEAD', '--', CONTRIBUTORS_PATH)
    .split('\n')
    .filter(Boolean);
  return shas.map((commit) => {
    try {
      const parsed = JSON.parse(git('show', `${commit}:${CONTRIBUTORS_PATH}`));
      return { commit, entries: Array.isArray(parsed) ? parsed : null };
    } catch {
      return { commit, entries: null };
    }
  });
}

function githubApi(repository, token) {
  return async (p) => {
    const res = await fetch(`https://api.github.com/repos/${repository}/${p}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (!res.ok) throw new Error(`${res.status} ${p}`);
    return res.json();
  };
}

async function run() {
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY || DEFAULT_REPOSITORY;
  let file;
  try {
    const versions = readVersions();
    // トークンがなければ API を使わない（全員「なし」）
    const api = token ? githubApi(repository, token) : async () => { throw new Error('no token'); };
    file = await buildAvatarFile(versions, api);
  } catch (e) {
    console.log(`⚠️ 追加者を調べられませんでした（${e.message}）。全員アバターなしで表示します`);
    return 0;
  }
  writeFileSync(OUTPUT_PATH, JSON.stringify(file, null, 2) + '\n');
  const none = file.entries.filter((e) => e.source === 'none').length;
  console.log(`✅ ${OUTPUT_PATH} を書き出しました（${file.entries.length} 件、うちアバターなし ${none} 件）`);
  if (!token) console.log('   GITHUB_TOKEN がないため、API を使っていません');
  return 0;
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
  run().then((code) => process.exit(code));
}
