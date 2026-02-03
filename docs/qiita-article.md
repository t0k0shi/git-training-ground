# 「はじめてのPR」を気軽に試せるOSSを作った

## きっかけ

OSSコントリビューション、やってみたいと思いつつ手が出ない。そういう人は多いと思う。

- 変なコード送ったら怒られそう
- PRの作り方がいまいちわからない
- 英語でやり取りとか無理

で、「練習できる場所があればいいのに」と思って作った。

## 作ったもの

**Git Training Ground**
https://git-training-ground.vercel.app/

![トップページのスクリーンショット]()

やることは簡単。JSONファイルに自分の情報を足してPRを送る。マージされたらトップページに自分のカードが出る。それだけ。

## なぜ作ったか

### みんな同じこと言ってる

OSSコントリビューションの記事を読むと、だいたい同じ悩みが出てくる。

> 「OSSにコントリビュートしている人ってかっこいい」でも「自分の実力ではとてもできないだろう」
> ― [OSSコントリビュートへの挑戦](https://zenn.dev/takamin55/articles/a9d46d43389f69)

> 「自分の中にある開発障壁を取っ払いたくて」OSS Gateに参加した
> ― [OSS Gate参加記録](https://note.com/012xx_/n/nfbe044ec391e)

> OSSは「凄腕の人たちだけが触る神聖な場所」だと思っていた
> ― [OSSコントリビュートに挑戦してみた](https://zenn.dev/loglass/articles/aaca355c10c673)

> 通常開発とOSS開発では求められる基準が違う。「頭がちぎれるくらい考える」必要がある
> ― [OSS活動で3ヶ月で学んだこと](https://qiita.com/YmBIgo/items/a7c42042f7e7d7c49d98)

### 障壁を整理する

| 障壁 | 内容 |
|------|------|
| 心理的 | 「自分には無理」「すごい人の世界」 |
| 技術的 | 知らないコード、どこから手をつければ |
| 品質 | 普段の仕事より高い基準を求められそう |
| 英語 | 読むのも書くのもしんどい |

で、実際やった人は「意外といけた」「コード読みやすかった」「ドキュメント整ってた」と言う。

**でも最初の一歩が怖い。**

### だから練習場を作った

[first-contributions-ja](https://first-contributions-ja.github.io/) というプロジェクトを見つけた。日本語でGitHubの使い方を学べて、実際にPRを出して体験できる。これだ、と思った。

同じコンセプトで、自分なりのバージョンを作ってみることにした。

- 本物のOSSプロジェクト
- 失敗しても誰も困らない
- PRの流れを一通り体験できる

| 障壁 | どう解決したか |
|------|---------------|
| 心理的 | 練習用。失敗してOK |
| 技術的 | 編集するのはJSON 1ファイルだけ |
| 品質 | CIが自動チェック。間違ってたら教えてくれる |
| 英語 | 全部日本語 |

おまけに、マージされたらトップページに自分のカードが出る。ちょっとした達成感。

## 技術スタック

| 何 | 使ったもの |
|----|-----------|
| フレームワーク | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| 言語 | TypeScript |
| ホスティング | Vercel |
| CI | GitHub Actions |
| テスト | Vitest + Playwright |
| バリデーション | ajv |

SSGでビルド時にHTML生成。Vercelにpushしたら勝手にデプロイされる。サーバー代ゼロ。

## 機能

### チュートリアル

![チュートリアルページ]()

9ステップでPR作成の流れを説明。コードブロックにはコピーボタンつけた。

### 貢献者カード

```json
{
  "name": "your-name",
  "github": "https://github.com/your-name",
  "favoriteColor": "#3B82F6",
  "favoriteEmoji": "🚀",
  "message": "はじめてのPR！",
  "joinedAt": "2026-02-03",
  "prNumber": 0
}
```

これがトップページにカードで表示される。ホバーでメッセージも見れる。

### 自動チェック

PR出すとGitHub Actionsが走る。

- JSON構文
- スキーマ（必須項目、形式）
- NGワード
- ビルド

ミスってたらCIが落ちて教えてくれる。

## 工夫したところ

**ターゲット**：Git初心者。前提条件は明示、各ステップに「なぜ」を書いた。FAQもつけた。

**デザイン**：Tailwindで統一。青(#2563EB)と緑(#10B981)ベース。

**テスト**：ユニットテスト111件。E2EはPlaywright。

## 開発の進め方

Claude Code使ってペアプロ的に進めた。要件→設計→実装→テストを対話しながら。仕様書とADRも一緒に整備。

## これから

- 英語版チュートリアル
- 貢献者ランキング
- バッジ（初PR、10PR達成など）

## まとめ

OSSコントリビューション、やりたいけど怖いという人向けの練習場を作った。

**リポジトリ**: https://github.com/t0k0shi/git-training-ground
**サイト**: https://git-training-ground.vercel.app/

気軽にPR送ってください。

---

## 参考

### OSSコントリビューション体験記
- [OSSコントリビュートへの挑戦](https://zenn.dev/takamin55/articles/a9d46d43389f69)
- [OSS Gate参加記録](https://note.com/012xx_/n/nfbe044ec391e)
- [OSS活動で3ヶ月で学んだこと](https://qiita.com/YmBIgo/items/a7c42042f7e7d7c49d98)
- [OSSコントリビュートに挑戦してみた](https://zenn.dev/loglass/articles/aaca355c10c673)

### 技術
- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
