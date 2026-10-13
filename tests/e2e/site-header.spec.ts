import { test, expect } from '@playwright/test';

// 全ページ共通のヘッダー（docs: LAM nav-header.md の T3〜T5）

test.describe('Site header', () => {
  test('T3: チュートリアルにヘッダーがあり、ロゴからトップに戻れる', async ({ page }) => {
    await page.goto('/tutorial');
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: 'チュートリアル' })).toHaveAttribute('aria-current', 'page');
    await nav.getByRole('link', { name: 'git-training-ground' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('h1').first()).toContainText('はじめての PR を、');
  });

  test('T4: チュートリアルの「参加者」からトップの参加者の一覧に移動できる', async ({ page }) => {
    await page.goto('/tutorial');
    await page.getByRole('navigation').getByRole('link', { name: '参加者' }).click();
    await expect(page).toHaveURL(/\/#contributors$/);
    await expect(page.getByRole('heading', { name: /一緒に練習中の \d+ 人/ })).toBeInViewport();
  });

  test('トップにいるときも、ヘッダーの「参加者」で参加者の一覧に移動する（何度押しても動く）', async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { name: /一緒に練習中の \d+ 人/ });
    const link = page.getByRole('navigation').getByRole('link', { name: '参加者' });
    await link.click();
    await expect(page).toHaveURL(/\/#contributors$/);
    await expect(heading).toBeInViewport();

    // URL がすでに #contributors のまま、上に戻ってもう一度押す
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(heading).not.toBeInViewport();
    await link.click();
    await expect(heading).toBeInViewport();
  });

  for (const path of ['/', '/tutorial']) {
    test(`T5: スマホの幅（375px）の ${path} で、3 つのリンクが表示され、横にはみ出さない`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 800 });
      await page.goto(path);
      const nav = page.getByRole('navigation');
      for (const name of ['チュートリアル', '参加者', 'Repo']) {
        const link = nav.getByRole('link', { name });
        await expect(link).toBeVisible();
        const box = await link.boundingBox();
        expect(box, name).not.toBeNull();
        expect(box!.x + box!.width, `${name} が画面の右端からはみ出している`).toBeLessThanOrEqual(375);
      }
    });
  }

  test('NFR-2: チュートリアルの H1 がヘッダーに隠れない', async ({ page }) => {
    await page.goto('/tutorial');
    const navBox = await page.getByRole('navigation').boundingBox();
    const h1Box = await page.locator('h1').boundingBox();
    expect(h1Box!.y).toBeGreaterThanOrEqual(navBox!.y + navBox!.height);
  });
});
