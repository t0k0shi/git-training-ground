import { test, expect } from '@playwright/test';

test.describe('トップページ', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'あなたの初めてのPRを、ここで。' })).toBeVisible();
  });

  test('CTAボタンが /tutorial に遷移する', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/tutorial"]');
    await expect(page).toHaveURL(/\/tutorial/);
  });

  test('EmojiCard が表示される', async ({ page }) => {
    await page.goto('/');
    // 少なくとも1つの emoji-card が存在する
    const cards = page.locator('.emoji-card');
    await expect(cards.first()).toBeVisible();
  });

  test('HowItWorks セクションに3ステップが表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Fork してクローン' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '情報を追加' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'PR を作成' })).toBeVisible();
  });

  test('統計情報が表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('総貢献者数')).toBeVisible();
    await expect(page.getByText('今月のPR数')).toBeVisible();
  });
});
