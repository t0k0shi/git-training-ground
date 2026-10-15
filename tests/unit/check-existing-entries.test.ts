import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { findMissingEntries, shouldSkip } from '@/scripts/check-existing-entries.mjs';

const entry = (name: string, extra: Record<string, string> = {}) => ({
  name,
  favoriteColor: '#E63946',
  favoriteEmoji: '🚀',
  message: 'hi',
  joinedAt: '2026-10-15',
  ...extra,
});

describe('findMissingEntries', () => {
  it('自分のエントリを 1 件追加しただけなら、なし', () => {
    expect(findMissingEntries([entry('a')], [entry('a'), entry('b')])).toEqual([]);
  });

  it('他人のエントリを消すと、消えたエントリを返す', () => {
    expect(findMissingEntries([entry('a'), entry('b')], [entry('b')]).map((e) => e.name)).toEqual(['a']);
  });

  it('他人のエントリを書き換えると、元のエントリを返す', () => {
    const result = findMissingEntries([entry('a')], [entry('a', { message: '書き換えた' })]);
    expect(result.map((e) => e.name)).toEqual(['a']);
  });

  it('github 欄の有無は比べない（古い手順のエントリも、移行後のエントリも同じとみなす）', () => {
    expect(findMissingEntries([entry('a', { github: 'alice' })], [entry('a')])).toEqual([]);
    expect(findMissingEntries([entry('a')], [entry('a', { github: 'alice' })])).toEqual([]);
  });

  it('中身が同じ 2 件のうち 1 件を消すと、消えた 1 件を返す', () => {
    expect(findMissingEntries([entry('a'), entry('a')], [entry('a')]).map((e) => e.name)).toEqual(['a']);
  });

  it('並べ替えただけなら、なし', () => {
    expect(findMissingEntries([entry('a'), entry('b')], [entry('b'), entry('a')])).toEqual([]);
  });
});

describe('shouldSkip', () => {
  it('PR の作成者がリポジトリのオーナーなら飛ばす（移行や誤字の修正はオーナーの PR で行う）', () => {
    expect(shouldSkip('t0k0shi', 't0k0shi')).toBe(true);
    expect(shouldSkip('T0K0SHI', 't0k0shi')).toBe(true);
  });

  it('それ以外の人と、作成者がわからないときは飛ばさない', () => {
    expect(shouldSkip('alice', 't0k0shi')).toBe(false);
    expect(shouldSkip('', 't0k0shi')).toBe(false);
    expect(shouldSkip(undefined, undefined)).toBe(false);
  });
});

describe('CLI', () => {
  const script = path.resolve('scripts/check-existing-entries.mjs');
  const write = (dir: string, name: string, data: unknown) => {
    const p = path.join(dir, name);
    fs.writeFileSync(p, JSON.stringify(data));
    return p;
  };
  const runCli = (base: unknown, head: unknown, env: Record<string, string> = {}) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'existing-'));
    return spawnSync('node', [script, write(dir, 'base.json', base), write(dir, 'head.json', head)], {
      encoding: 'utf8',
      env: { ...process.env, PR_AUTHOR: 'alice', REPO_OWNER: 't0k0shi', ...env },
    });
  };

  it('消えたエントリがあると終了コード 1 で、name を日本語で示す', () => {
    const r = runCli([entry('ketts'), entry('mori')], [entry('ketts')]);
    expect(r.status).toBe(1);
    expect(r.stdout).toContain('他の人のエントリが削除または変更されています');
    expect(r.stdout).toContain('mori');
  });

  it('追加だけなら終了コード 0', () => {
    const r = runCli([entry('ketts')], [entry('ketts'), entry('alice')]);
    expect(r.status).toBe(0);
  });

  it('オーナーの PR は、消えていても終了コード 0（検査を飛ばす）', () => {
    const r = runCli([entry('ketts'), entry('mori')], [entry('ketts')], { PR_AUTHOR: 't0k0shi' });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('オーナー');
  });
});
