# Git Training Ground 🎯

はじめてのプルリクエストを、安全に練習できる場所です。

## 特徴

- **初心者向け**: PRの作成手順をステップバイステップで解説
- **自動バリデーション**: CIが自動で形式チェック
- **ビジュアル表示**: あなたの絵文字と色がサイトに表示されます

## クイックスタート

1. このリポジトリをFork
2. クローン: `git clone https://github.com/YOUR_USERNAME/git-training-ground.git`
3. ブランチ作成: `git checkout -b add-YOUR_NAME`
4. `data/contributors.json` に自分の情報を追加
5. コミット＆プッシュ
6. Pull Requestを作成

詳しくは[チュートリアル](https://git-training-ground.vercel.app/tutorial)をご覧ください。

## 技術スタック

- [Next.js](https://nextjs.org/) - SSG対応のReactフレームワーク
- [TypeScript](https://www.typescriptlang.org/) - 型安全性
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSS
- [Vitest](https://vitest.dev/) - 単体テスト
- [Playwright](https://playwright.dev/) - E2Eテスト

## 開発

```bash
npm install
npm run dev     # 開発サーバー起動
npm run build   # プロダクションビルド
npm test        # 単体テスト実行
npm run test:e2e # E2Eテスト実行
```

## ライセンス

[MIT](LICENSE)
