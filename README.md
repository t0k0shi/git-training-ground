# Git Training Ground 🎯

はじめてのPull Requestを安全に練習できる場所。

## インスパイア元

このプロジェクトは [first-contributions-ja](https://first-contributions-ja.github.io/) にインスパイアされて作りました。

## 特徴

- **超シンプル**: 絵文字を1つ追加するだけ
- **初心者向け**: ステップバイステップのチュートリアル
- **自動チェック**: CIがフォーマットを検証
- **達成感**: マージされるとトップページに絵文字が表示される

## やり方

1. このリポジトリをFork
2. `data/emojis.txt` を開く
3. ファイルの最後に好きな絵文字を追加
4. Pull Requestを作成

```
🚀
🎉🎉
🌟🌟🌟
🐱  ← あなたの絵文字を最後に追加！
```

💡 **カードの大きさを選べます**:
- `🐱` → 小さいカード
- `🐱🐱` → 中くらい
- `🐱🐱🐱` → 大きいカード

詳しくは[チュートリアル](https://git-training-ground.vercel.app/tutorial)を参照。

## 技術スタック

- [Next.js](https://nextjs.org/) - SSG
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## 開発

```bash
npm install
npm run dev     # 開発サーバー起動
npm run build   # ビルド
```

## ライセンス

[MIT](LICENSE)
