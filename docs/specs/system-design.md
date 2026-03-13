# システム設計書: Git Training Ground (v2)

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
│  │    emojis.txt ────── ビルド時に読込          │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│               GitHub Actions (CI)               │
│  validate-pr.yml                                │
│    → ファイルスコープチェック                     │
│    → 絵文字フォーマット検証 (validate-emojis.mjs) │
│    → 削除・変更保護                              │
│    → 追加行数制限                                │
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
│   │   └── Footer.tsx
│   ├── home/                 # トップページ専用
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── EmojiGrid.tsx
│   │   ├── EmojiCard.tsx
│   │   └── FinalCTA.tsx
│   └── tutorial/             # チュートリアル専用
│       ├── StepGuide.tsx
│       ├── CodeBlock.tsx     # 'use client'
│       └── FAQ.tsx           # 'use client'
├── lib/                      # ユーティリティ
│   ├── types.ts              # EmojiCard 型定義
│   └── contributors.ts       # parseEmojiLine(), getEmojis()
├── data/
│   └── emojis.txt            # 絵文字データ (SSOT)
├── scripts/                  # CI用スクリプト
│   └── validate-emojis.mjs   # 絵文字フォーマットバリデーション
├── tests/
│   ├── setup.ts              # vitest セットアップ
│   ├── unit/                 # ユニットテスト
│   ├── integration/          # インテグレーションテスト
│   └── e2e/                  # E2Eテスト (Playwright)
├── docs/
│   ├── specs/                # 仕様書
│   └── adr/                  # Architecture Decision Records
└── .github/
    └── workflows/
        └── validate-pr.yml   # PR バリデーション
```

## 4. データモデル (v2)

### EmojiCard

```typescript
interface EmojiCard {
  emoji: string;      // 単一絵文字
  size: 1 | 2 | 3;    // カードサイズ（絵文字の個数に対応）
}
```

### data/emojis.txt フォーマット

```
🚀          → { emoji: '🚀', size: 1 }
🎉🎉        → { emoji: '🎉', size: 2 }
🌟🌟🌟      → { emoji: '🌟', size: 3 }
```

## 5. データフロー

### ビルド時（SSG）

```
data/emojis.txt
  → lib/contributors.ts::getEmojis()
    → parseEmojiLine() で各行をパース
    → EmojiCard[] として返却
      → components/home/EmojiGrid.tsx
        → components/home/EmojiCard.tsx × N
```

### PR 時（CI: validate-pr.yml）

```
PR 作成/更新
  → checkout (fetch-depth: 0)
  → ファイルスコープチェック (emojis.txt 以外の変更検出)
  → setup Node.js 20
  → node scripts/validate-emojis.mjs
  → git diff で削除・変更検出
  → 追加行数制限チェック (最大1行)
  → npm ci → npm run build
```

## 6. validate-emojis.mjs 設計

### エクスポート関数

| 関数 | 引数 | 戻り値 |
|------|------|--------|
| `validateLine(line, lineNumber)` | 行文字列, 行番号 | `null` (OK) \| `ErrorObject` |
| `validateFile(content)` | ファイル全体の文字列 | `ErrorObject[]` |

### ErrorObject

```javascript
{
  line: number,       // 行番号
  content: string,    // 問題の行内容
  type: string,       // 'not-emoji' | 'too-many' | 'mixed-emoji'
  message: string     // 日本語のエラーメッセージ（初心者向け）
}
```

### 絵文字判定ロジック

1. `Intl.Segmenter` で grapheme cluster に分割
2. 各 grapheme が `\p{Extended_Pictographic}` を含むか判定
3. ZWJ 絵文字（👨‍👩‍👧）や肌色修飾子（👋🏽）に正しく対応

## 7. テスト戦略

| レイヤー | ツール | 対象 | 実行タイミング |
|---------|--------|------|--------------|
| 単体テスト | vitest + Testing Library | コンポーネント、lib関数、validate-emojis.mjs | ローカル + CI |
| インテグレーション | vitest + Testing Library | 複数コンポーネント連携 | ローカル |
| E2Eテスト | Playwright | ページ遷移、インタラクション | ローカル |
| CIバリデーション | validate-emojis.mjs | data/emojis.txt | CI (PR時) |
