/**
 * チュートリアル画像（public/tutorial/*.png）の撮影スクリプト
 *
 * 実行:
 *   npm run capture:tutorial -- [--public-only | --login [--all]] [--no-mask] [--only <file>] [--out <dir>]
 *
 *   --public-only  ログイン不要の画像だけをヘッドレスで撮る（既定）
 *   --login        ブラウザを表示して起動し、GitHub へのログイン完了を待ってから
 *                  ログインが必要な画像を撮る。セッションは playwright/.auth/github に保存される
 *   --all          --login と併用。ログイン不要の画像もログイン状態で撮り直す
 *   --no-mask      アバター・アカウント名などのぼかしを無効にする
 *   --only <file>  指定した画像だけ撮る（繰り返し指定・カンマ区切り可。拡張子 .png は省略可）
 *   --out <dir>    出力先（既定: public/tutorial）
 *
 * 撮影定義は SHOTS 配列が唯一の情報源（SSOT）。ファイル名・alt は
 * app/tutorial/page.tsx と docs/tutorial-image-checklist.md に合わせる。
 *
 * 注意:
 *   - 認証情報はスクリプトに書かない。--login では人がブラウザでログインする。
 *   - Fork・撮影用ブランチは撮影者のアカウント上に作られる。PR は作成しない
 *     （"Create pull request" は絶対に押さない）。
 *   - GitHub の画面構造に依存するため、セレクタは複数の候補を持たせている。
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { pathToFileURL } from 'url';
import type { BrowserContext, Locator, Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// 定数
// ---------------------------------------------------------------------------

export const UPSTREAM_OWNER = 't0k0shi';
export const REPO_NAME = 'git-training-ground';
export const UPSTREAM_URL = `https://github.com/${UPSTREAM_OWNER}/${REPO_NAME}`;

export const VIEWPORT = { width: 1280, height: 800 } as const;
export const CLIP_WIDTH = 800;
export const CLIP_MIN_HEIGHT = 300;
export const CLIP_MAX_HEIGHT = 500;
/** 強調要素の上下に確保する余白（px） */
const CLIP_PADDING = 60;

const AUTH_DIR = 'playwright/.auth/github';
const LOGIN_WAIT_MS = 5 * 60 * 1000;
const ELEMENT_TIMEOUT_MS = 15_000;

const HIGHLIGHT_CLASS = 'gtg-capture-highlight';
const HIGHLIGHT_OVERLAY_ID = 'gtg-capture-highlight-overlay';
const MASK_CLASS = 'gtg-capture-mask';
const STYLE_ID = 'gtg-capture-style';

/**
 * 常にぼかす要素（CSS セレクタ）。--no-mask で無効化。
 * アバター画像とヘッダーのユーザーメニュー。
 */
export const MASK_SELECTORS: readonly string[] = [
  'img.avatar',
  'img[alt^="@"]',
  'img[data-testid="github-avatar"]',
  'img[src*="avatars.githubusercontent.com"]',
  '.AppHeader-user',
  'header button[aria-label*="user navigation" i]',
  'header [data-login]',
];

/** チュートリアル本文の「① 以下のコードをそのままコピー」の例（page.tsx から読めないときの予備） */
export const FALLBACK_TUTORIAL_SNIPPET = `  ,
  {
    "name": "あなたの名前",
    "github": "your-github-handle",
    "favoriteColor": "#FF5E5B",
    "favoriteEmoji": "🦊",
    "message": "よろしくです！",
    "joinedAt": "2026-04-24"
  }`;

// ---------------------------------------------------------------------------
// 型
// ---------------------------------------------------------------------------

export interface CliOptions {
  login: boolean;
  all: boolean;
  mask: boolean;
  only: string[];
  out: string;
  help: boolean;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 候補セレクタ。先頭から順に試し、最初に見えた要素を使う */
type Candidate = (page: Page) => Locator;

/** ログイン撮影フローの段階（順に進む） */
const STAGES = [
  'start',
  'fork-page',
  'forked',
  'editor-cursor',
  'editor-pasted',
  'commit-dialog',
  'new-branch-selected',
  'committed',
  'banner',
  'pr-page',
] as const;
type Stage = (typeof STAGES)[number];

interface CaptureContext {
  options: CliOptions;
  /** ログイン中のユーザー名（--login 時のみ） */
  login: string | null;
  stage: Stage;
  /** フローの途中で失敗したら以降のログイン撮影を止める */
  flowError: string | null;
  /** 貼り付けたエントリ（page.tsx の例と同じ） */
  snippet: string;
  branchName: string | null;
}

interface ShotDefinition {
  file: string;
  /** 参考: app/tutorial/page.tsx の alt */
  alt: string;
  requiresLogin: boolean;
  prepare: (page: Page, ctx: CaptureContext) => Promise<void>;
  /** 赤枠を付ける要素の候補 */
  highlight: Candidate[];
  /** 切り出しの基準にする要素の候補（省略時は highlight と同じ要素） */
  clipTarget?: Candidate[];
  /** この画像だけで追加するぼかし対象（CSS セレクタ） */
  mask?: string[];
  /** extendTop: 切り出し範囲を上に広げる量（px）。見出しやタブを一緒に写したいときに使う */
  clip?: { minHeight?: number; maxHeight?: number; extendTop?: number };
}

interface ShotResult {
  file: string;
  ok: boolean;
  detail: string;
}

class FlowStop extends Error {}

// ---------------------------------------------------------------------------
// 純粋関数（tests/unit/capture-tutorial-images.test.ts でテスト）
// ---------------------------------------------------------------------------

export function normalizeShotName(name: string): string {
  const trimmed = name.trim();
  return trimmed.endsWith('.png') ? trimmed.slice(0, -'.png'.length) : trimmed;
}

export function parseArgs(argv: readonly string[]): CliOptions {
  const options: CliOptions = { login: false, all: false, mask: true, only: [], out: 'public/tutorial', help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--public-only':
        options.login = false;
        break;
      case '--login':
        options.login = true;
        break;
      case '--all':
        options.all = true;
        break;
      case '--no-mask':
        options.mask = false;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--only':
      case '--out': {
        const value = argv[i + 1];
        if (value === undefined || value.startsWith('--')) {
          throw new Error(`${arg} には値が必要です`);
        }
        i++;
        if (arg === '--out') {
          options.out = value;
        } else {
          options.only.push(...value.split(',').map(normalizeShotName).filter((v) => v !== ''));
        }
        break;
      }
      default:
        throw new Error(`不明な引数です: ${arg}`);
    }
  }
  if (options.all && !options.login) {
    throw new Error('--all は --login と一緒に指定してください');
  }
  return options;
}

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

/**
 * 強調要素を中心に横 800px、縦 300〜500px で切り出す範囲を決める。
 * 要素が収まらない場合は、縦は上端、横は左端に合わせる。範囲は画面内に収める。
 */
export function computeClip(
  target: Rect,
  viewport: { width: number; height: number },
  limits: { minHeight?: number; maxHeight?: number } = {},
): Rect {
  const minHeight = limits.minHeight ?? CLIP_MIN_HEIGHT;
  const maxHeight = Math.min(limits.maxHeight ?? CLIP_MAX_HEIGHT, viewport.height);
  const width = Math.min(CLIP_WIDTH, viewport.width);
  const height = clamp(Math.round(target.height + CLIP_PADDING * 2), Math.min(minHeight, maxHeight), maxHeight);

  const centerX = target.x + target.width / 2;
  const centerY = target.y + target.height / 2;
  // 横長の要素（ファイル一覧の行など）は左端に合わせる。名前が左にあるため
  const idealX = target.width + 20 <= width ? centerX - width / 2 : target.x - 10;
  const x = clamp(Math.round(idealX), 0, viewport.width - width);

  const fits = target.height + 20 <= height;
  const idealY = fits ? centerY - height / 2 : target.y - 10;
  const y = clamp(Math.round(idealY), 0, viewport.height - height);

  return { x, y, width, height };
}

/**
 * app/tutorial/page.tsx から「① そのままコピー」のコード例を取り出す。
 * Windows の checkout では CRLF になり、そのまま挿入すると \r でも改行されて行が倍になるため LF にそろえる
 */
export function extractTutorialSnippet(pageSource: string): string | null {
  const match = pageSource.replace(/\r\n?/g, '\n').match(/<pre>\{`(\s*,\s*\n[\s\S]*?)`\}<\/pre>/);
  return match ? match[1] : null;
}

function loadTutorialSnippet(): string {
  try {
    const source = fs.readFileSync(path.resolve(process.cwd(), 'app/tutorial/page.tsx'), 'utf8');
    const snippet = extractTutorialSnippet(source);
    if (snippet) return snippet;
    console.warn('[warn] page.tsx からコード例を取り出せませんでした。予備の値を使います');
  } catch {
    console.warn('[warn] app/tutorial/page.tsx を読めませんでした。予備の値を使います');
  }
  return FALLBACK_TUTORIAL_SNIPPET;
}

// ---------------------------------------------------------------------------
// ページ操作ヘルパー
// ---------------------------------------------------------------------------

/** 候補を順に試し、最初に見えた要素を返す。どれも見つからなければ null */
async function findFirstVisible(
  page: Page,
  candidates: Candidate[],
  timeoutMs = ELEMENT_TIMEOUT_MS,
): Promise<Locator | null> {
  const deadline = Date.now() + timeoutMs;
  do {
    for (const candidate of candidates) {
      const locator = candidate(page);
      const count = await locator.count().catch(() => 0);
      for (let i = 0; i < count; i++) {
        const item = locator.nth(i);
        if (await item.isVisible().catch(() => false)) return item;
      }
    }
    await page.waitForTimeout(500);
  } while (Date.now() < deadline);
  return null;
}

async function requireVisible(page: Page, candidates: Candidate[], what: string, timeoutMs?: number): Promise<Locator> {
  const found = await findFirstVisible(page, candidates, timeoutMs);
  if (!found) {
    throw new FlowStop(
      `「${what}」が見つかりません（URL: ${page.url()}）。GitHub の画面が変わった可能性があります。` +
        'scripts/capture-tutorial-images.ts のセレクタ候補を見直してください',
    );
  }
  return found;
}

async function gotoAndSettle(page: Page, url: string): Promise<void> {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => undefined);
}

async function injectBaseStyle(page: Page, mask: boolean, extraMask: string[]): Promise<void> {
  const maskSelectors = mask ? [...MASK_SELECTORS, ...extraMask, `.${MASK_CLASS}`] : [];
  const css = [
    // 赤枠は対象要素と同じ位置に重ねた枠用 div に付ける。対象そのものに outline を付けると、
    // 祖先要素の overflow: hidden（ファイル一覧のテーブル等）で枠が欠けるため
    `#${HIGHLIGHT_OVERLAY_ID} { position: absolute; pointer-events: none; z-index: 2147483647;` +
      ' outline: 3px solid #e11d48; outline-offset: 2px; }',
    maskSelectors.length > 0 ? `${maskSelectors.join(',\n')} { filter: blur(6px) !important; }` : '',
    // カーソルの点滅で写らないことがないよう、点滅を止める（CodeMirror 6）
    '.cm-cursorLayer { animation: none !important; }',
    '.cm-cursor { border-left-width: 2px !important; }',
  ].join('\n');
  await page.evaluate(
    ({ id, text }) => {
      document.getElementById(id)?.remove();
      const style = document.createElement('style');
      style.id = id;
      style.textContent = text;
      document.head.appendChild(style);
    },
    { id: STYLE_ID, text: css },
  );
}

/** 撮影者のアカウント名（テキスト・入力欄の値）をぼかす */
async function maskAccountName(page: Page, login: string): Promise<void> {
  await page.evaluate(
    ({ name, maskClass }) => {
      const needle = name.toLowerCase();
      const skip = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'NOSCRIPT']);
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const targets: Text[] = [];
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const parent = node.parentElement;
        if (!parent || skip.has(parent.tagName) || parent.closest('.cm-editor')) continue;
        if ((node.textContent ?? '').toLowerCase().includes(needle)) targets.push(node as Text);
      }
      for (const text of targets) {
        const parent = text.parentElement;
        if (!parent) continue;
        // 短い要素（リンク・ラベル等）は要素ごとぼかす。長い文中の場合だけ span で包む
        // （React 管理下の DOM を壊さないよう、包んだ span は撮影後に unmaskWrapped で戻す）
        if ((parent.textContent ?? '').length <= name.length + 40) {
          parent.classList.add(maskClass);
        } else {
          const span = document.createElement('span');
          span.className = maskClass;
          span.dataset.gtgWrapped = '1';
          parent.insertBefore(span, text);
          span.appendChild(text);
        }
      }
      document.querySelectorAll('input').forEach((input) => {
        if (input.value.toLowerCase().includes(needle)) input.classList.add(maskClass);
      });
    },
    { name: login, maskClass: MASK_CLASS },
  );
}

async function capture(page: Page, shot: ShotDefinition, ctx: CaptureContext, outDir: string): Promise<string> {
  const highlight = await requireVisible(page, shot.highlight, `${shot.file} の強調対象`);
  const clipTarget = shot.clipTarget ? await requireVisible(page, shot.clipTarget, `${shot.file} の切り出し基準`) : highlight;

  await highlight.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'center' }));
  if (clipTarget !== highlight) {
    await clipTarget.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'center' }));
  }
  await page.waitForTimeout(300);

  await injectBaseStyle(page, ctx.options.mask, shot.mask ?? []);
  await highlight.evaluate(
    (el, { cls, overlayId }) => {
      el.classList.add(cls);
      const rect = el.getBoundingClientRect();
      const overlay = document.createElement('div');
      overlay.id = overlayId;
      overlay.style.left = `${rect.left + window.scrollX}px`;
      overlay.style.top = `${rect.top + window.scrollY}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      document.body.appendChild(overlay);
    },
    { cls: HIGHLIGHT_CLASS, overlayId: HIGHLIGHT_OVERLAY_ID },
  );
  if (ctx.options.mask) {
    if (ctx.login) await maskAccountName(page, ctx.login);
  }
  await page.waitForTimeout(200);

  const box = await clipTarget.boundingBox();
  if (!box) throw new Error('切り出し基準の位置を取得できませんでした');
  const extendTop = shot.clip?.extendTop ?? 0;
  const clip = computeClip({ ...box, y: box.y - extendTop, height: box.height + extendTop }, VIEWPORT, shot.clip);
  const filePath = path.join(outDir, `${shot.file}.png`);
  await page.screenshot({ path: filePath, clip, animations: 'disabled', caret: 'initial' });

  // 次の撮影・操作に影響しないよう強調とぼかしを外す
  await page
    .evaluate(
      ({ highlightClass, maskClass, styleId, overlayId }) => {
        document.getElementById(overlayId)?.remove();
        document.querySelectorAll('[data-gtg-wrapped]').forEach((span) => {
          while (span.firstChild) span.parentNode?.insertBefore(span.firstChild, span);
          span.remove();
        });
        document.querySelectorAll(`.${highlightClass}, .${maskClass}`).forEach((el) => {
          el.classList.remove(highlightClass, maskClass);
        });
        document.getElementById(styleId)?.remove();
      },
      { highlightClass: HIGHLIGHT_CLASS, maskClass: MASK_CLASS, styleId: STYLE_ID, overlayId: HIGHLIGHT_OVERLAY_ID },
    )
    .catch(() => undefined);
  return `${clip.width}x${clip.height}`;
}

// ---------------------------------------------------------------------------
// セレクタ候補（GitHub の画面変更に備えて複数持つ）
// ---------------------------------------------------------------------------

const sel = (css: string): Candidate => (page) => page.locator(css);

const FORK_BUTTON: Candidate[] = [
  sel('#fork-button'),
  sel('[data-testid="fork-button"]'),
  (page) => page.getByRole('link', { name: /^Fork\b/ }),
  (page) => page.getByRole('button', { name: /^Fork\b/ }),
  sel('a[href$="/fork"]'),
];

/** ファイル一覧で、指定したリンクを含む「アイコン + 名前」部分（無ければセル、行） */
function directoryEntry(linkCss: string, linkName: RegExp): Candidate[] {
  return [
    // 行全体より「アイコン + 名前」を囲むほうが押す場所が分かりやすい
    (page) =>
      page.locator('tr.react-directory-row .react-directory-filename-column').filter({ has: page.locator(linkCss) }),
    (page) => page.locator('tr.react-directory-row td').filter({ has: page.locator(linkCss) }),
    (page) => page.getByRole('row').getByRole('cell').filter({ has: page.getByRole('link', { name: linkName }) }),
    (page) => page.locator('tr.react-directory-row').filter({ has: page.locator(linkCss) }),
    (page) => page.getByRole('row').filter({ has: page.getByRole('link', { name: linkName }) }),
  ];
}

const DATA_FOLDER_ROW: Candidate[] = [
  ...directoryEntry('a[aria-label^="data,"]', /^data, \(Directory\)$/),
  (page) => page.getByRole('link', { name: /^data, \(Directory\)$/ }),
  sel('a[title="data"]'),
];

const CONTRIBUTORS_ROW: Candidate[] = [
  ...directoryEntry('a[aria-label^="contributors.json,"]', /^contributors\.json, \(File\)$/),
  (page) => page.getByRole('link', { name: /^contributors\.json, \(File\)$/ }),
  sel('a[title="contributors.json"]'),
];

const EDIT_PENCIL: Candidate[] = [
  sel('[data-testid="edit-button"]'),
  (page) => page.getByRole('button', { name: /^Edit (this )?file/i }),
  (page) => page.getByRole('link', { name: /^Edit (this )?file/i }),
  (page) => page.getByRole('button', { name: /Fork this repository and edit/i }),
  (page) => page.getByRole('link', { name: /Fork this repository and edit/i }),
  sel('a[href*="/edit/"][aria-label]'),
];

const CHECKS_LIST: Candidate[] = [
  sel('aside[aria-label="Check suites"]'),
  sel('.js-check-suites-sidebar'),
  sel('[data-testid="checks-sidebar"]'),
  (page) => page.getByRole('complementary', { name: /check/i }),
];

const CREATE_FORK_BUTTON: Candidate[] = [
  (page) => page.getByRole('button', { name: /^Create fork$/i }),
  sel('button[type="submit"]:has-text("Create fork")'),
];

const EDITOR_CONTENT: Candidate[] = [
  sel('.cm-editor .cm-content[contenteditable="true"]'),
  sel('.cm-content'),
  (page) => page.getByRole('textbox', { name: /editing|file content/i }),
];

// GitHub のエディタはカーソル行に .cm-activeLine を付けないことがある。その場合は、
// placeCursorAfterLastEntry() がカーソルを置く「最後のエントリの } の行」を対象にする
const ACTIVE_LINE: Candidate[] = [
  sel('.cm-editor .cm-activeLine'),
  (page) =>
    page
      .locator('.cm-editor .cm-line')
      .filter({ hasText: /^\s*\}\s*$/ })
      .last(),
];

const EDITOR_AREA: Candidate[] = [sel('.cm-editor'), sel('[data-testid="code-editor"]')];

const COMMIT_BUTTON: Candidate[] = [
  (page) => page.getByRole('button', { name: /^Commit changes/i }),
  (page) => page.getByRole('button', { name: /^Propose changes/i }),
  sel('button:has-text("Commit changes")'),
];

const COMMIT_DIALOG: Candidate[] = [
  (page) => page.getByRole('dialog').filter({ hasText: /commit changes|propose changes/i }),
  sel('[role="dialog"]'),
];

const NEW_BRANCH_RADIO: Candidate[] = [
  (page) => page.getByRole('dialog').getByRole('radio', { name: /new branch/i }),
  (page) => page.getByRole('radio', { name: /new branch/i }),
  (page) => page.getByLabel(/Create a new branch/i),
];

const NEW_BRANCH_OPTION: Candidate[] = [
  // ラジオボタンの選択肢全体（ラベル込み）を強調する
  (page) => page.getByRole('dialog').locator('label, div, li').filter({ has: page.getByRole('radio', { name: /new branch/i }) }).last(),
  ...NEW_BRANCH_RADIO,
];

const DIALOG_SUBMIT: Candidate[] = [
  (page) => page.getByRole('dialog').getByRole('button', { name: /^(Propose changes|Commit changes)$/i }),
  (page) => page.getByRole('dialog').locator('button[type="submit"]'),
];

const BRANCH_NAME_INPUT: Candidate[] = [
  (page) => page.getByRole('dialog').getByRole('textbox', { name: /branch/i }),
  (page) => page.getByRole('dialog').locator('input[type="text"]'),
];

const COMPARE_BANNER_BUTTON: Candidate[] = [
  (page) => page.getByRole('link', { name: /Compare & pull request/i }),
  (page) => page.getByRole('button', { name: /Compare & pull request/i }),
  sel('a:has-text("Compare & pull request")'),
];

const COMPARE_BANNER: Candidate[] = [
  (page) => page.locator('.flash, [class*="Banner"], [class*="banner"]').filter({ has: page.getByRole('link', { name: /Compare & pull request/i }) }).last(),
  ...COMPARE_BANNER_BUTTON,
];

const BASE_REPOSITORY: Candidate[] = [
  (page) => page.getByRole('button', { name: /base repository/i }),
  sel('summary[title^="base repository"]'),
  sel('details:has-text("base repository") summary'),
  sel('.range-editor'),
];

// ---------------------------------------------------------------------------
// ログイン撮影フロー
// ---------------------------------------------------------------------------

function forkUrl(ctx: CaptureContext): string {
  if (!ctx.login) throw new FlowStop('ログインユーザー名が取得できていません');
  return `https://github.com/${ctx.login}/${REPO_NAME}`;
}

async function readLogin(page: Page): Promise<string | null> {
  const content = await page
    .locator('meta[name="user-login"]')
    .getAttribute('content', { timeout: 2_000 })
    .catch(() => null);
  return content && content.trim() !== '' ? content.trim() : null;
}

async function waitForLogin(page: Page): Promise<string> {
  await gotoAndSettle(page, 'https://github.com/');
  let login = await readLogin(page);
  if (login) return login;

  await gotoAndSettle(page, 'https://github.com/login');
  console.log('');
  console.log('==================================================================');
  console.log(' 表示されたブラウザで GitHub にログインしてください（最大 5 分待ちます）');
  console.log(' 撮影用のサブアカウントを使ってください。パスワードはスクリプトに渡しません。');
  console.log('==================================================================');
  const deadline = Date.now() + LOGIN_WAIT_MS;
  while (Date.now() < deadline) {
    await page.waitForTimeout(2_000);
    login = await readLogin(page);
    if (login) return login;
  }
  throw new Error('5 分以内にログインが完了しませんでした。もう一度実行してください');
}

async function forkExists(page: Page, ctx: CaptureContext): Promise<boolean> {
  const response = await page.request.get(forkUrl(ctx));
  return response.ok();
}

/** 撮影フローを target の段階まで進める。既に進んでいれば何もしない */
async function advanceTo(page: Page, ctx: CaptureContext, target: Stage): Promise<void> {
  if (ctx.flowError) throw new FlowStop(`前の手順で止まったためスキップします: ${ctx.flowError}`);
  try {
    while (STAGES.indexOf(ctx.stage) < STAGES.indexOf(target)) {
      const next = STAGES[STAGES.indexOf(ctx.stage) + 1];
      await runTransition(page, ctx, next);
      ctx.stage = next;
    }
  } catch (error) {
    ctx.flowError = error instanceof Error ? error.message : String(error);
    throw error;
  }
}

async function runTransition(page: Page, ctx: CaptureContext, next: Stage): Promise<void> {
  switch (next) {
    case 'start':
      return;
    case 'fork-page': {
      await gotoAndSettle(page, `${UPSTREAM_URL}/fork`);
      if (await forkExists(page, ctx)) {
        console.log(`  [info] 既存の Fork（${forkUrl(ctx)}）を再利用します。Fork 画面はそのまま撮影します`);
      }
      return;
    }
    case 'forked': {
      if (await forkExists(page, ctx)) return;
      if (!page.url().includes('/fork')) await gotoAndSettle(page, `${UPSTREAM_URL}/fork`);
      const button = await requireVisible(page, CREATE_FORK_BUTTON, 'Create fork ボタン');
      await button.click();
      await page.waitForURL((url) => url.pathname.replace(/\/$/, '') === `/${ctx.login}/${REPO_NAME}`, {
        timeout: 120_000,
      });
      console.log(`  [info] Fork を作成しました: ${forkUrl(ctx)}`);
      return;
    }
    case 'editor-cursor': {
      await gotoAndSettle(page, `${forkUrl(ctx)}/edit/main/data/contributors.json`);
      const editor = await requireVisible(page, EDITOR_CONTENT, 'ファイル編集エディタ', 30_000);
      await editor.click();
      await placeCursorAfterLastEntry(page);
      return;
    }
    case 'editor-pasted': {
      // クリップボードを使わず、貼り付けと同じ文字列をそのまま挿入する（自動インデントの影響を避ける）
      await page.keyboard.insertText(ctx.snippet);
      return;
    }
    case 'commit-dialog': {
      const button = await requireVisible(page, COMMIT_BUTTON, 'Commit changes... ボタン');
      await button.click();
      await requireVisible(page, COMMIT_DIALOG, 'Commit ダイアログ');
      return;
    }
    case 'new-branch-selected': {
      const radio = await requireVisible(page, NEW_BRANCH_RADIO, '「Create a new branch」の選択肢');
      await radio.check();
      const input = await findFirstVisible(page, BRANCH_NAME_INPUT, 5_000);
      ctx.branchName = input ? await input.inputValue().catch(() => null) : null;
      return;
    }
    case 'committed': {
      const submit = await requireVisible(page, DIALOG_SUBMIT, 'ダイアログのコミットボタン');
      await submit.click();
      await page.waitForURL((url) => !url.pathname.includes('/edit/'), { timeout: 60_000 });
      console.log(`  [info] 撮影用ブランチにコミットしました${ctx.branchName ? `: ${ctx.branchName}` : ''}`);
      return;
    }
    case 'banner': {
      // チュートリアル本文（「必ず元のリポジトリ側から操作」）に合わせ、元リポジトリのトップを先に探す。
      // 出なければ Fork のトップも試す
      for (const url of [UPSTREAM_URL, forkUrl(ctx)]) {
        for (let attempt = 0; attempt < 3; attempt++) {
          await gotoAndSettle(page, url);
          if (await findFirstVisible(page, COMPARE_BANNER_BUTTON, 5_000)) return;
        }
      }
      throw new FlowStop('「Compare & pull request」バナーが表示されません。コミットが撮影用ブランチに入ったか確認してください');
    }
    case 'pr-page': {
      const button = await requireVisible(page, COMPARE_BANNER_BUTTON, 'Compare & pull request ボタン');
      await button.click();
      await page.waitForURL(/\/compare\//, { timeout: 60_000 });
      await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => undefined);
      // ここで止める。"Create pull request" は押さない
      return;
    }
  }
}

/** カーソルを最後のエントリの `}` の直後（`]` の直前）に置く */
async function placeCursorAfterLastEntry(page: Page): Promise<void> {
  const lineTexts = await page.locator('.cm-editor .cm-line').allTextContents();
  const closingIndex = lineTexts.map((t) => t.trim()).lastIndexOf(']');
  if (closingIndex < 1) throw new FlowStop('エディタ内に配列の終わり `]` が見つかりません');

  const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
  await page.keyboard.press(`${modifier}+End`);
  for (let i = 0; i < 5; i++) {
    if ((await cursorLineText(page)).trim() === ']') break;
    await page.keyboard.press('ArrowUp');
  }
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowLeft');
  const current = (await cursorLineText(page)).trim();
  if (current !== '}') {
    throw new FlowStop(`カーソルを最後のエントリの } の直後に置けませんでした（現在の行: "${current}"）`);
  }
}

/**
 * カーソルのある行の文字列を返す。.cm-activeLine は GitHub のエディタで付かないことがあるため、
 * CodeMirror がフォーカス中に同期しているブラウザの選択範囲から .cm-line をたどる
 */
async function cursorLineText(page: Page): Promise<string> {
  return page.evaluate(() => {
    const node = window.getSelection()?.focusNode;
    if (!node) return '';
    const element = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
    return element?.closest('.cm-line')?.textContent ?? '';
  });
}

// ---------------------------------------------------------------------------
// 撮影定義（SSOT）
// ---------------------------------------------------------------------------

async function latestMergedPrNumber(page: Page): Promise<number> {
  try {
    const out = execFileSync(
      'gh',
      ['pr', 'list', '-R', `${UPSTREAM_OWNER}/${REPO_NAME}`, '--state', 'merged', '--limit', '1', '--json', 'number'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
    const parsed = JSON.parse(out) as Array<{ number: number }>;
    if (parsed[0]?.number) return parsed[0].number;
  } catch {
    console.log('  [info] gh で PR を取得できないため、PR 一覧ページから探します');
  }
  await gotoAndSettle(page, `${UPSTREAM_URL}/pulls?q=is%3Apr+is%3Amerged+sort%3Acreated-desc`);
  const href = await page
    .locator(`a[href*="/${UPSTREAM_OWNER}/${REPO_NAME}/pull/"]`)
    .first()
    .getAttribute('href', { timeout: ELEMENT_TIMEOUT_MS });
  const number = Number(href?.match(/\/pull\/(\d+)/)?.[1]);
  if (!number) throw new Error('マージ済み PR が見つかりません');
  return number;
}

export const SHOTS: ShotDefinition[] = [
  {
    file: 'step1-fork-button',
    alt: 'リポジトリ右上の Fork ボタン',
    requiresLogin: false,
    prepare: (page) => gotoAndSettle(page, UPSTREAM_URL),
    highlight: FORK_BUTTON,
  },
  {
    file: 'step1-create-fork',
    alt: 'Create fork ボタンをクリック',
    requiresLogin: true,
    prepare: (page, ctx) => advanceTo(page, ctx, 'fork-page'),
    highlight: CREATE_FORK_BUTTON,
  },
  {
    file: 'step2-data-folder',
    alt: 'data フォルダを開く',
    requiresLogin: false,
    prepare: (page) => gotoAndSettle(page, UPSTREAM_URL),
    highlight: DATA_FOLDER_ROW,
  },
  {
    file: 'step2-contributors-json',
    alt: 'contributors.json を選択',
    requiresLogin: false,
    prepare: (page) => gotoAndSettle(page, `${UPSTREAM_URL}/tree/main/data`),
    highlight: CONTRIBUTORS_ROW,
  },
  {
    // ログアウト状態では鉛筆ボタンが表示されないため、ログイン撮影に回す
    file: 'step3-edit-pencil',
    alt: 'Edit this file の鉛筆アイコン',
    requiresLogin: true,
    prepare: (page) => gotoAndSettle(page, `${UPSTREAM_URL}/blob/main/data/contributors.json`),
    highlight: EDIT_PENCIL,
  },
  {
    file: 'step4-paste-position',
    alt: 'カーソル位置: 最後のエントリの } の直後',
    requiresLogin: true,
    prepare: (page, ctx) => advanceTo(page, ctx, 'editor-cursor'),
    highlight: ACTIVE_LINE,
    clipTarget: EDITOR_AREA,
  },
  {
    file: 'step4-after-paste',
    alt: '貼り付け後のエディタ',
    requiresLogin: true,
    prepare: (page, ctx) => advanceTo(page, ctx, 'editor-pasted'),
    highlight: EDITOR_AREA,
    // 撮影用エントリはチュートリアルの例と同じダミー値なのでぼかさない（見本として読めるようにする）
  },
  {
    file: 'step5-commit-button',
    alt: 'Commit changes... ボタン',
    requiresLogin: true,
    prepare: (page, ctx) => advanceTo(page, ctx, 'editor-pasted'),
    highlight: COMMIT_BUTTON,
  },
  {
    file: 'step5-new-branch',
    alt: '新しいブランチを作成する選択画面',
    requiresLogin: true,
    prepare: (page, ctx) => advanceTo(page, ctx, 'new-branch-selected'),
    highlight: NEW_BRANCH_OPTION,
    clipTarget: COMMIT_DIALOG,
  },
  {
    file: 'step6-compare-banner',
    alt: 'Compare & pull request バナー',
    requiresLogin: true,
    prepare: (page, ctx) => advanceTo(page, ctx, 'banner'),
    highlight: COMPARE_BANNER,
  },
  {
    file: 'step7-open-pr',
    alt: 'Open a pull request 画面（base の確認）',
    requiresLogin: true,
    prepare: (page, ctx) => advanceTo(page, ctx, 'pr-page'),
    highlight: BASE_REPOSITORY,
  },
  {
    file: 'step8-checks-tab',
    alt: 'CI チェックの実行画面',
    requiresLogin: false,
    prepare: async (page) => {
      const number = await latestMergedPrNumber(page);
      console.log(`  [info] マージ済み PR #${number} の Checks タブを撮影します`);
      await gotoAndSettle(page, `${UPSTREAM_URL}/pull/${number}/checks`);
    },
    highlight: CHECKS_LIST,
    // 「Checks」タブも一緒に写す
    clip: { extendTop: 110 },
  },
];

// ---------------------------------------------------------------------------
// 実行
// ---------------------------------------------------------------------------

export function selectShots(options: CliOptions, shots: readonly ShotDefinition[] = SHOTS): ShotDefinition[] {
  const known = new Set(shots.map((s) => s.file));
  const unknown = options.only.filter((name) => !known.has(name));
  if (unknown.length > 0) {
    throw new Error(`不明な画像名です: ${unknown.join(', ')}（指定できる名前: ${[...known].join(', ')}）`);
  }
  if (options.only.length > 0) {
    const picked = shots.filter((s) => options.only.includes(s.file));
    const needLogin = picked.filter((s) => s.requiresLogin && !options.login);
    if (needLogin.length > 0) {
      throw new Error(`次の画像はログインが必要です。--login を付けてください: ${needLogin.map((s) => s.file).join(', ')}`);
    }
    return picked;
  }
  if (!options.login) return shots.filter((s) => !s.requiresLogin);
  return options.all ? [...shots] : shots.filter((s) => s.requiresLogin);
}

function printHelp(): void {
  console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0]);
}

function printSummary(results: ShotResult[]): void {
  console.log('');
  console.log('撮影結果');
  console.log('----------------------------------------------------------------------');
  const width = Math.max(...results.map((r) => r.file.length), 4);
  for (const r of results) {
    console.log(`${r.ok ? 'OK  ' : 'FAIL'}  ${r.file.padEnd(width)}  ${r.detail}`);
  }
  const ok = results.filter((r) => r.ok).length;
  console.log('----------------------------------------------------------------------');
  console.log(`成功 ${ok} / ${results.length}`);
  if (ok > 0) {
    console.log('撮影後は全画像を目で見て、ぼかし漏れ（アバター・アカウント名）がないか確認してください。');
  }
}

async function main(): Promise<void> {
  let options: CliOptions;
  let shots: ShotDefinition[];
  try {
    options = parseArgs(process.argv.slice(2));
    if (options.help) {
      printHelp();
      return;
    }
    shots = selectShots(options);
  } catch (error) {
    console.error(`[error] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(2);
  }

  const outDir = path.resolve(process.cwd(), options.out);
  fs.mkdirSync(outDir, { recursive: true });

  const { chromium } = await import('@playwright/test');
  const contextOptions = {
    viewport: { ...VIEWPORT },
    deviceScaleFactor: 1,
    colorScheme: 'light' as const,
    locale: 'ja-JP',
  };

  let context: BrowserContext;
  let closeAll: () => Promise<void>;
  if (options.login) {
    fs.mkdirSync(path.resolve(process.cwd(), AUTH_DIR), { recursive: true });
    context = await chromium.launchPersistentContext(path.resolve(process.cwd(), AUTH_DIR), {
      ...contextOptions,
      headless: false,
    });
    closeAll = () => context.close();
  } else {
    const browser = await chromium.launch({ headless: true });
    context = await browser.newContext(contextOptions);
    closeAll = () => browser.close();
  }

  const page = context.pages()[0] ?? (await context.newPage());
  const ctx: CaptureContext = {
    options,
    login: null,
    stage: 'start',
    flowError: null,
    snippet: loadTutorialSnippet(),
    branchName: null,
  };

  const results: ShotResult[] = [];
  try {
    if (options.login) {
      ctx.login = await waitForLogin(page);
      console.log(`[info] ${ctx.login} としてログインしています`);
    }
    for (const shot of shots) {
      console.log(`[shot] ${shot.file}`);
      try {
        await shot.prepare(page, ctx);
        const size = await capture(page, shot, ctx, outDir);
        results.push({ file: shot.file, ok: true, detail: `${size} -> ${path.relative(process.cwd(), path.join(outDir, `${shot.file}.png`))}` });
      } catch (error) {
        const message = error instanceof Error ? error.message.split('\n')[0] : String(error);
        console.error(`  [fail] ${message}`);
        results.push({ file: shot.file, ok: false, detail: message });
      }
    }
  } finally {
    if (options.login && ctx.stage !== 'start') {
      console.log('');
      console.log('[info] PR は作成していません。撮影用の Fork・ブランチは不要になったら GitHub 上で削除してください。');
    }
    await closeAll();
  }

  printSummary(results);
  if (results.length > 0 && results.every((r) => !r.ok)) process.exit(1);
}

function isDirectlyExecuted(): boolean {
  const argv1 = process.argv[1];
  if (!argv1) return false;
  try {
    return import.meta.url === pathToFileURL(path.resolve(argv1)).href;
  } catch {
    return false;
  }
}

if (isDirectlyExecuted()) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
