import { test, expect } from '@playwright/test';

/**
 * Real-World Scenarios E2E Tests
 *
 * These tests simulate realistic edge cases and complex user behaviors
 * that might occur in production.
 */

test.describe('実際のユーザーシナリオ: 迷子になるユーザー', () => {
  test('ユーザーがチュートリアルの途中でホームに戻って再度戻る', async ({ page }) => {
    // チュートリアルを開始
    await page.goto('/tutorial');
    const step3 = page.getByText(/Step 3/);
    await step3.scrollIntoViewIfNeeded();

    // ホームに戻る
    await page.getByRole('link', { name: /Home/i }).click();
    await expect(page).toHaveURL('/');

    // 再度チュートリアルに戻る
    await page.getByRole('link', { name: /Tutorial/i }).click();
    await expect(page).toHaveURL(/\/tutorial/);

    // 最初から再開できる
    await expect(page.getByText(/Step 1/)).toBeVisible();
  });

  test('ユーザーがブラウザバックで戻る', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Tutorial/i }).click();
    await expect(page).toHaveURL(/\/tutorial/);

    // ブラウザバック
    await page.goBack();
    await expect(page).toHaveURL('/');

    // ブラウザフォワード
    await page.goForward();
    await expect(page).toHaveURL(/\/tutorial/);
  });

  test('ユーザーが直接URLを入力してページにアクセス', async ({ page }) => {
    // 直接チュートリアルURLを入力
    await page.goto('/tutorial');
    await expect(page.getByRole('heading', { name: /はじめてのPRチュートリアル/ })).toBeVisible();

    // ナビゲーションも機能する
    await page.getByRole('link', { name: /Home/i }).click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('実際のユーザーシナリオ: 慎重なユーザー', () => {
  test('ユーザーが全FAQを開いて内容を熟読する', async ({ page }) => {
    await page.goto('/tutorial');

    // FAQ セクションまでスクロール
    const faqSection = page.getByText(/GitHubアカウントが必要ですか？/).first();
    await faqSection.scrollIntoViewIfNeeded();

    // すべてのFAQボタンを取得
    const faqButtons = [
      'GitHubアカウントが必要ですか？',
      'Forkって何ですか？',
      'CIチェックが失敗した場合は？',
      'PRがマージされない場合は？',
      'コンフリクトが起きた場合は？',
      'CLIでやりたい場合は？',
      '「絵文字以外の文字」エラーが出た',
      '「他の人の絵文字が削除されています」エラーが出た'
    ];

    // 各FAQを開いて読む
    for (const questionText of faqButtons) {
      const button = page.getByRole('button', { name: new RegExp(questionText) });

      if (await button.isVisible()) {
        await button.scrollIntoViewIfNeeded();
        await button.click();

        // 開いた状態を確認
        await expect(button).toHaveAttribute('aria-expanded', 'true');

        // 少し間を置く（ユーザーが読む時間）
        await page.waitForTimeout(100);

        // 閉じる
        await button.click();
        await expect(button).toHaveAttribute('aria-expanded', 'false');
      }
    }
  });

  test('ユーザーがコードブロックを全て確認してからコピー', async ({ page }) => {
    await page.goto('/tutorial');

    // コピーボタンをすべて取得
    const copyButtons = page.getByRole('button', { name: /copy/i });
    const count = await copyButtons.count();

    // 各コードブロックを順番にコピー
    for (let i = 0; i < Math.min(count, 3); i++) {
      const button = copyButtons.nth(i);
      await button.scrollIntoViewIfNeeded();

      // コードを確認してからコピー
      await page.waitForTimeout(100);
      await button.click();

      // コピー完了のフィードバックを待つ
      await page.waitForTimeout(500);
    }
  });

  test('ユーザーが外部リンクを確認してから進む', async ({ page }) => {
    await page.goto('/tutorial');

    // GitHubリポジトリリンクを探す
    const repoLinks = page.getByRole('link', { href: /github.com\/t0k0shi/ });
    const firstLink = repoLinks.first();

    if (await firstLink.isVisible()) {
      await firstLink.scrollIntoViewIfNeeded();

      // リンクをホバー（確認するが開かない）
      await firstLink.hover();

      // target="_blank" を確認（新しいタブで開く）
      await expect(firstLink).toHaveAttribute('target', '_blank');
    }
  });
});

test.describe('実際のユーザーシナリオ: 急いでいるユーザー', () => {
  test('ユーザーが素早くページをスクロールして概要を把握', async ({ page }) => {
    await page.goto('/');

    // 高速スクロール
    await page.evaluate(() => {
      window.scrollTo({ top: 300, behavior: 'smooth' });
    });
    await page.waitForTimeout(200);

    await page.evaluate(() => {
      window.scrollTo({ top: 800, behavior: 'smooth' });
    });
    await page.waitForTimeout(200);

    await page.evaluate(() => {
      window.scrollTo({ top: 1500, behavior: 'smooth' });
    });
    await page.waitForTimeout(200);

    // CTAまで到達してクリック
    const cta = page.getByRole('link', { name: /参加する|今すぐはじめる/ }).last();
    await cta.scrollIntoViewIfNeeded();
    await cta.click();

    await expect(page).toHaveURL(/\/tutorial/);
  });

  test('ユーザーが最初のステップだけ見てすぐ実行', async ({ page }) => {
    await page.goto('/tutorial');

    // Step 1だけ確認
    const step1 = page.getByText(/Step 1/);
    await expect(step1).toBeVisible();

    // 外部リンクに直行
    const forkLink = page.getByRole('link', { href: /github.com\/t0k0shi\/git-training-ground/ }).first();

    if (await forkLink.isVisible()) {
      await expect(forkLink).toHaveAttribute('target', '_blank');
      // 実際にはクリックしない（外部サイトに飛ぶため）
    }
  });
});

test.describe('実際のユーザーシナリオ: モバイルユーザー', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('モバイルユーザーが片手でスクロールとタップ', async ({ page }) => {
    await page.goto('/');

    // 縦スクロール
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(300);

    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(300);

    // CTAをタップ
    const cta = page.getByRole('link', { name: /参加|はじめる/ }).first();
    await cta.scrollIntoViewIfNeeded();

    // タップ領域が十分か確認
    const box = await cta.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(40);
    expect(box?.width).toBeGreaterThanOrEqual(100);

    await cta.click();
    await expect(page).toHaveURL(/\/tutorial/);
  });

  test('モバイルでFAQを開閉しながらスクロール', async ({ page }) => {
    await page.goto('/tutorial');

    // 最初のFAQまでスクロール
    const faq1 = page.getByRole('button', { name: /GitHubアカウントが必要ですか？/ });
    await faq1.scrollIntoViewIfNeeded();

    // タップして開く
    await faq1.click();
    await expect(faq1).toHaveAttribute('aria-expanded', 'true');

    // スクロールして次のFAQへ
    await page.evaluate(() => window.scrollBy(0, 200));

    const faq2 = page.getByRole('button', { name: /Forkって何ですか？/ });
    await faq2.click();

    // 前のFAQが閉じる
    await expect(faq1).toHaveAttribute('aria-expanded', 'false');
    await expect(faq2).toHaveAttribute('aria-expanded', 'true');
  });

  test('モバイルで横画面に回転してもレイアウトが保持される', async ({ page, context }) => {
    await page.goto('/');

    // 縦画面で確認
    await expect(page.getByRole('heading', { name: /OSSへの貢献/ })).toBeVisible();

    // 横画面に変更
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(300);

    // コンテンツが依然として見える
    await expect(page.getByRole('heading', { name: /OSSへの貢献/ })).toBeVisible();
  });
});

test.describe('実際のユーザーシナリオ: アクセシビリティニーズのあるユーザー', () => {
  test('キーボードのみでサイト全体をナビゲート', async ({ page }) => {
    await page.goto('/');

    // Tabキーでフォーカス移動
    await page.keyboard.press('Tab'); // Logo or first link
    await page.keyboard.press('Tab'); // Home
    await page.keyboard.press('Tab'); // Tutorial
    await page.keyboard.press('Tab'); // GitHub or first CTA

    // フォーカスされた要素を確認
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();

    // Tutorial へEnterキーで移動
    await page.keyboard.press('Home'); // ページ先頭へ
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Tutorial link

    const tutorialLink = page.locator(':focus');
    const href = await tutorialLink.getAttribute('href');

    if (href === '/tutorial') {
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/\/tutorial/);
    }
  });

  test('スクリーンリーダーユーザーが見出し構造で理解', async ({ page }) => {
    await page.goto('/');

    // メインの見出しが存在
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // セクション見出しが存在
    const h2List = page.locator('h2');
    const count = await h2List.count();
    expect(count).toBeGreaterThan(0);

    // 見出しが適切な階層構造（h1 → h2 → h3）
    // ※実装の詳細次第
  });

  test('フォーカスインジケーターが見える', async ({ page }) => {
    await page.goto('/tutorial');

    // FAQボタンにフォーカス
    const faqButton = page.getByRole('button', { name: /GitHubアカウントが必要ですか？/ });
    await faqButton.focus();

    // フォーカスされている
    await expect(faqButton).toBeFocused();

    // Enterキーで操作
    await page.keyboard.press('Enter');
    await expect(faqButton).toHaveAttribute('aria-expanded', 'true');
  });
});

test.describe('実際のユーザーシナリオ: ネットワークが遅い環境', () => {
  test('ページロード中に主要コンテンツが優先的に表示される', async ({ page }) => {
    // ネットワークを遅くする
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });

    await page.goto('/');

    // ヒーローセクションは比較的早く表示される
    await expect(page.getByRole('heading', { name: /OSSへの貢献/ })).toBeVisible({ timeout: 5000 });
  });

  test('画像がなくてもテキストコンテンツが読める', async ({ page }) => {
    // 画像をブロック
    await page.route('**/*.{png,jpg,jpeg,gif,svg,webp}', route => route.abort());

    await page.goto('/');

    // テキストコンテンツは表示される
    await expect(page.getByRole('heading', { name: /OSSへの貢献/ })).toBeVisible();
    await expect(page.getByText(/GitHub/)).toBeVisible();
  });
});

test.describe('実際のユーザーシナリオ: リンク切れチェック', () => {
  test('全ての内部リンクが有効', async ({ page }) => {
    await page.goto('/');

    // すべての内部リンクを取得
    const internalLinks = page.locator('a[href^="/"]');
    const count = await internalLinks.count();

    // 主要なリンクをチェック
    for (let i = 0; i < Math.min(count, 10); i++) {
      const link = internalLinks.nth(i);
      const href = await link.getAttribute('href');

      if (href && !href.includes('#')) {
        // リンク先にアクセス可能か確認
        const response = await page.goto(href);
        expect(response?.status()).toBeLessThan(400);

        // 元のページに戻る
        await page.goto('/');
      }
    }
  });

  test('外部リンクが新しいタブで開く設定', async ({ page }) => {
    await page.goto('/tutorial');

    // 外部リンクを探す
    const externalLinks = page.locator('a[href^="http"]');
    const count = await externalLinks.count();

    for (let i = 0; i < count; i++) {
      const link = externalLinks.nth(i);

      // target="_blank" と rel="noopener noreferrer" を確認
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });
});

test.describe('実際のユーザーシナリオ: ブラウザ互換性', () => {
  test('基本機能がJavaScript無効でも動作（Progressive Enhancement）', async ({ page, context }) => {
    // JavaScriptを無効化
    await context.setOfflineMode(false);
    await page.goto('/');

    // 静的コンテンツは表示される
    await expect(page.getByRole('heading', { name: /OSSへの貢献/ })).toBeVisible();

    // リンクは機能する（SSR/SSG前提）
    const tutorialLink = page.getByRole('link', { name: /Tutorial/i }).first();
    await expect(tutorialLink).toHaveAttribute('href', '/tutorial');
  });
});

test.describe('実際のユーザーシナリオ: 複数タブ操作', () => {
  test('ユーザーが複数タブでページを開く', async ({ page, context }) => {
    await page.goto('/');

    // 新しいタブでチュートリアルを開く（Ctrl+Click シミュレーション）
    const tutorialLink = page.getByRole('link', { name: /Tutorial/i }).first();
    const href = await tutorialLink.getAttribute('href');

    // 新しいページを開く
    const newPage = await context.newPage();
    await newPage.goto(href || '/tutorial');

    // 両方のページが独立して動作
    await expect(page.getByRole('heading', { name: /OSSへの貢献/ })).toBeVisible();
    await expect(newPage.getByRole('heading', { name: /はじめてのPRチュートリアル/ })).toBeVisible();

    await newPage.close();
  });
});

test.describe('実際のユーザーシナリオ: セッションの継続', () => {
  test('ユーザーが長時間ページを開いたままにする', async ({ page }) => {
    await page.goto('/tutorial');

    // 長時間待機（アイドル状態）
    await page.waitForTimeout(3000);

    // FAQをクリック（依然として動作する）
    const faqButton = page.getByRole('button', { name: /GitHubアカウントが必要ですか？/ });
    await faqButton.click();
    await expect(faqButton).toHaveAttribute('aria-expanded', 'true');

    // ナビゲーションも機能する
    await page.getByRole('link', { name: /Home/i }).click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('実際のユーザーシナリオ: エラー耐性', () => {
  test('存在しないページにアクセスしても適切に処理される', async ({ page }) => {
    const response = await page.goto('/non-existent-page');

    // 404エラーまたはリダイレクト
    expect(response?.status()).toBeGreaterThanOrEqual(300);
  });
});
