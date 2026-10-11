import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  CLIP_MAX_HEIGHT,
  CLIP_MIN_HEIGHT,
  FALLBACK_TUTORIAL_SNIPPET,
  MASK_SELECTORS,
  SHOTS,
  VIEWPORT,
  computeClip,
  extractTutorialSnippet,
  parseArgs,
  selectShots,
} from '@/scripts/capture-tutorial-images';

describe('capture-tutorial-images: 撮影定義', () => {
  const pageSource = fs.readFileSync(path.resolve(__dirname, '../../app/tutorial/page.tsx'), 'utf8');

  it('12 枚の画像がそれぞれ 1 回ずつ定義されている', () => {
    const files = SHOTS.map((s) => s.file);
    expect(files).toHaveLength(12);
    expect(new Set(files).size).toBe(12);
  });

  it('ファイル名と alt が app/tutorial/page.tsx と一致する', () => {
    for (const shot of SHOTS) {
      expect(pageSource).toContain(`asset('/tutorial/${shot.file}.png')`);
      expect(pageSource).toContain(`alt="${shot.alt}"`);
    }
  });

  it('撮影用エントリは page.tsx のコード例と同じ', () => {
    expect(extractTutorialSnippet(pageSource)).toBe(FALLBACK_TUTORIAL_SNIPPET);
  });

  it('page.tsx が CRLF でも撮影用エントリは LF になる（Windows の checkout で行が倍になるのを防ぐ）', () => {
    const crlfSource = pageSource.replace(/\r?\n/g, '\r\n');
    expect(extractTutorialSnippet(crlfSource)).toBe(FALLBACK_TUTORIAL_SNIPPET);
  });

  it('撮影用エントリ（ダミー値）はぼかさない。ぼかしはアバター・ユーザーメニューが対象', () => {
    const afterPaste = SHOTS.find((s) => s.file === 'step4-after-paste');
    expect(afterPaste?.mask ?? []).toEqual([]);
    expect(MASK_SELECTORS.some((sel) => sel.includes('.cm-'))).toBe(false);
    expect(MASK_SELECTORS).toEqual(expect.arrayContaining(['img.avatar', 'img[alt^="@"]', '.AppHeader-user']));
  });

  it('step3-edit-pencil はログインが必要（ログアウト状態では鉛筆ボタンが出ない）', () => {
    expect(SHOTS.find((s) => s.file === 'step3-edit-pencil')?.requiresLogin).toBe(true);
  });
});

describe('capture-tutorial-images: parseArgs', () => {
  it('引数なしはログイン不要分のみ・ぼかしあり', () => {
    expect(parseArgs([])).toEqual({ login: false, all: false, mask: true, only: [], out: 'public/tutorial', help: false });
  });

  it('--only は繰り返し・カンマ区切り・拡張子付きを受け付ける', () => {
    const options = parseArgs(['--only', 'step1-fork-button.png,step2-data-folder', '--only', 'step8-checks-tab']);
    expect(options.only).toEqual(['step1-fork-button', 'step2-data-folder', 'step8-checks-tab']);
  });

  it('--login --no-mask --out を解釈する', () => {
    const options = parseArgs(['--login', '--no-mask', '--out', 'tmp/out']);
    expect(options).toMatchObject({ login: true, mask: false, out: 'tmp/out' });
  });

  it('値のない --only と不明な引数はエラー', () => {
    expect(() => parseArgs(['--only'])).toThrow();
    expect(() => parseArgs(['--only', '--login'])).toThrow();
    expect(() => parseArgs(['--unknown'])).toThrow();
  });

  it('--all は --login なしではエラー', () => {
    expect(() => parseArgs(['--all'])).toThrow();
  });
});

describe('capture-tutorial-images: selectShots', () => {
  it('既定はログイン不要の画像だけ', () => {
    const shots = selectShots(parseArgs([]));
    expect(shots.length).toBeGreaterThan(0);
    expect(shots.every((s) => !s.requiresLogin)).toBe(true);
  });

  it('--login はログインが必要な画像だけ、--login --all は全部', () => {
    expect(selectShots(parseArgs(['--login'])).every((s) => s.requiresLogin)).toBe(true);
    expect(selectShots(parseArgs(['--login', '--all']))).toHaveLength(12);
  });

  it('--only は指定した画像だけ', () => {
    expect(selectShots(parseArgs(['--only', 'step8-checks-tab'])).map((s) => s.file)).toEqual(['step8-checks-tab']);
  });

  it('不明な画像名、ログイン必要な画像の --login なし指定はエラー', () => {
    expect(() => selectShots(parseArgs(['--only', 'nope']))).toThrow(/不明な画像名/);
    expect(() => selectShots(parseArgs(['--only', 'step7-open-pr']))).toThrow(/--login/);
  });
});

describe('capture-tutorial-images: computeClip', () => {
  it('小さい要素は中心に横 800px・縦は最小 300px', () => {
    const clip = computeClip({ x: 600, y: 400, width: 80, height: 20 }, VIEWPORT);
    expect(clip).toEqual({ x: 240, y: 260, width: 800, height: CLIP_MIN_HEIGHT });
  });

  it('画面の端では画面内に収める', () => {
    const clip = computeClip({ x: 1200, y: 5, width: 60, height: 30 }, VIEWPORT);
    expect(clip.x).toBe(VIEWPORT.width - 800);
    expect(clip.y).toBe(0);
  });

  it('縦に長い要素は最大 500px で、要素の上端に合わせる', () => {
    const clip = computeClip({ x: 32, y: 300, width: 400, height: 700 }, VIEWPORT);
    expect(clip.height).toBe(CLIP_MAX_HEIGHT);
    expect(clip.y).toBe(290);
  });

  it('横に長い要素は左端に合わせる', () => {
    const clip = computeClip({ x: 32, y: 300, width: 1216, height: 40 }, VIEWPORT);
    expect(clip.x).toBe(22);
  });
});
