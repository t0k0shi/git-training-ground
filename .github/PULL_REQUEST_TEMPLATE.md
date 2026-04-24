<!--
  ⚠️ PR を出す前に [CONTRIBUTING.md](../blob/main/CONTRIBUTING.md) を必ず読んでください。
  特に以下の規約に違反すると CI で弾かれます:

  - Commit Message: Conventional Commits 形式 (例: feat: xxx / fix(scope): yyy)
  - 初心者の contributors.json 追加 PR は "Add <yourname> to contributors" 形式も可
-->

> [!IMPORTANT]
> PR を出す前に [CONTRIBUTING.md](../blob/main/CONTRIBUTING.md) に目を通してください。
> 特に **Commit Message の規約**（Conventional Commits）は CI で自動検証されます。

## 変更内容

<!-- 何を変更したかを 1〜2 文で記入してください -->

## チェックリスト

<!-- 該当するものにチェックを入れてください -->

**contributors.json への追加 PR の場合:**
- [ ] `data/contributors.json` に自分のエントリを 1 つだけ追加した
- [ ] 他の人のエントリは変更・削除していない
- [ ] `favoriteColor` は `#RRGGBB` 形式、`joinedAt` は `YYYY-MM-DD` 形式

**コード・ドキュメント変更 PR の場合:**
- [ ] Commit Message が Conventional Commits 形式に従っている
- [ ] 関連する Issue 番号を記載している（あれば）
- [ ] ローカルで `npm test` / `npm run build` が成功することを確認した

---

### AI レビューについて

この PR には **CodeRabbit による自動レビュー** が走ります（**日本語**でコメントします）。

- `do-not-merge` ラベルが付いたら、AI の指摘を確認・修正してください
- 指摘の意味が分からない場合はそのまま PR コメントで質問してください。管理人がサポートします
- `@coderabbitai` にメンションすることで追加の質問や再レビューを依頼することもできます
