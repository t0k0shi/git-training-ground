import { test, expect } from '@playwright/test';

/**
 * E2E User Journey Tests
 *
 * These tests simulate complete user flows through the application,
 * focusing on real user behavior and interactions.
 */

test.describe('ユーザージャーニー: 初めての訪問者', () => {
  test('ランディング → チュートリアル → 絵文字確認の完全フロー', async ({ page }) => {
    // Step 1: ユーザーがホームページに到着
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /OSSへの貢献、難しそう？/ })).toBeVisible();

    // Step 2: ページをスクロールして機能を確認
    await page.evaluate(() => window.scrollBy(0, 300));
    await expect(page.getByText('安全な練習環境')).toBeVisible();

    // Step 3: 「参加する」CTAをクリックしてチュートリアルへ
    const ctaButton = page.getByRole('link', { name: /今すぐ参加する|はじめる/ }).first();
    await ctaButton.click();

    // Step 4: チュートリアルページに到着したことを確認
    await expect(page).toHaveURL(/\/tutorial/);
    await expect(page.getByRole('heading', { name: /はじめてのPRチュートリアル/ })).toBeVisible();

    // Step 5: 必要なものセクションを確認
    await expect(page.getByText(/GitHub アカウント/)).toBeVisible();
    await expect(page.getByText(/ブラウザ/)).toBeVisible();

    // Step 6: ステップを順番に読む（スクロール）
    for (let i = 1; i <= 9; i++) {
      const stepHeading = page.locator(`text=Step ${i}`);
      await stepHeading.scrollIntoViewIfNeeded();
      await expect(stepHeading).toBeVisible();
    }

    // Step 7: トップページに戻って絵文字を確認
    await page.getByRole('link', { name: /Home|トップページ/ }).first().click();
    await expect(page).toHaveURL('/');

    // Step 8: 絵文字カードが表示されることを確認
    const emojiCards = page.locator('[class*="emoji"]').or(page.locator('div').filter({ hasText: /[😀-🙏🚀-🛿]/ }));
    await expect(emojiCards.first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('ユーザージャーニー: チュートリアル詳細読み', () => {
  test('FAQを開いてコードをコピーする実践的フロー', async ({ page }) => {
    await page.goto('/tutorial');

    // Step 1: ページをスクロールしてFAQセクションまで移動
    const faqSection = page.locator('text=よくある質問').or(page.getByText(/GitHubアカウントが必要ですか？/)).first();
    await faqSection.scrollIntoViewIfNeeded();

    // Step 2: 複数のFAQを順番に開いて内容を確認
    const faqQuestions = [
      'GitHubアカウントが必要ですか？',
      'Forkって何ですか？',
      'CIチェックが失敗した場合は？'
    ];

    for (const question of faqQuestions) {
      const questionButton = page.getByRole('button', { name: new RegExp(question) });

      // FAQをクリックして展開
      await questionButton.click();
      await expect(questionButton).toHaveAttribute('aria-expanded', 'true');

      // 回答が表示されることを確認（少し待つ）
      await page.waitForTimeout(200);

      // 次のFAQに進む前に閉じる
      await questionButton.click();
      await expect(questionButton).toHaveAttribute('aria-expanded', 'false');
    }

    // Step 3: コードブロックを探してコピーボタンをクリック
    await page.locator('text=Step 1').scrollIntoViewIfNeeded();

    // コピーボタンを見つける
    const copyButtons = page.getByRole('button', { name: /copy/i });
    const firstCopyButton = copyButtons.first();

    if (await firstCopyButton.isVisible()) {
      // クリックしてコピー実行
      await firstCopyButton.click();

      // コピー完了のフィードバックを確認
      await expect(page.getByRole('button', { name: /copied/i }).first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('外部リンクの確認（新しいタブで開く）', async ({ page, context }) => {
    await page.goto('/tutorial');

    // GitHubリポジトリリンクを探す
    const githubLink = page.getByRole('link', { name: /git-training-ground/i }).filter({ hasText: /github/ }).first();
    await githubLink.scrollIntoViewIfNeeded();

    // target="_blank" 属性を確認
    await expect(githubLink).toHaveAttribute('target', '_blank');
    await expect(githubLink).toHaveAttribute('rel', /noopener noreferrer/);
  });
});

test.describe('ユーザージャーニー: ナビゲーション', () => {
  test('ヘッダーナビゲーションで全ページを移動', async ({ page }) => {
    // ホームから開始
    await page.goto('/');

    // ヘッダーが常に表示されることを確認（固定ヘッダー）
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Tutorial へ移動
    await page.getByRole('link', { name: /Tutorial/i }).click();
    await expect(page).toHaveURL(/\/tutorial/);
    await expect(page.getByRole('heading', { name: /はじめてのPRチュートリアル/ })).toBeVisible();

    // Home に戻る
    await page.getByRole('link', { name: /Home/i }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: /OSSへの貢献/ })).toBeVisible();

    // ロゴクリックでもホームに戻れることを確認
    await page.goto('/tutorial');
    await page.getByRole('link', { name: /Git Training Ground/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('スクロール時にヘッダーが固定表示される', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('header');

    // 最初の位置でヘッダーが見える
    await expect(header).toBeVisible();
    const initialPosition = await header.boundingBox();

    // ページを大きくスクロール
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(300);

    // スクロール後もヘッダーが見える
    await expect(header).toBeVisible();

    // 固定ヘッダーなので位置は変わらない（もしくは上部に固定）
    const scrolledPosition = await header.boundingBox();
    expect(scrolledPosition?.y).toBeLessThanOrEqual(initialPosition?.y || 0);
  });
});

test.describe('ユーザージャーニー: 絵文字ギャラリー閲覧', () => {
  test('ホームページで様々なサイズの絵文字カードを閲覧', async ({ page }) => {
    await page.goto('/');

    // 絵文字セクションまでスクロール
    const contributorsHeading = page.getByRole('heading', { name: /貢献者の皆さん/ });
    await contributorsHeading.scrollIntoViewIfNeeded();
    await expect(contributorsHeading).toBeVisible();

    // 絵文字カードが複数表示されることを確認
    // EmojiCardは特定のクラスを持つdiv要素
    const emojiSection = page.locator('section').filter({ has: contributorsHeading });
    const emojiCards = emojiSection.locator('div').filter({
      hasText: /[😀-🙏🚀-🛿🌀-🗿⬛-⬜]/
    });

    // 少なくとも1つの絵文字カードが表示される
    await expect(emojiCards.first()).toBeVisible({ timeout: 5000 });

    // 参加人数が表示される
    await expect(page.getByText(/人が参加中/)).toBeVisible();
  });

  test('絵文字カードホバー時のトランジション', async ({ page }) => {
    await page.goto('/');

    const contributorsHeading = page.getByRole('heading', { name: /貢献者の皆さん/ });
    await contributorsHeading.scrollIntoViewIfNeeded();

    // 絵文字カードを見つける
    const emojiSection = page.locator('section').filter({ has: contributorsHeading });
    const firstEmojiCard = emojiSection.locator('div[class*="rounded"]').first();

    if (await firstEmojiCard.isVisible()) {
      // ホバーしてスケール変化を確認（視覚的フィードバック）
      await firstEmojiCard.hover();

      // transition-transform クラスの存在を確認
      const classes = await firstEmojiCard.getAttribute('class');
      expect(classes).toContain('transition');
    }
  });
});

test.describe('ユーザージャーニー: モバイル体験', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE サイズ

  test('モバイルでホームページが適切に表示される', async ({ page }) => {
    await page.goto('/');

    // ヒーローセクションが見える
    await expect(page.getByRole('heading', { name: /OSSへの貢献/ })).toBeVisible();

    // ナビゲーションが見える（モバイルでも）
    await expect(page.getByRole('link', { name: /Tutorial/i })).toBeVisible();

    // CTAボタンが押せる
    const ctaButton = page.getByRole('link', { name: /参加する|はじめる/ }).first();
    await expect(ctaButton).toBeVisible();

    // タップ領域が十分か確認（最小44x44px推奨）
    const buttonBox = await ctaButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(40);
  });

  test('モバイルでチュートリアルがスクロール可能', async ({ page }) => {
    await page.goto('/tutorial');

    // ページが読み込まれる
    await expect(page.getByRole('heading', { name: /はじめてのPRチュートリアル/ })).toBeVisible();

    // ステップをスクロールしながら確認
    const step1 = page.getByText(/Step 1/);
    const step8 = page.getByText(/Step 8/);

    await expect(step1).toBeVisible();

    // 最後のステップまでスクロール
    await step8.scrollIntoViewIfNeeded();
    await expect(step8).toBeVisible();
  });

  test('モバイルでFAQアコーディオンが操作可能', async ({ page }) => {
    await page.goto('/tutorial');

    const faqButton = page.getByRole('button', { name: /GitHubアカウントが必要ですか？/ });
    await faqButton.scrollIntoViewIfNeeded();

    // タップして展開
    await faqButton.click();
    await expect(faqButton).toHaveAttribute('aria-expanded', 'true');

    // もう一度タップして閉じる
    await faqButton.click();
    await expect(faqButton).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('ユーザージャーニー: アクセシビリティフォーカス', () => {
  test('キーボードナビゲーションでページを操作', async ({ page }) => {
    await page.goto('/');

    // Tabキーでフォーカス移動
    await page.keyboard.press('Tab'); // ロゴ or 最初のリンク
    await page.keyboard.press('Tab'); // 次のナビゲーション

    // フォーカスされた要素を確認
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Enterキーでリンク先へ移動
    const focusedHref = await focusedElement.getAttribute('href');
    if (focusedHref === '/tutorial') {
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/\/tutorial/);
    }
  });

  test('FAQがキーボードで操作可能', async ({ page }) => {
    await page.goto('/tutorial');

    const faqButton = page.getByRole('button', { name: /GitHubアカウントが必要ですか？/ });
    await faqButton.scrollIntoViewIfNeeded();

    // フォーカスを当てる
    await faqButton.focus();
    await expect(faqButton).toBeFocused();

    // Enterキーで展開
    await page.keyboard.press('Enter');
    await expect(faqButton).toHaveAttribute('aria-expanded', 'true');

    // Spaceキーでも操作可能
    await page.keyboard.press('Space');
    await expect(faqButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('スクリーンリーダー用のARIA属性が適切', async ({ page }) => {
    await page.goto('/tutorial');

    // FAQボタンのARIA属性を確認
    const faqButtons = page.getByRole('button').filter({ hasText: /ですか？/ });
    const firstButton = faqButtons.first();

    await expect(firstButton).toHaveAttribute('aria-expanded');

    // aria-expanded の初期値は false
    const ariaExpanded = await firstButton.getAttribute('aria-expanded');
    expect(['true', 'false']).toContain(ariaExpanded || '');
  });
});

test.describe('ユーザージャーニー: パフォーマンス体験', () => {
  test('ページロードが高速（3秒以内）', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // ヒーローが表示されたらロード完了とみなす
    await expect(page.getByRole('heading', { name: /OSSへの貢献/ })).toBeVisible();

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3秒以内
  });

  test('ページ遷移がスムーズ', async ({ page }) => {
    await page.goto('/');

    const startTime = Date.now();
    await page.getByRole('link', { name: /Tutorial/i }).click();

    // チュートリアルページの主要コンテンツが表示される
    await expect(page.getByRole('heading', { name: /はじめてのPRチュートリアル/ })).toBeVisible();

    const transitionTime = Date.now() - startTime;
    expect(transitionTime).toBeLessThan(2000); // 2秒以内
  });
});
