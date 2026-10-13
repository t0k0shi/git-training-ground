import { test, expect } from '@playwright/test';

// Issue #22 対応: v4 トップページの E2E テスト
// app/page.tsx は 6 セクション (Hero / Concept / HelpWanted / Steps / Contributors / Footer) で構成される

test.describe('Home page (v4)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Hero の H1 が表示される', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('はじめての PR を、');
    await expect(h1).toContainText('安全に、楽しく。');
  });

  test('ナビゲーションのチュートリアルリンクから /tutorial に遷移できる', async ({ page }) => {
    const link = page.getByRole('link', { name: 'チュートリアル' });
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/tutorial\/?$/);
    await expect(page.locator('h1')).toContainText('はじめてのPRチュートリアル');
  });

  test('6 セクション中、h2 を持つ 4 セクションの見出しが存在する', async ({ page }) => {
    // 構成: Hero(h1) / Concept(h2) / HelpWanted(h2) / Steps(見出しなし) / Contributors(h2) / Footer(h2)
    // h2 を持つ 4 セクションを名前ベースで個別検証 (StepsSection には見出しがないので別途リスト経由で確認)
    const expectedH2Patterns: RegExp[] = [
      /Git に .*?カラダ.*?で慣れる/, // ConceptSection
      /contributors\.json を編集/,    // HelpWantedSection
      /一緒に練習中の \d+ 人/,        // ContributorsSection
      /DOMO・ARIGATO/,                 // FooterSection
    ];
    const allH2Text = await page.locator('h2').allTextContents();
    for (const pattern of expectedH2Patterns) {
      const matched = allH2Text.some((t) => pattern.test(t));
      expect(matched, `h2 に "${pattern}" を含む見出しがない (実際: ${JSON.stringify(allH2Text)})`).toBe(true);
    }
  });

  test('ContributorsSection のセグメントコントロールが切り替わる', async ({ page }) => {
    const filter = page.getByRole('group', { name: '参加者フィルター' });
    await filter.scrollIntoViewIfNeeded();
    await expect(filter).toBeVisible();

    const allBtn = filter.getByRole('button', { name: '全員' });
    const newBtn = filter.getByRole('button', { name: /今週の新顔/ });

    // 初期: 全員が pressed
    await expect(allBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(newBtn).toHaveAttribute('aria-pressed', 'false');

    // クリックで反転
    await newBtn.click();
    await expect(newBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(allBtn).toHaveAttribute('aria-pressed', 'false');

    // 戻す
    await allBtn.click();
    await expect(allBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('LiveCounter (人数) がカウンターを描画する', async ({ page }) => {
    // ContributorsSection に "一緒に練習中の N 人" の見出しがある
    const heading = page.getByRole('heading', { name: /一緒に練習中の \d+ 人/ });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
  });

  test('モバイル幅 (< 820px) でも H1 が表示される', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('サイトのアイコン（SVG・ICO・Apple 用）が head にあり、読み込める', async ({ page, request }) => {
    const selectors = [
      'link[rel="icon"][type="image/svg+xml"]',
      'link[rel="icon"][href*="favicon.ico"]',
      'link[rel="apple-touch-icon"]',
    ];
    for (const selector of selectors) {
      const href = await page.locator(selector).first().getAttribute('href');
      expect(href, `${selector} がない`).toBeTruthy();
      const res = await request.get(new URL(href!, page.url()).toString());
      expect(res.status(), `${href} が読み込めない`).toBe(200);
    }
  });

  test('フォントはサイト自身から配信され、Google Fonts に取りに行かない（ADR-0014）', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (req) => {
      if (/fonts\.(googleapis|gstatic)\.com/.test(req.url())) external.push(req.url());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // document.fonts.check() は、その名前のフォントが登録されていなくても true を返すため使わない。
    // 登録された FontFace のうち、実際に読み込まれたものがあるかを見る
    // Inter は Noto Sans JP の後ろの予備で、ページの文字によっては読み込まれないことがある。
    // そのため Inter は登録だけを確かめ、必ず使う 2 つは読み込まれたことまで確かめる
    const fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      const faces = Array.from(document.fonts);
      const name = (f: FontFace) => f.family.replace(/["']/g, '');
      return ['Noto Sans JP', 'Inter', 'JetBrains Mono'].map((family) => ({
        family,
        registered: faces.some((f) => name(f) === family),
        loaded: faces.some((f) => name(f) === family && f.status === 'loaded'),
      }));
    });
    const summary = JSON.stringify(fonts);
    expect(fonts.every((f) => f.registered), summary).toBe(true);
    expect(fonts.filter((f) => f.family !== 'Inter').every((f) => f.loaded), summary).toBe(true);
    expect(external).toEqual([]);
  });

  test('console error と 404 が出ない', async ({ page }) => {
    // Next.js Link の prefetch で tutorial ページの画像も取得されるため、画像の 404 も検出対象にする
    const errors: string[] = [];
    const failedUrls: string[] = [];

    page.on('response', (resp) => {
      if (resp.status() === 404) failedUrls.push(`404: ${resp.url()}`);
    });

    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      if (/Failed to load resource.*404/i.test(text)) return;
      errors.push(text);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const allIssues = [...errors, ...failedUrls];
    expect(allIssues, allIssues.join('\n')).toEqual([]);
  });
});
