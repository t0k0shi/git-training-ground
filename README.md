# Git Training Ground 🎯

はじめてのPull Requestを安全に練習できる場所。

## インスパイア元

このプロジェクトは [first-contributions-ja](https://first-contributions-ja.github.io/) にインスパイアされて作りました。

## 特徴

- **初心者向け**: ステップバイステップのチュートリアル
- **自動チェック**: CIがフォーマットを検証
- **達成感**: マージされるとトップページにカードが表示される

## やり方

1. このリポジトリをFork
2. クローン: `git clone https://github.com/YOUR_USERNAME/git-training-ground.git`
3. ブランチ作成: `git checkout -b add-YOUR_NAME`
4. `data/contributors.json` に自分の情報を追加
5. コミット & プッシュ
6. Pull Requestを作成

詳しくは[チュートリアル](https://git-training-ground.vercel.app/tutorial)を参照。

## 技術スタック

- [Next.js](https://nextjs.org/) - SSG
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/) - ユニットテスト
- [Playwright](https://playwright.dev/) - E2Eテスト

## 開発

```bash
npm install
npm run dev     # 開発サーバー起動
npm run build   # ビルド
npm test        # ユニットテスト
npm run test:e2e # E2Eテスト
```

## ライセンス

[MIT](LICENSE)
