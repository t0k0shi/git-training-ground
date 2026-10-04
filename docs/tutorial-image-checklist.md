# Tutorial 画像取得チェックリスト

Tutorial ページ (`app/tutorial/page.tsx`) で使用する画像を取得する際のガイド。

## 配置先

すべての画像は `public/tutorial/` 配下に配置します。

```
public/tutorial/
├── step1-fork-button.png
├── step1-create-fork.png
├── step2-data-folder.png
├── step2-contributors-json.png
├── step3-edit-pencil.png
├── step4-paste-position.png
├── step4-after-paste.png
├── step5-commit-button.png
├── step5-new-branch.png
├── step6-compare-banner.png
├── step7-open-pr.png
└── step8-checks-tab.png
```

## 撮影時の共通ルール

- **形式**: PNG（スクリーンショット）
- **サイズ目安**: 横幅 800px 前後（必要に応じて注釈用の 600px も可）
- **個人情報のマスク**: 画面に他人のアバター / Slack 通知等が写る場合はモザイク or 切り抜き
- **ブラウザテーマ**: GitHub のライトテーマで統一推奨（ダークテーマでも可だが混在しない）
- **ズーム**: ブラウザ倍率を 100% で取得（Retina 以外の PC で撮る場合は 2x 推奨）
- **alt text**: Tutorial ページ内の `alt` 属性はすでに日本語で記述済みなので、画像だけ配置すれば OK

## 画像一覧

| # | Step | ファイル名 | 内容 | alt text（現行） | 優先度 | ログイン |
|---|---|---|---|---|---|---|
| 1 | Step 1 | `step1-fork-button.png` | リポジトリページ右上の **Fork** ボタンを矢印等でマーキング | "リポジトリ右上の Fork ボタン" | ★★★ | 不要 |
| 2 | Step 1 | `step1-create-fork.png` | Fork 画面で **Create fork** ボタンをマーキング | "Create fork ボタンをクリック" | ★★ | 要 |
| 3 | Step 2 | `step2-data-folder.png` | ファイル一覧で **data** フォルダをクリック | "data フォルダを開く" | ★★ | 不要 |
| 4 | Step 2 | `step2-contributors-json.png` | data フォルダ内の **contributors.json** を選択 | "contributors.json を選択" | ★★ | 不要 |
| 5 | Step 3 | `step3-edit-pencil.png` | 右上の **鉛筆アイコン（Edit this file）** をマーキング | "Edit this file の鉛筆アイコン" | ★★★ | **要**（ログアウト状態では鉛筆ボタンが出ない） |
| 6 | **Step 4** | `step4-paste-position.png` | **最後のエントリの `}` の直後、`]` の直前にカーソルを置いた状態** ⭐ | "カーソル位置: 最後のエントリの } の直後" | ★★★ | 要 |
| 7 | Step 4 | `step4-after-paste.png` | 貼り付け後、自分のエントリが追加されたエディタ表示 | "貼り付け後のエディタ" | ★★ | 要 |
| 8 | Step 5 | `step5-commit-button.png` | GitHub 右上の **Commit changes...** ボタン | "Commit changes... ボタン" | ★★★ | 要 |
| 9 | Step 5 | `step5-new-branch.png` | Commit ダイアログで **Create a new branch** を選択した状態 | "新しいブランチを作成する選択画面" | ★★★ | 要 |
| 10 | Step 6 | `step6-compare-banner.png` | **Compare & pull request** バナーの黄色い帯 | "Compare & pull request バナー" | ★★★ | 要 |
| 11 | Step 7 | `step7-open-pr.png` | **Open a pull request** 画面で base が元リポジトリになっていることを強調 | "Open a pull request 画面（base の確認）" | ★★★ | 要 |
| 12 | Step 8 | `step8-checks-tab.png` | PR の Checks タブで CI 実行中の状態 | "CI チェックの実行画面" | ★ | 不要 |

**優先度**: ★★★ = 必須（ないと迷子になる）/ ★★ = 推奨 / ★ = あったほうが親切

**ログイン**: 撮影に GitHub へのログインが必要か。「不要」は `--public-only`、「要」は `--login` で撮ります（下の「スクリプトで撮る」参照）。

## スクリプトで撮る

`scripts/capture-tutorial-images.ts` で撮影できます。撮影する画像の定義（ファイル名・赤枠の対象・ぼかし対象）はスクリプト内の `SHOTS` 配列にまとめてあります。

```bash
nvm use
npm ci
npx playwright install chromium   # 初回のみ

# ログイン不要の 4 枚（step1-fork-button / step2-data-folder / step2-contributors-json / step8-checks-tab）
npm run capture:tutorial -- --public-only

# ログインが必要な 8 枚（ブラウザが開くので、撮影用のサブアカウントでログインする）
npm run capture:tutorial -- --login

# 1 枚だけ撮り直す（複数指定・カンマ区切り可）
npm run capture:tutorial -- --only step2-data-folder
npm run capture:tutorial -- --login --only step7-open-pr
```

- `step3-edit-pencil` はログアウト状態だと鉛筆ボタンが表示されないため、ログインが必要な側に入っています。
- `--login` はセッションを `playwright/.auth/github` に保存します（`.gitignore` 対象）。パスワードはスクリプトに渡さず、開いたブラウザで手入力します。
- `--login` では撮影者のアカウントに Fork と撮影用ブランチ（`<アカウント名>-patch-N`）を作ります。`step6-compare-banner` はチュートリアル本文に合わせて元リポジトリのトップでバナーを探し、出なければ Fork のトップで探します。PR は作りません（作成画面で止めます）。撮影後、不要なら GitHub 上で削除してください。メインのアカウントではなくサブアカウントを使ってください。
- アバター、ヘッダーのユーザーメニュー、撮影者のアカウント名は自動でぼかします（`--no-mask` で無効化）。エディタ内の撮影用エントリはチュートリアルの例と同じダミー値なので、ぼかしません。GitHub の画面構造に依存するので、**撮影後は全画像を開いて、ぼかし漏れがないか目で確認してください**。漏れていたら画像編集ソフトで手で隠します。
- `--login --all` を付けると、ログイン不要の画像もログイン状態で撮り直します。

## 追加時の確認項目

画像を `public/tutorial/` に配置したら:

1. Tutorial ページをブラウザで開き、画像が表示されるか確認
2. basePath 付き ( `GITHUB_PAGES=true npm run build` ) でも表示されるか確認
3. 画像の alt 属性の内容と実物が一致しているか確認（画像が違うと alt が嘘になる）
4. `npm run build` を通す（静的エクスポート時に画像が出力に含まれるか）

## 参考: first-contributions-ja の画像

参考にしたい場合は https://github.com/first-contributions-ja/first-contributions-ja.github.io/tree/main/docs/images を見てください。
同等のスクリーンショットが配置されています。
