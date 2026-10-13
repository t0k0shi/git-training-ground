<!--
  ⚠️ PR を出す前に [CONTRIBUTING.md](../blob/main/CONTRIBUTING.md) を必ず読んでください。
  Commit Message・PR タイトルの形式は推奨です（CI では検証しません）:

  - contributors.json 追加 PR: "Add <yourname> to contributors"
  - コード・ドキュメント変更 PR: Conventional Commits 形式 (例: feat: xxx / fix(scope): yyy)
-->

> [!IMPORTANT]
> PR を出す前に [CONTRIBUTING.md](../blob/main/CONTRIBUTING.md) に目を通してください。
> Commit Message の形式は推奨です。違っていても、マージのときにメンテナーが PR タイトルを整えます。

## 変更内容

<!-- 何を変更したかを 1〜2 文で記入してください -->

## チェックリスト

<!-- 該当するものにチェックを入れてください -->

**contributors.json への追加 PR の場合:**
- [ ] `data/contributors.json` に自分のエントリを 1 つだけ追加した
- [ ] `github` は PR を出す自分の GitHub のユーザー名にした（2 回目以降の参加は、後ろに `+2`、`+3` を付ける）
- [ ] `favoriteEmoji` の絵文字は 1 つだけ
- [ ] 他の人のエントリは変更・削除していない
- [ ] `favoriteColor` は `#RRGGBB` 形式、`joinedAt` は `YYYY-MM-DD` 形式

**コード・ドキュメント変更 PR の場合:**
- [ ] PR タイトルが Conventional Commits 形式に近い（推奨）
- [ ] 関連する Issue 番号を記載している（あれば）
- [ ] ローカルで `npm test` / `npm run build` が成功することを確認した

---

### AI レビューについて

この PR には **CodeRabbit による自動レビュー** が走ります（**日本語**でコメントします）。

- `do-not-merge` ラベルが付いたら、AI の指摘を確認・修正してください
- 指摘の意味が分からない場合はそのまま PR コメントで質問してください。管理人がサポートします
- `@coderabbitai` にメンションすることで追加の質問や再レビューを依頼することもできます
