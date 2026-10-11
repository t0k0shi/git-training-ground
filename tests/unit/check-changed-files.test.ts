import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import path from 'path';
import {
  extractLinkedIssues,
  checkChangedFiles,
  formatFailureMessage,
} from '@/scripts/check-changed-files.mjs';

const CONTRIBUTORS = 'data/contributors.json';

const base = {
  author: 'someone',
  owner: 't0k0shi',
  linkedOpenIssue: false,
};

describe('extractLinkedIssues', () => {
  it('Closes #12 を抜き出す', () => {
    expect(extractLinkedIssues('Closes #12')).toEqual([12]);
  });

  it('fixes #3 を抜き出す', () => {
    expect(extractLinkedIssues('fixes #3')).toEqual([3]);
  });

  it('全キーワード（close/fix/resolve の各活用）に対応する', () => {
    const body = [
      'close #1',
      'closes #2',
      'closed #3',
      'fix #4',
      'fixes #5',
      'fixed #6',
      'resolve #7',
      'resolves #8',
      'resolved #9',
    ].join('\n');
    expect(extractLinkedIssues(body)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('大文字小文字を区別しない', () => {
    expect(extractLinkedIssues('CLOSES #5 and Fixes #6')).toEqual([5, 6]);
  });

  it('複数参照を抜き出す', () => {
    expect(extractLinkedIssues('Closes #1\nFixes #2')).toEqual([1, 2]);
  });

  it('重複を除く', () => {
    expect(extractLinkedIssues('Closes #1, closes #1')).toEqual([1]);
  });

  it('参照がなければ空配列', () => {
    expect(extractLinkedIssues('ただの説明文です')).toEqual([]);
  });

  it('キーワードなしの #N は対象外', () => {
    expect(extractLinkedIssues('see #12 and #13')).toEqual([]);
  });

  it('空文字・null・undefined は空配列', () => {
    expect(extractLinkedIssues('')).toEqual([]);
    expect(extractLinkedIssues(null)).toEqual([]);
    expect(extractLinkedIssues(undefined)).toEqual([]);
  });

  it('キーワードと # の間にコロンや空白があっても拾う', () => {
    expect(extractLinkedIssues('Closes: #7')).toEqual([7]);
  });

  it('語の途中に含まれるキーワードは対象外（prefix #1 など）', () => {
    expect(extractLinkedIssues('prefix #1')).toEqual([]);
  });
});

describe('checkChangedFiles', () => {
  it('オーナーの PR は他ファイルでも ok', () => {
    const r = checkChangedFiles({ ...base, author: 't0k0shi', files: ['app/page.tsx'] });
    expect(r.ok).toBe(true);
    expect(r.invalidFiles).toEqual([]);
  });

  it('dependabot[bot] は ok', () => {
    const r = checkChangedFiles({ ...base, author: 'dependabot[bot]', files: ['package.json'] });
    expect(r.ok).toBe(true);
  });

  it('開放 Issue を参照していれば他ファイルでも ok', () => {
    const r = checkChangedFiles({ ...base, linkedOpenIssue: true, files: ['app/page.tsx'] });
    expect(r.ok).toBe(true);
  });

  it('contributors.json のみなら ok', () => {
    const r = checkChangedFiles({ ...base, files: [CONTRIBUTORS] });
    expect(r.ok).toBe(true);
    expect(r.invalidFiles).toEqual([]);
  });

  it('contributors.json と他ファイル混在は ng で、他ファイルだけが invalidFiles に入る', () => {
    const r = checkChangedFiles({ ...base, files: [CONTRIBUTORS, 'app/page.tsx'] });
    expect(r.ok).toBe(false);
    expect(r.invalidFiles).toEqual(['app/page.tsx']);
    expect(r.reason).toBeTruthy();
  });

  it('他ファイルのみは ng', () => {
    const r = checkChangedFiles({ ...base, files: ['README.md', 'lib/a.ts'] });
    expect(r.ok).toBe(false);
    expect(r.invalidFiles).toEqual(['README.md', 'lib/a.ts']);
  });

  it('空のファイル一覧は ok', () => {
    const r = checkChangedFiles({ ...base, files: [] });
    expect(r.ok).toBe(true);
  });

  it('リネーム元が許可外なら ng（previous_filename も files に含まれる）', () => {
    const r = checkChangedFiles({ ...base, files: [CONTRIBUTORS, 'app/old.tsx'] });
    expect(r.ok).toBe(false);
    expect(r.invalidFiles).toContain('app/old.tsx');
  });

  it('似た名前のパスは許可しない', () => {
    const r = checkChangedFiles({
      ...base,
      files: ['data/contributors.json.bak', 'foo/data/contributors.json'],
    });
    expect(r.ok).toBe(false);
    expect(r.invalidFiles).toHaveLength(2);
  });

  it('作成者の大文字小文字違いはオーナー扱いにしない', () => {
    const r = checkChangedFiles({ ...base, author: 'T0K0SHI', files: ['a.ts'] });
    expect(r.ok).toBe(false);
  });
});

describe('formatFailureMessage', () => {
  it('既存文言と案内を含む', () => {
    const msg = formatFailureMessage(['app/page.tsx']);
    expect(msg).toContain('❌ contributors.json 以外のファイルが変更されています');
    expect(msg).toContain('app/page.tsx');
    expect(msg).toContain('💡 この PR では data/contributors.json のみ変更してください');
    expect(msg).toContain('contribution-welcome');
    expect(msg).toContain('Closes #番号');
  });

  it('10 件ちょうどは「ほか」を出さない', () => {
    const files = Array.from({ length: 10 }, (_, i) => `f${i}.ts`);
    const msg = formatFailureMessage(files);
    expect(msg).toContain('f9.ts');
    expect(msg).not.toContain('ほか');
  });

  it('11 件以上は 10 件で打ち切り「ほか N 件」を出す', () => {
    const files = Array.from({ length: 13 }, (_, i) => `f${i}.ts`);
    const msg = formatFailureMessage(files);
    expect(msg).toContain('f9.ts');
    expect(msg).not.toContain('f10.ts');
    expect(msg).toContain('ほか 3 件');
  });
});

describe('CLI', () => {
  const script = path.resolve(__dirname, '../../scripts/check-changed-files.mjs');

  const run = (env: Record<string, string>, stdin: string) =>
    spawnSync('node', [script], {
      input: stdin,
      encoding: 'utf-8',
      env: { PATH: process.env.PATH ?? '', ...env },
    });

  it('許可外ファイルがあれば exit 1 で日本語メッセージを出す', () => {
    const r = run(
      { PR_AUTHOR: 'someone', REPO_OWNER: 't0k0shi', LINKED_OPEN_ISSUE: 'false' },
      'data/contributors.json\napp/page.tsx\n'
    );
    expect(r.status).toBe(1);
    expect(r.stdout + r.stderr).toContain('contributors.json 以外のファイルが変更されています');
    expect(r.stdout + r.stderr).toContain('app/page.tsx');
  });

  it('contributors.json のみなら exit 0', () => {
    const r = run(
      { PR_AUTHOR: 'someone', REPO_OWNER: 't0k0shi', LINKED_OPEN_ISSUE: 'false' },
      'data/contributors.json\n'
    );
    expect(r.status).toBe(0);
  });

  it('LINKED_OPEN_ISSUE=true なら他ファイルでも exit 0', () => {
    const r = run(
      { PR_AUTHOR: 'someone', REPO_OWNER: 't0k0shi', LINKED_OPEN_ISSUE: 'true' },
      'app/page.tsx\n'
    );
    expect(r.status).toBe(0);
  });

  it('オーナーなら exit 0', () => {
    const r = run(
      { PR_AUTHOR: 't0k0shi', REPO_OWNER: 't0k0shi', LINKED_OPEN_ISSUE: 'false' },
      'app/page.tsx\n'
    );
    expect(r.status).toBe(0);
  });

  it('extract-issues サブコマンドは PR_BODY から Issue 番号を 1 行 1 件で出す', () => {
    const r = spawnSync('node', [script, 'extract-issues'], {
      encoding: 'utf-8',
      env: { PATH: process.env.PATH ?? '', PR_BODY: 'Closes #4\nfixes #9' },
    });
    expect(r.status).toBe(0);
    expect(r.stdout.trim().split('\n')).toEqual(['4', '9']);
  });

  it('PR_AUTHOR / REPO_OWNER が未設定なら exit 1（安全側に倒す）', () => {
    const r = run({}, 'data/contributors.json\n');
    expect(r.status).toBe(1);
  });
});
