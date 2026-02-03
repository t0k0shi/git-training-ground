import { test, expect } from '@playwright/test';

test.describe('チュートリアルページ', () => {
  test('ページが正常に表示される', async ({ page }) => {
    await page.goto('/tutorial');
    await expect(page.getByRole('heading', { name: 'はじめてのPRチュートリアル' })).toBeVisible();
  });

  test('9つのステップが表示される', async ({ page }) => {
    await page.goto('/tutorial');
    for (let i = 1; i <= 9; i++) {
      await expect(page.getByText(`Step ${i}`)).toBeVisible();
    }
  });

  test('FAQアコーディオンが開閉する', async ({ page }) => {
    await page.goto('/tutorial');
    const question = page.getByText('コンフリクトが起きた場合は？');
    await question.click();
    await expect(page.getByText('最新のmainブランチから')).toBeVisible();
    await question.click();
    await expect(page.getByText('最新のmainブランチから')).not.toBeVisible();
  });

  test('コードブロックにコピーボタンがある', async ({ page }) => {
    await page.goto('/tutorial');
    const copyButtons = page.locator('button').filter({ hasText: 'Copy' });
    await expect(copyButtons.first()).toBeVisible();
  });
});
