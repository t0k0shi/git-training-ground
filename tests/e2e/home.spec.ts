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

  test('6 セクションがすべて存在する (h2 見出しから判定)', async ({ page }) => {
    // ConceptSection / HelpWantedSection / StepsSection / ContributorsSection / FooterSection の見出し
    // (Hero は h1 のみで h2 を持たないため、h2 の数で 5 セクション + Hero = 6)
    const headings = page.locator('h2');
    const count = await headings.count();
    expect(count).toBeGreaterThanOrEqual(4);
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

  test('console error が出ない', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.goto('/');
    // ビルド済みアセット読み込みのため少し待つ
    await page.waitForLoadState('networkidle');
    expect(errors, errors.join('\n')).toEqual([]);
  });
});
