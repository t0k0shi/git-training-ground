# システム設計書: Git Training Ground

## 1. アーキテクチャ概要

```
┌─────────────────────────────────────────────────┐
│                   Vercel (Hosting)               │
│  ┌─────────────────────────────────────────────┐ │
│  │         Next.js 16 (SSG / Static Export)    │ │
│  │                                             │ │
│  │  app/                                       │ │
│  │    page.tsx ─────── Server Component        │ │
│  │    tutorial/page.tsx ─ Client Component      │ │
│  │    layout.tsx ────── Header + Footer         │ │
│  │                                             │ │
│  │  data/                                      │ │
│  │    contributors.json ── ビルド時に読込      │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│               GitHub Actions (CI)               │
│  validate-pr.yml                                │
│    → JSON Schema チェック                        │
│    → NGワードチェック                             │
│    → ユニットテスト (vitest)                      │
│    → ビルド確認                                  │
└─────────────────────────────────────────────────┘
```

## 2. 技術スタック

| レイヤー | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Next.js (App Router) | 16.1.6 |
| UI | React | 19.2.3 |
| スタイリング | Tailwind CSS | v4 |
| 言語 | TypeScript | 5.x |
| バリデーション | ajv (JSON Schema) | 8.x |
| テスト (単体) | vitest + Testing Library | 4.x |
| テスト (E2E) | Playwright | 1.58.x |
| ホスティング | Vercel | - |
| CI | GitHub Actions | - |

## 3. ディレクトリ構成

```
git-training-ground/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # 共通レイアウト (Header + Footer)
│   ├── page.tsx              # トップページ (Server Component)
│   └── tutorial/
│       └── page.tsx          # チュートリアルページ
├── components/
│   ├── common/               # 共通コンポーネント
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Tooltip.tsx
│   ├── home/                 # トップページ専用
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── EmojiGrid.tsx
│   │   ├── EmojiCard.tsx
│   │   ├── Statistics.tsx
│   │   └── FinalCTA.tsx
│   └── tutorial/             # チュートリアル専用
│       ├── StepGuide.tsx
│       ├── CodeBlock.tsx     # 'use client'
│       └── FAQ.tsx           # 'use client'
├── lib/                      # ユーティリティ
│   ├── types.ts              # 型定義
│   ├── contributors.ts       # データ読込・統計計算
│   └── validation.ts         # バリデーション関数
├── data/
│   └── contributors.json     # 貢献者データ (SSOT)
├── scripts/                  # CI用スクリプト
│   ├── validate-contributors.js
│   └── check-ng-words.js
├── tests/
│   ├── setup.ts              # vitest セットアップ
│   ├── unit/                 # ユニットテスト
│   └── e2e/                  # E2Eテスト (Playwright)
├── docs/
│   ├── specs/                # 仕様書
│   └── adr/                  # Architecture Decision Records
└── .github/
    └── workflows/
        └── validate-pr.yml   # PR バリデーション
```

## 4. レンダリング戦略

| ページ | 方式 | 理由 |
|--------|------|------|
| `/` | SSG (Static Export) | ビルド時にcontributors.jsonを読込 |
| `/tutorial` | SSG (Static Export) | 完全に静的コンテンツ |

`next.config.ts` で `output: "export"` を設定。全ページが `out/` に静的HTMLとして出力される。

## 5. コンポーネント設計方針

### Server / Client の使い分け

| 種別 | 基準 | 例 |
|------|------|-----|
| Server Component | データ取得、静的表示 | `app/page.tsx`, Hero, Features |
| Client Component | ユーザーインタラクション | CodeBlock (コピー), FAQ (アコーディオン) |

### Props設計

- データは上位（ページ）から下位（コンポーネント）へ props で渡す
- グローバルstate管理ライブラリは不使用
- 各コンポーネントのローカルstateは `useState` のみ

## 6. データモデル

### Contributor

```typescript
interface Contributor {
  name: string;            // 3-20文字、英数字+ハイフン+アンダースコア
  github: string;          // https://github.com/{username}
  favoriteColor: string;   // #XXXXXX（16進数6桁）
  favoriteEmoji: string;   // 絵文字（10文字以内）
  message?: string;        // 任意、50文字以内
  joinedAt: string;        // YYYY-MM-DD
  prNumber: number;        // PR番号（0=未マージ、1+=マージ済み）
}
```

### バリデーションルール

| フィールド | ルール | CI チェック |
|-----------|--------|------------|
| name | `/^[a-zA-Z0-9_-]{3,20}$/` | JSON Schema + validation.ts |
| github | `/^https:\/\/github\.com\/[a-zA-Z0-9_-]+$/` | JSON Schema + validation.ts |
| favoriteColor | `/^#[0-9A-Fa-f]{6}$/` | JSON Schema + validation.ts |
| favoriteEmoji | 1〜10文字 | JSON Schema + validation.ts |
| message | 任意、50文字以内 | JSON Schema + validation.ts |
| joinedAt | `/^\d{4}-\d{2}-\d{2}$/` | JSON Schema + validation.ts |
| prNumber | 0以上の整数 | JSON Schema + validation.ts |

### NGワードチェック

- 全角・半角を正規化してチェック
- `scripts/check-ng-words.js` で実行
- CIで自動実行

## 7. CI パイプライン

### validate-pr.yml（PR時）

```
PR作成/更新
  → checkout
  → npm ci
  → npm test (vitest)
  → node scripts/validate-contributors.js
  → node scripts/check-ng-words.js
  → npm run build
```

### Vercel（main push時）

```
main push
  → Vercel自動検知
  → npm run build (next build)
  → out/ を配信
```

## 8. テスト戦略

| レイヤー | ツール | 対象 | 実行タイミング |
|---------|--------|------|--------------|
| 単体テスト | vitest + Testing Library | コンポーネント、lib関数 | ローカル + CI |
| E2Eテスト | Playwright | ページ遷移、インタラクション | ローカル |
| スキーマ検証 | ajv | contributors.json | CI |
| NGワード | check-ng-words.js | contributors.json | CI |
