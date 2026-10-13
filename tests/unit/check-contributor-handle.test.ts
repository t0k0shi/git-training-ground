import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  extractHandle,
  findAddedEntries,
  expectedGithubValue,
  checkContributorHandle,
  buildSuggestions,
  toReviewComments,
  threadsToResolve,
  formatFailureMessage,
} from '@/scripts/check-contributor-handle.mjs';
import { extractHandle as libExtractHandle } from '@/lib/contributors';

const entry = (github: string) => ({
  name: 'n',
  github,
  favoriteColor: '#E63946',
  favoriteEmoji: '🚀',
  message: 'hi',
  joinedAt: '2026-10-13',
});

const owner = 't0k0shi';

describe('extractHandle', () => {
  it('lib/contributors.ts と同じ結果を返す（サイトの表示と CI の判定をそろえる）', () => {
    for (const input of ['t0k0shi', '  someuser  ', 'https://github.com/t0k0shi/', 'github.com/a-b?tab=x', 'alice+2', '  alice+2  ', 'https://github.com/alice+3', 'alice+']) {
      expect(extractHandle(input), input).toBe(libExtractHandle(input));
    }
  });

  it('末尾の +2 を取り除く', () => {
    expect(extractHandle('alice+2')).toBe('alice');
    expect(extractHandle('https://github.com/alice+3')).toBe('alice');
  });
});

describe('findAddedEntries', () => {
  it('base になかったエントリだけを、head での位置つきで返す', () => {
    const base = [entry('t0k0shi')];
    const head = [entry('t0k0shi'), entry('alice')];
    expect(findAddedEntries(base, head)).toEqual([{ index: 1, entry: entry('alice') }]);
  });

  it('既存のエントリと同じ値でも、base より多い分は追加として扱う（PR #53 のケース）', () => {
    const base = [entry('t0k0shi'), entry('someone')];
    const head = [entry('t0k0shi'), entry('someone'), entry('someone')];
    expect(findAddedEntries(base, head)).toEqual([{ index: 2, entry: entry('someone') }]);
  });

  it('+2 を付けた 2 回目のエントリも追加として扱う', () => {
    const base = [entry('alice')];
    const head = [entry('alice'), entry('alice+2')];
    expect(findAddedEntries(base, head).map((a) => a.index)).toEqual([1]);
  });
});

describe('expectedGithubValue', () => {
  it('はじめての人は、PR を出した人のハンドル名そのもの', () => {
    expect(expectedGithubValue('alice', [entry('t0k0shi')])).toBe('alice');
  });

  it('すでに登録がある人は +2、+2 もあれば +3', () => {
    expect(expectedGithubValue('alice', [entry('alice')])).toBe('alice+2');
    expect(expectedGithubValue('alice', [entry('alice'), entry('alice+2')])).toBe('alice+3');
  });

  it('大文字小文字の違いも同じ人として扱う', () => {
    expect(expectedGithubValue('Alice', [entry('alice')])).toBe('Alice+2');
  });
});

describe('checkContributorHandle', () => {
  const base = [entry('t0k0shi')];

  it('追加したエントリの github が PR を出した人と同じなら OK', () => {
    const r = checkContributorHandle({ author: 'alice', owner, base, head: [...base, entry('alice')] });
    expect(r.ok).toBe(true);
  });

  it('大文字小文字だけの違いは OK（GitHub のユーザー名は大文字小文字を区別しない）', () => {
    const r = checkContributorHandle({ author: 'Alice', owner, base, head: [...base, entry('alice')] });
    expect(r.ok).toBe(true);
  });

  it('URL 形式や 2 回目の +2 でも、ハンドル名が同じなら OK', () => {
    const twice = [...base, entry('alice')];
    expect(checkContributorHandle({ author: 'alice', owner, base, head: [...base, entry('https://github.com/alice')] }).ok).toBe(true);
    expect(checkContributorHandle({ author: 'alice', owner, base: twice, head: [...twice, entry('alice+2')] }).ok).toBe(true);
  });

  it('github が PR を出した人と違えば NG で、正しい値を返す', () => {
    const r = checkContributorHandle({ author: 'alice', owner, base, head: [...base, entry('your-github-handle')] });
    expect(r.ok).toBe(false);
    expect(r.mismatches).toEqual([{ index: 1, github: 'your-github-handle', expected: 'alice' }]);
  });

  it('すでに登録がある人が +2 を付け忘れても、ハンドル名が本人なら OK（重複は CV-07 が案内する）', () => {
    const twice = [...base, entry('alice')];
    const r = checkContributorHandle({ author: 'alice', owner, base: twice, head: [...twice, entry('alice')] });
    expect(r.ok).toBe(true);
  });

  it('他人の既存のハンドル名をそのまま使った追加は NG（PR #53 のケース）', () => {
    const withOther = [...base, entry('someone')];
    const r = checkContributorHandle({ author: 'alice', owner, base: withOther, head: [...withOther, entry('someone')] });
    expect(r.mismatches).toEqual([{ index: 2, github: 'someone', expected: 'alice' }]);
  });

  it('オーナーと信頼済みボットの PR は検査しない', () => {
    const head = [...base, entry('someone-else')];
    expect(checkContributorHandle({ author: owner, owner, base, head }).ok).toBe(true);
    expect(checkContributorHandle({ author: 'dependabot[bot]', owner, base, head }).ok).toBe(true);
  });

  it('追加がなければ OK', () => {
    expect(checkContributorHandle({ author: 'alice', owner, base, head: base }).ok).toBe(true);
  });
});

describe('buildSuggestions', () => {
  const text = [
    '[',
    '  {',
    '    "name": "ketts",',
    '    "github": "t0k0shi",',
    '    "joinedAt": "2026-04-24"',
    '  },',
    '  {',
    '    "name": "x",',
    '    "github": "your-github-handle",',
    '    "joinedAt": "2026-10-13"',
    '  }',
    ']',
  ].join('\n');

  it('違っているエントリの github の行を、正しい値に置き換える提案を作る（行番号は 1 始まり）', () => {
    const s = buildSuggestions(text, [{ index: 1, github: 'your-github-handle', expected: 'alice' }]);
    expect(s).toEqual([{ line: 9, replacement: '    "github": "alice",' }]);
  });

  it('github の行の数がエントリの数と合わないときは、提案を作らない（誤った行を指さない）', () => {
    const broken = text.replace('    "github": "t0k0shi",\n', '');
    expect(buildSuggestions(broken, [{ index: 1, github: 'your-github-handle', expected: 'alice' }])).toEqual([]);
  });
});

describe('toReviewComments', () => {
  const suggestion = { line: 22, replacement: '    "github": "alice",' };
  const body = '```suggestion\n    "github": "alice",\n```';
  const existing = (over: Record<string, unknown> = {}) => ({
    user: { login: 'github-actions[bot]' },
    path: 'data/contributors.json',
    line: 22,
    body,
    ...over,
  });

  it('提案をレビューコメントの形にする', () => {
    expect(toReviewComments([suggestion], [])).toEqual([
      { path: 'data/contributors.json', line: 22, side: 'RIGHT', body },
    ]);
  });

  it('Bot が同じ行に同じ提案をすでに付けていれば、付けない（push のたびに増やさない）', () => {
    expect(toReviewComments([suggestion], [existing()])).toEqual([]);
  });

  it('古くなった提案（line が null）や、ほかの人のコメントは、すでにあるものとみなさない', () => {
    expect(toReviewComments([suggestion], [existing({ line: null })])).toHaveLength(1);
    expect(toReviewComments([suggestion], [existing({ user: { login: 'someone' } })])).toHaveLength(1);
  });

  it('同じ行でも、提案の中身が違えば付ける', () => {
    expect(toReviewComments([suggestion], [existing({ body: '```suggestion\n    "github": "bob",\n```' })])).toHaveLength(1);
  });
});

describe('threadsToResolve', () => {
  const thread = (over: Record<string, unknown> = {}, author = 'github-actions', body = '```suggestion\n    "github": "alice",\n```') => ({
    id: 'T1',
    isResolved: false,
    path: 'data/contributors.json',
    comments: { nodes: [{ author: { login: author }, body }] },
    ...over,
  });

  it('Bot が付けた、未解決の提案のスレッドを返す（GraphQL では Bot のログイン名に [bot] が付かない）', () => {
    expect(threadsToResolve([thread()])).toEqual(['T1']);
  });

  it('解決済みのスレッドは返さない', () => {
    expect(threadsToResolve([thread({ isResolved: true })])).toEqual([]);
  });

  it('ほかの人のスレッドや、提案ではない Bot のコメントは閉じない', () => {
    expect(threadsToResolve([thread({}, 'someone')])).toEqual([]);
    expect(threadsToResolve([thread({}, 'github-actions', 'ふつうのコメント')])).toEqual([]);
  });

  it('contributors.json 以外のファイルのスレッドは閉じない', () => {
    expect(threadsToResolve([thread({ path: 'app/page.tsx' })])).toEqual([]);
  });
});

describe('formatFailureMessage', () => {
  it('貼り付けられる正しい値と、提案のボタンの案内を出す', () => {
    const msg = formatFailureMessage('alice', [{ index: 1, github: 'your-github-handle', expected: 'alice' }]);
    expect(msg).toContain('"your-github-handle"');
    expect(msg).toContain('"github": "alice"');
    expect(msg).toContain('Commit suggestion');
  });
});

describe('CLI', () => {
  const script = path.resolve(__dirname, '../../scripts/check-contributor-handle.mjs');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'handle-check-'));
  const write = (name: string, data: unknown) => {
    const p = path.join(dir, name);
    fs.writeFileSync(p, typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    return p;
  };
  const run = (env: Record<string, string>, base: string, head: string) =>
    spawnSync('node', [script, base, head], {
      encoding: 'utf-8',
      env: { PATH: process.env.PATH ?? '', ...env },
    });

  const basePath = write('base.json', [entry('t0k0shi')]);

  it('違っていれば exit 1 で日本語メッセージを出し、提案を SUGGESTIONS_OUT に書く', () => {
    const headPath = write('head-ng.json', [entry('t0k0shi'), entry('your-github-handle')]);
    const out = path.join(dir, 'suggestions.json');
    const r = run({ PR_AUTHOR: 'alice', REPO_OWNER: owner, SUGGESTIONS_OUT: out }, basePath, headPath);
    expect(r.status).toBe(1);
    expect(r.stdout).toContain('"github": "alice"');
    const comments = JSON.parse(fs.readFileSync(out, 'utf-8'));
    expect(comments).toHaveLength(1);
    expect(comments[0].body).toContain('"github": "alice"');
  });

  it('EXISTING_COMMENTS に同じ提案があれば、SUGGESTIONS_OUT は空になる', () => {
    const headPath = write('head-ng2.json', [entry('t0k0shi'), entry('your-github-handle')]);
    const first = path.join(dir, 'first.json');
    run({ PR_AUTHOR: 'alice', REPO_OWNER: owner, SUGGESTIONS_OUT: first }, basePath, headPath);
    const posted = JSON.parse(fs.readFileSync(first, 'utf-8')).map((c: Record<string, unknown>) => ({
      ...c,
      user: { login: 'github-actions[bot]' },
    }));
    const existingPath = write('existing.json', posted);
    const second = path.join(dir, 'second.json');
    const r = run(
      { PR_AUTHOR: 'alice', REPO_OWNER: owner, SUGGESTIONS_OUT: second, EXISTING_COMMENTS: existingPath },
      basePath,
      headPath,
    );
    expect(r.status).toBe(1);
    expect(JSON.parse(fs.readFileSync(second, 'utf-8'))).toEqual([]);
  });

  it('一致していれば exit 0', () => {
    const headPath = write('head-ok.json', [entry('t0k0shi'), entry('alice')]);
    expect(run({ PR_AUTHOR: 'alice', REPO_OWNER: owner }, basePath, headPath).status).toBe(0);
  });

  it('PR 側の JSON が壊れていれば exit 0（JSON の誤りは validate が案内する）', () => {
    const headPath = write('head-broken.json', '[{');
    const r = run({ PR_AUTHOR: 'alice', REPO_OWNER: owner }, basePath, headPath);
    expect(r.status).toBe(0);
  });

  it('threads-to-resolve サブコマンドは、GraphQL の結果から閉じるスレッドの id を 1 行 1 件で出す', () => {
    const graphql = {
      data: {
        repository: {
          pullRequest: {
            reviewThreads: {
              nodes: [
                { id: 'A', isResolved: false, path: 'data/contributors.json', comments: { nodes: [{ author: { login: 'github-actions' }, body: '```suggestion\nx\n```' }] } },
                { id: 'B', isResolved: true, path: 'data/contributors.json', comments: { nodes: [{ author: { login: 'github-actions' }, body: '```suggestion\nx\n```' }] } },
              ],
            },
          },
        },
      },
    };
    const p = write('threads.json', graphql);
    const r = spawnSync('node', [script, 'threads-to-resolve', p], { encoding: 'utf-8', env: { PATH: process.env.PATH ?? '' } });
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe('A');
  });

  it('PR_AUTHOR / REPO_OWNER が未設定なら exit 1（安全側に倒す）', () => {
    const headPath = write('head-ok2.json', [entry('t0k0shi'), entry('alice')]);
    expect(run({}, basePath, headPath).status).toBe(1);
  });
});
