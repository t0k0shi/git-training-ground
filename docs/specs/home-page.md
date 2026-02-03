# トップページ仕様書

## 概要

Git Training Ground のランディングページ。プロジェクトの紹介と貢献者一覧を表示する。

## URL

`/`

## レンダリング

- サーバーコンポーネント（async）
- SSGビルド時に `data/contributors.json` を読み込み、静的HTMLを生成

## デザイン

- Tailwind CSS v4
- カラーパレット: Primary `#2563EB` / Accent `#10B981` / BG `#F8FAFC` / Text `#1E293B` / Sub `#64748B`

## ページ構成

### 1. Hero セクション

| 要素 | 内容 |
|------|------|
| タイトル | プロジェクト名・キャッチコピー |
| サブコピー | プロジェクト概要 |
| CTAボタン | チュートリアルページへ遷移 |
| 背景 | グラデーション |

### 2. Features セクション

3カラムグリッドで特徴を紹介。

| カード | 内容 |
|--------|------|
| 1 | 安全な練習環境 |
| 2 | ステップバイステップガイド |
| 3 | コミュニティ |

### 3. HowItWorks セクション

3ステップで使い方を説明。

### 4. 貢献者セクション

| 要素 | 内容 |
|------|------|
| EmojiGrid | 貢献者カードのグリッド表示 |
| EmojiCard | favoriteEmoji + favoriteColor のカード |
| Tooltip | ホバーで name, message を表示 |
| Statistics | 総貢献者数、今月のPR数 |

### 5. FinalCTA セクション

チュートリアルへの最終導線。

## コンポーネント構成

| コンポーネント | パス | Props |
|--------------|------|-------|
| Hero | `components/home/Hero.tsx` | なし |
| Features | `components/home/Features.tsx` | なし |
| HowItWorks | `components/home/HowItWorks.tsx` | なし |
| EmojiGrid | `components/home/EmojiGrid.tsx` | `contributors: Contributor[]` |
| EmojiCard | `components/home/EmojiCard.tsx` | `contributor: Contributor` |
| Statistics | `components/home/Statistics.tsx` | `stats: Statistics` |
| FinalCTA | `components/home/FinalCTA.tsx` | なし |

## データフロー

```
data/contributors.json
  → lib/contributors.ts (getContributors, calculateStatistics)
  → app/page.tsx (Server Component)
  → EmojiGrid, Statistics に props で渡す
```

## テスト

| テストファイル | 種別 |
|--------------|------|
| `tests/unit/components/home/Hero.test.tsx` | 単体テスト |
| `tests/unit/components/home/Features.test.tsx` | 単体テスト |
| `tests/unit/components/home/HowItWorks.test.tsx` | 単体テスト |
| `tests/unit/components/home/EmojiCard.test.tsx` | 単体テスト |
| `tests/unit/components/home/EmojiGrid.test.tsx` | 単体テスト |
| `tests/unit/components/home/Statistics.test.tsx` | 単体テスト |
| `tests/unit/components/home/FinalCTA.test.tsx` | 単体テスト |
| `tests/e2e/home.spec.ts` | E2Eテスト |
