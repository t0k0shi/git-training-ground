# Git Training Ground 🎯

はじめてのPull Requestを安全に練習できる場所。

## インスパイア元

このプロジェクトは [first-contributions-ja](https://first-contributions-ja.github.io/) にインスパイアされて作りました。

## 特徴

- **シンプル**: `contributors.json` に自分のエントリを 1 つ追加するだけ
- **初心者向け**: ステップバイステップのチュートリアル
- **自動チェック**: CI が JSON 形式・必須フィールドを検証
- **達成感**: マージされるとトップページにあなたのカード（名前・アバター・メッセージ）が表示される

## やり方

1. このリポジトリを Fork
2. `data/contributors.json` を開く
3. 配列の最後に自分のエントリを追加
4. Pull Request を作成

```json
[
  {
    "name": "ketts",
    "github": "t0k0shi",
    "favoriteColor": "#E63946",
    "favoriteEmoji": "🚀",
    "message": "はじめてのOSS貢献！",
    "joinedAt": "2026-04-24"
  },
  {
    "name": "あなたの名前",
    "github": "your-github-handle",
    "favoriteColor": "#FF5E5B",
    "favoriteEmoji": "🦊",
    "message": "よろしくです！",
    "joinedAt": "2026-04-24"
  }
]
```

### 各フィールドの意味

| フィールド | 説明 | 例 |
|---|---|---|
| `name` | 表示名 | `"ketts"` |
| `github` | GitHub ハンドル | `"t0k0shi"` |
| `favoriteColor` | カードのボーダー色（`#RRGGBB`）| `"#E63946"` |
| `favoriteEmoji` | 絵文字 1 文字 | `"🚀"` |
| `message` | 1 行自己紹介 | `"よろしくです！"` |
| `joinedAt` | 参加日（`YYYY-MM-DD`）| `"2026-04-24"` |

詳しくは [チュートリアル](https://t0k0shi.github.io/git-training-ground/tutorial) を参照。

## 技術スタック

- [Next.js 15](https://nextjs.org/) - App Router / Static Export
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [GitHub Pages](https://pages.github.com/) - 自動デプロイ

## 開発

```bash
npm install
npm run dev      # 開発サーバー起動
npm run build    # ビルド
npm test         # ユニットテスト
```

### contributors.json のローカル検証

```bash
npx tsx scripts/validate-contributors.ts
```

## ライセンス

[MIT](LICENSE)
