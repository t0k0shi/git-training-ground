# Tutorial ページ仕様書

## 概要

初心者がはじめてのPull Requestを作成するためのステップバイステップガイド。

## URL

`/tutorial`

## デザイン

- Tailwind CSSユーティリティクラスによるスタイリング
- カラーパレット: Primary `#2563EB` / Accent `#10B981` / BG `#F8FAFC` / Text `#1E293B` / Sub `#64748B`
- トップページと統一されたデザイン言語

## ページ構成

### 1. ヒーローエリア

- タイトル: 「はじめてのPRチュートリアル」
- サブコピー: ステップバイステップの案内文
- グラデーション背景、`pt-28` でヘッダー分のスペース確保

### 2. 前提条件セクション

| 項目 | 説明 |
|------|------|
| Git | インストール済みであること（`git --version` で確認） |
| GitHub アカウント | github.com で無料作成可能 |

### 3. ステップガイド（9ステップ）

各ステップは `StepGuide` コンポーネントで表示。番号バッジ（青丸）、白背景カード、接続線で構成。

| Step | タイトル | 内容 |
|------|---------|------|
| 1 | リポジトリをForkする | Forkの意味を補足 |
| 2 | ローカルにCloneする | git clone コマンド |
| 3 | ブランチを作成する | git checkout -b コマンド |
| 4 | contributors.jsonを編集する | フィールド説明テーブル付き |
| 5 | 変更をコミットする | git add + commit |
| 6 | リモートにプッシュする | git push |
| 7 | Pull Requestを作成する | タイトル・説明のヒント |
| 8 | CIチェックを待つ | チェック項目の説明 |
| 9 | マージを待つ | 完了メッセージ |

### 4. Step 4 フィールド説明

| フィールド | 説明 |
|-----------|------|
| name | あなたの名前（GitHub IDでもOK） |
| github | GitHubプロフィールURL |
| favoriteColor | 好きな色（16進数カラーコード） |
| favoriteEmoji | 好きな絵文字 |
| message | ひとことメッセージ |
| joinedAt | 今日の日付（YYYY-MM-DD形式） |
| prNumber | 0のまま（マージ時にメンテナーが更新） |

### 5. 完了セクション

- 「PRがマージされたら...」メッセージ
- トップページへのCTAボタン

### 6. FAQ（7問）

| Q | A |
|---|---|
| コンフリクトが起きた場合は？ | mainブランチから作り直し |
| CIチェックが失敗した場合は？ | エラーメッセージを確認して修正 |
| PRがマージされない場合は？ | レビューコメントを確認して修正 |
| Gitをインストールしていません | git-scm.com からダウンロード |
| GitHubアカウントが必要ですか？ | はい、github.comで無料作成 |
| Forkって何ですか？ | リポジトリの個人コピー |
| prNumberは何を書けばいいですか？ | 0のままでOK |

## コンポーネント構成

| コンポーネント | パス | 責務 |
|--------------|------|------|
| StepGuide | `components/tutorial/StepGuide.tsx` | ステップ表示（番号バッジ+カード+接続線） |
| CodeBlock | `components/tutorial/CodeBlock.tsx` | コード表示（ダークテーマ+コピーボタン） |
| FAQ | `components/tutorial/FAQ.tsx` | アコーディオンFAQ |

## テスト

| テストファイル | 種別 |
|--------------|------|
| `tests/unit/app/tutorial/page.test.tsx` | ページ統合テスト |
| `tests/unit/components/tutorial/StepGuide.test.tsx` | コンポーネント単体テスト |
| `tests/unit/components/tutorial/CodeBlock.test.tsx` | コンポーネント単体テスト |
| `tests/unit/components/tutorial/FAQ.test.tsx` | コンポーネント単体テスト |
| `tests/e2e/tutorial.spec.ts` | E2Eテスト（Playwright） |
