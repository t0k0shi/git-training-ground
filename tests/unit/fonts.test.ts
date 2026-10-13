import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// フォントはリポジトリに置いたものを使い、ビルド中に Google Fonts へ取りに行かない（ADR-0014）
const ROOT = path.resolve(__dirname, '../..');
const FONTS_DIR = path.join(ROOT, 'app/fonts');

function listSourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listSourceFiles(full);
    return /\.(tsx?|jsx?|mjs)$/.test(entry.name) ? [full] : [];
  });
}

describe('フォント', () => {
  it('next/font/google を import しているファイルがない（ビルドのたびに Google から取得してしまう）', () => {
    const offenders = ['app', 'components', 'lib']
      .flatMap((d) => listSourceFiles(path.join(ROOT, d)))
      .filter((file) => /from\s+['"]next\/font\/google['"]/.test(fs.readFileSync(file, 'utf-8')))
      .map((file) => path.relative(ROOT, file));
    expect(offenders).toEqual([]);
  });

  it('app/layout.tsx が app/fonts/fonts.css を読み込んでいる', () => {
    const layout = fs.readFileSync(path.join(ROOT, 'app/layout.tsx'), 'utf-8');
    expect(layout).toContain('import "./fonts/fonts.css";');
  });

  it('fonts.css が指すファイルがすべてあり、使われていないファイルもない', () => {
    const css = fs.readFileSync(path.join(FONTS_DIR, 'fonts.css'), 'utf-8');
    const referenced = new Set([...css.matchAll(/url\(\.\/files\/([^)]+)\)/g)].map((m) => m[1]));
    const present = new Set(fs.readdirSync(path.join(FONTS_DIR, 'files')));
    expect(referenced.size).toBeGreaterThan(0);
    expect([...referenced].filter((f) => !present.has(f))).toEqual([]);
    expect([...present].filter((f) => !referenced.has(f))).toEqual([]);
  });

  it('外部の URL を指す @font-face がない', () => {
    const css = fs.readFileSync(path.join(FONTS_DIR, 'fonts.css'), 'utf-8');
    expect(css).not.toMatch(/url\(\s*['"]?https?:/);
  });

  it('3 つのフォントの OFL ライセンスを置いている（再配布の条件）', () => {
    for (const name of ['noto-sans-jp', 'inter', 'jetbrains-mono']) {
      const text = fs.readFileSync(path.join(FONTS_DIR, 'licenses', `${name}-OFL.txt`), 'utf-8');
      expect(text, name).toContain('SIL Open Font License');
    }
  });
});
