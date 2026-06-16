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

  test('console error が出ない (画像 404 を除く)', async ({ page }) => {
    // Issue #23 (tutorial 画像 12 枚) が未対応のため、Next.js Link prefetch で
    // tutorial ページの画像へのアクセスが発生し画像 404 が出る。これは既知。
    // 画像以外 (JS/CSS/API) の 404 はエラーとして検出する。
    const errors: string[] = [];
    const non404FailedUrls: string[] = [];

    page.on('response', (resp) => {
      if (resp.status() !== 404) return;
      const url = resp.url();
      if (/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url)) return;
      non404FailedUrls.push(`404: ${url}`);
    });

    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      if (/Failed to load resource.*404/i.test(text)) return;
      errors.push(text);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const allIssues = [...errors, ...non404FailedUrls];
    expect(allIssues, allIssues.join('\n')).toEqual([]);
  });
});
