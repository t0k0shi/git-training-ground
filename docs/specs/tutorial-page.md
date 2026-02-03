# Tutorial ページ仕様書

## 概要

初心者がはじめてのPull Requestを作成するためのステップバイステップガイド。
**Web UI版をメイン**とし、CLIは補足として折りたたみで提供。

## URL

`/tutorial`

## デザイン

- Tailwind CSSユーティリティクラスによるスタイリング
- カラーパレット: Primary `#2563EB` / Accent `#10B981` / BG `#F8FAFC` / Text `#1E293B` / Sub `#64748B`
- トップページと統一されたデザイン言語

## ページ構成

### 1. ヒーローエリア

- タイトル: 「はじめてのPRチュートリアル」
- サブコピー: 「ブラウザだけで完結！Gitのインストール不要」
- グラデーション背景、`pt-28` でヘッダー分のスペース確保

### 2. 前提条件セクション

| 項目 | 説明 |
|------|------|
| GitHub アカウント | github.com で無料作成可能 |
| ブラウザ | これを読んでいるなら準備OK |

※ Gitのインストールは不要

### 3. ステップガイド（8ステップ・Web UI版）

各ステップは `StepGuide` コンポーネントで表示。番号バッジ（青丸）、白背景カード、接続線で構成。

| Step | タイトル | 内容 |
|------|---------|------|
| 1 | リポジトリをForkする | Forkの意味、リポジトリへのリンク |
| 2 | contributors.json を開く | ファイルパスの案内 |
| 3 | 編集モードに入る | 鉛筆アイコンの説明 |
| 4 | 自分の情報を追加する | フィールド説明テーブル付き |
| 5 | 変更をコミットする | Commit changes ボタン、ブランチ作成の選択 |
| 6 | Pull Requestを作成する | タイトル・説明のヒント |
| 7 | CIチェックを待つ | チェック項目の説明 |
| 8 | マージを待つ | 完了メッセージ |

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

### 6. CLI版への案内

- `<details>` で折りたたみ
- clone, branch, commit, push の流れを簡潔に記載

### 7. FAQ（7問）

| Q | A |
|---|---|
| GitHubアカウントが必要ですか？ | はい、github.comで無料作成 |
| Forkって何ですか？ | リポジトリの個人コピー |
| CIチェックが失敗した場合は？ | エラーメッセージを確認して修正 |
| PRがマージされない場合は？ | レビューコメントを確認して修正 |
| prNumberは何を書けばいいですか？ | 0のままでOK |
| コンフリクトが起きた場合は？ | Forkを最新に同期してから再編集 |
| CLIでやりたい場合は？ | チュートリアル下部を参照 |

## コンポーネント構成

| コンポーネント | パス | 責務 |
|--------------|------|------|
| StepGuide | `components/tutorial/StepGuide.tsx` | ステップ表示（番号バッジ+カード+接続線） |
| FAQ | `components/tutorial/FAQ.tsx` | アコーディオンFAQ |

※ CodeBlock は Web UI 版では使用しない（CLI版のみ `<code>` タグで対応）

## テスト

| テストファイル | 種別 |
|--------------|------|
| `tests/unit/app/tutorial/page.test.tsx` | ページ統合テスト |
| `tests/unit/components/tutorial/StepGuide.test.tsx` | コンポーネント単体テスト |
| `tests/unit/components/tutorial/FAQ.test.tsx` | コンポーネント単体テスト |
| `tests/e2e/tutorial.spec.ts` | E2Eテスト（Playwright） |
