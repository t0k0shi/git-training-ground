import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { findLinksWithoutBasePath } from '@/scripts/check-base-path-links.mjs';

const BASE = '/git-training-ground';

describe('findLinksWithoutBasePath', () => {
  it('basePath が付いていないサイト内の href を見つける', () => {
    const html = '<a href="/tutorial">参加する</a><a href="/git-training-ground/tutorial">OK</a>';
    expect(findLinksWithoutBasePath(html, BASE)).toEqual(['href="/tutorial"']);
  });

  it('src も確かめる', () => {
    expect(findLinksWithoutBasePath('<img src="/tutorial/step1.png">', BASE)).toEqual(['src="/tutorial/step1.png"']);
  });

  it('外部の URL、// で始まる URL、ページ内リンク、basePath そのものは対象外', () => {
    const html = [
      '<a href="https://github.com/t0k0shi">x</a>',
      '<a href="//cdn.example.com/a.js">x</a>',
      '<a href="#contributors">x</a>',
      '<a href="/git-training-ground">x</a>',
      '<a href="/git-training-ground#contributors">x</a>',
    ].join('');
    expect(findLinksWithoutBasePath(html, BASE)).toEqual([]);
  });

  it('basePath で始まるだけの別のパス（/git-training-groundX）は見逃さない', () => {
    expect(findLinksWithoutBasePath('<a href="/git-training-groundX/a">x</a>', BASE)).toEqual(['href="/git-training-groundX/a"']);
  });

  it('シングルクォートの属性も確かめる', () => {
    expect(findLinksWithoutBasePath("<a href='/tutorial'>x</a>", BASE)).toEqual(["href='/tutorial'"]);
  });
});

describe('CLI', () => {
  const script = path.resolve(__dirname, '../../scripts/check-base-path-links.mjs');
  const makeOut = (files: Record<string, string>) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'basepath-'));
    for (const [name, html] of Object.entries(files)) {
      fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
      fs.writeFileSync(path.join(dir, name), html);
    }
    return dir;
  };
  const run = (dir: string) =>
    spawnSync('node', [script, dir, BASE], { encoding: 'utf-8', env: { PATH: process.env.PATH ?? '' } });

  it('basePath のないリンクがあれば exit 1 で、ファイル名とリンクを出す', () => {
    const dir = makeOut({ 'index.html': '<a href="/tutorial">参加する</a>', 'tutorial.html': '<a href="/git-training-ground">ok</a>' });
    const r = run(dir);
    expect(r.status).toBe(1);
    expect(r.stdout).toContain('index.html');
    expect(r.stdout).toContain('href="/tutorial"');
  });

  it('すべて basePath 付きなら exit 0', () => {
    const dir = makeOut({ 'index.html': '<a href="/git-training-ground/tutorial">ok</a>', 'sub/page.html': '<img src="/git-training-ground/a.png">' });
    expect(run(dir).status).toBe(0);
  });

  it('引数が足りなければ exit 1', () => {
    expect(spawnSync('node', [script], { encoding: 'utf-8' }).status).toBe(1);
  });
});
