import { test, expect } from '@playwright/test';

// Issue #22 対応: v4 チュートリアルページの E2E テスト
// app/tutorial/page.tsx は Step 1〜9 + FAQ 10 問 + 完了 CTA で構成される

test.describe('Tutorial page (v4)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tutorial');
  });

  test('H1 が表示される', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toContainText('はじめてのPRチュートリアル');
  });

  test('前提条件セクションが表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '必要なもの' })).toBeVisible();
    await expect(page.getByText('GitHub アカウント')).toBeVisible();
  });

  test('Step 1〜9 すべての見出しが表示される', async ({ page }) => {
    const expectedSteps: Array<{ n: number; title: string | RegExp }> = [
      { n: 1, title: 'リポジトリをForkする' },
      { n: 2, title: 'contributors.json を開く' },
      { n: 3, title: '編集モードに入る' },
      { n: 4, title: '自分のエントリを追加する' },
      { n: 5, title: '変更をコミットする' },
      { n: 6, title: '元のリポジトリからPull Requestを作成する' },
      { n: 7, title: 'PRの内容を確認して送信する' },
      { n: 8, title: 'CIチェックを待つ' },
      { n: 9, title: 'マージを待つ' },
    ];

    for (const step of expectedSteps) {
      const heading = page.getByRole('heading', { name: step.title });
      await heading.scrollIntoViewIfNeeded();
      await expect(heading, `Step ${step.n} (${step.title})`).toBeVisible();
    }
  });

  test('Step 番号バッジ (1〜9) が描画される', async ({ page }) => {
    // StepGuide コンポーネントが番号バッジを表示する。1〜9 の数字が見える
    for (let i = 1; i <= 9; i++) {
      const badge = page.getByText(new RegExp(`^${i}$`, 'm')).first();
      // バッジは複数候補があるので存在確認のみ
      const count = await page.getByText(new RegExp(`^\\s*${i}\\s*$`, 'm')).count();
      expect(count, `Step ${i} の番号バッジ存在`).toBeGreaterThan(0);
      void badge;
    }
  });

  test('完了 CTA セクションが表示される', async ({ page }) => {
    const completion = page.getByRole('heading', { name: 'PRがマージされたら...' });
    await completion.scrollIntoViewIfNeeded();
    await expect(completion).toBeVisible();
  });

  test('FAQ セクションが少なくとも 8 問表示される', async ({ page }) => {
    // FAQ に閉じた状態で表示される質問テキストを数える
    const knownQuestions = [
      'GitHubアカウントが必要ですか？',
      'Forkって何ですか？',
      'CIチェックが失敗した場合は？',
      'PRがマージされない場合は？',
      'コンフリクトが起きた場合は？',
      'コマンドラインでやりたい場合は？',
      'JSONの形式が不正',
      '他のエントリが削除されています',
    ];
    for (const q of knownQuestions) {
      const item = page.getByText(q).first();
      await item.scrollIntoViewIfNeeded();
      await expect(item, `FAQ "${q}"`).toBeVisible();
    }
  });

  test('FAQ アイテムをクリックすると展開される', async ({ page }) => {
    const firstQuestion = page.getByRole('button', { name: /GitHubアカウントが必要/ });
    await firstQuestion.scrollIntoViewIfNeeded();
    await expect(firstQuestion).toBeVisible();

    // 初期: aria-expanded=false (アコーディオン閉)
    await expect(firstQuestion).toHaveAttribute('aria-expanded', 'false');

    // クリックで展開
    await firstQuestion.click();
    await expect(firstQuestion).toHaveAttribute('aria-expanded', 'true');

    // 答えのテキストが見える
    await expect(page.getByText('github.com で無料アカウント')).toBeVisible();
  });

  test('チュートリアル画像 12 枚がすべて読み込まれる', async ({ page }) => {
    const images = page.locator('img[src*="/tutorial/"]');
    await expect(images).toHaveCount(12);

    for (const image of await images.all()) {
      const src = await image.getAttribute('src');
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), {
          message: `${src} が読み込まれていない`,
        })
        .toBe(true);
    }
  });

  test('console error と 404 が出ない', async ({ page }) => {
    // console error の text には URL が含まれないため、404 は response イベント側で URL ごと記録する
    const errors: string[] = [];
    const failedUrls: string[] = [];

    page.on('response', (resp) => {
      if (resp.status() === 404) failedUrls.push(`404: ${resp.url()}`);
    });

    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      // "Failed to load resource ... 404" は response イベント側で URL 付きで記録するため、ここでは除く
      if (/Failed to load resource.*404/i.test(text)) return;
      errors.push(text);
    });

    await page.goto('/tutorial');
    await page.waitForLoadState('networkidle');
    const allIssues = [...errors, ...failedUrls];
    expect(allIssues, allIssues.join('\n')).toEqual([]);
  });
});
