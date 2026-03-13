import { test, expect } from '@playwright/test';

test.describe('トップページ', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /OSSへの貢献、難しそう？/ })).toBeVisible();
  });

  test('CTAボタンが /tutorial に遷移する', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/tutorial"]');
    await expect(page).toHaveURL(/\/tutorial/);
  });

  test('HowItWorks セクションに3ステップが表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Fork してクローン' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '絵文字を追加' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'PR を作成' })).toBeVisible();
  });

  test('参加者数が表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/人が参加中/)).toBeVisible();
  });
});
