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

| # | Step | ファイル名 | 内容 | alt text（現行） | 優先度 |
|---|---|---|---|---|---|
| 1 | Step 1 | `step1-fork-button.png` | リポジトリページ右上の **Fork** ボタンを矢印等でマーキング | "リポジトリ右上の Fork ボタン" | ★★★ |
| 2 | Step 1 | `step1-create-fork.png` | Fork 画面で **Create fork** ボタンをマーキング | "Create fork ボタンをクリック" | ★★ |
| 3 | Step 2 | `step2-data-folder.png` | ファイル一覧で **data** フォルダをクリック | "data フォルダを開く" | ★★ |
| 4 | Step 2 | `step2-contributors-json.png` | data フォルダ内の **contributors.json** を選択 | "contributors.json を選択" | ★★ |
| 5 | Step 3 | `step3-edit-pencil.png` | 右上の **鉛筆アイコン（Edit this file）** をマーキング | "Edit this file の鉛筆アイコン" | ★★★ |
| 6 | **Step 4** | `step4-paste-position.png` | **最後のエントリの `}` の直後、`]` の直前にカーソルを置いた状態** ⭐ | "カーソル位置: 最後のエントリの } の直後" | ★★★ |
| 7 | Step 4 | `step4-after-paste.png` | 貼り付け後、自分のエントリが追加されたエディタ表示 | "貼り付け後のエディタ" | ★★ |
| 8 | Step 5 | `step5-commit-button.png` | GitHub 右上の **Commit changes...** ボタン | "Commit changes... ボタン" | ★★★ |
| 9 | Step 5 | `step5-new-branch.png` | Commit ダイアログで **Create a new branch** を選択した状態 | "新しいブランチを作成する選択画面" | ★★★ |
| 10 | Step 6 | `step6-compare-banner.png` | **Compare & pull request** バナーの黄色い帯 | "Compare & pull request バナー" | ★★★ |
| 11 | Step 7 | `step7-open-pr.png` | **Open a pull request** 画面で base が元リポジトリになっていることを強調 | "Open a pull request 画面（base の確認）" | ★★★ |
| 12 | Step 8 | `step8-checks-tab.png` | PR の Checks タブで CI 実行中の状態 | "CI チェックの実行画面" | ★ |

**優先度**: ★★★ = 必須（ないと迷子になる）/ ★★ = 推奨 / ★ = あったほうが親切

## 追加時の確認項目

画像を `public/tutorial/` に配置したら:

1. Tutorial ページをブラウザで開き、画像が表示されるか確認
2. basePath 付き ( `GITHUB_PAGES=true npm run build` ) でも表示されるか確認
3. 画像の alt 属性の内容と実物が一致しているか確認（画像が違うと alt が嘘になる）
4. `npm run build` を通す（静的エクスポート時に画像が出力に含まれるか）

## 参考: first-contributions-ja の画像

参考にしたい場合は https://github.com/first-contributions-ja/first-contributions-ja.github.io/tree/main/docs/images を見てください。
同等のスクリーンショットが配置されています。
