# main ブランチ保護の設定手順

`main` ブランチを守る 3 層構造（[ADR-0011](./adr/0011-guard-changed-files-on-pull-request-target.md)）のうち、第 3 層「ブランチ保護」の設定手順です。
ブランチ保護はリポジトリの管理者が GitHub 上で設定します（コードからは適用されません）。

| 層 | 仕組み | 役割 |
|---|---|---|
| 1 | `.github/workflows/guard-files.yml` | 初心者に「何を変えてはいけないか」を日本語で返す |
| 2 | `.github/CODEOWNERS` | `data/contributors.json` 以外の変更にオーナー承認を要求する |
| 3 | ブランチ保護（本書） | PR 必須、必須チェック、コードオーナー承認、強制 push 禁止 |

層 2 の CODEOWNERS は、ブランチ保護の「Require review from Code Owners」を有効にして初めて効きます。

## 設定する内容

- Pull Request 必須（承認 1 件、コードオーナーのレビュー必須）
- 必須ステータスチェック: `guard-files`、`test`、`e2e`、`merge-guard`、`commit-lint`
- 強制 push の禁止、ブランチ削除の禁止
- 管理者にも適用する（Do not allow bypassing）

## 事前準備

`contribution-welcome` ラベルを作成します（未作成の場合）。

```bash
./scripts/init-labels.sh t0k0shi/git-training-ground
```

必須チェックは、一度でも実行されたチェック名しか検索で選べません。
`guard-files` を選べるようにするため、先にこの変更を `main` にマージし、何か PR を 1 件出してチェックを走らせておいてください。

## 手順 A: GitHub の画面から設定する

1. リポジトリの **Settings** > **Branches** を開く
2. **Add branch ruleset**（または **Add classic branch protection rule**）を選び、対象ブランチを `main` にする
3. 次を有効にする
   - **Require a pull request before merging**
     - Required approvals: `1`
     - **Require review from Code Owners**
   - **Require status checks to pass before merging**
     - 検索して次の 5 つを追加: `guard-files`、`test`、`e2e`、`merge-guard`、`commit-lint`
     - 必要に応じて **Require branches to be up to date before merging**
   - **Block force pushes**
   - **Restrict deletions**（classic では「Allow deletions」を無効のままにする）
   - **Do not allow bypassing the above settings**（classic では **Do not allow bypassing**／管理者にも適用）
4. **Create** / **Save changes** を押す

## 手順 B: `gh api` で設定する

classic branch protection API で、上記と同じ設定を一括で適用します。
実行にはリポジトリ管理者の権限でログインした `gh` が必要です。

```bash
gh api -X PUT repos/t0k0shi/git-training-ground/branches/main/protection \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": false,
    "contexts": ["guard-files", "test", "e2e", "merge-guard", "commit-lint"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "require_code_owner_reviews": true,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```

設定を確認するには次を実行します。

```bash
gh api repos/t0k0shi/git-training-ground/branches/main/protection \
  --jq '{checks: .required_status_checks.contexts, codeowners: .required_pull_request_reviews.require_code_owner_reviews, force_push: .allow_force_pushes.enabled, deletions: .allow_deletions.enabled}'
```

## 注意事項

### `validate` は必須チェックにしない

`validate`（`validate-pr.yml`）は `data/contributors.json` を変更した PR だけで起動するパス条件付きのワークフローです。
`contributors.json` を含まない PR では実行されず、必須にするとマージできなくなります。
全 PR で動く `guard-files` が変更ファイルの検査を担います。

### 緊急時の対応

`enforce_admins` を有効にすると、オーナーも保護を回避できません。緊急対応が必要な場合は、一時的に **Do not allow bypassing** を外す（手順 B なら `"enforce_admins": false` で再実行する）、対応後に必ず戻してください。

### オーナー自身の PR

ブランチ保護で承認 1 件を必須にすると、オーナー自身の PR は自分で承認できません。
1 人で運用する場合は、承認数を `0` にして「コードオーナーのレビュー必須」だけを外すか、緊急時の手順で一時的に回避してください。
`data/contributors.json` だけを変更する PR は CODEOWNERS の対象外のため、コードオーナーの承認なしでマージできます。

### 動作確認

設定後、サブアカウントから次の PR を出して確認します。

1. `app/` 配下のファイルを変えた PR: `guard-files` が失敗し、日本語のメッセージが出る
2. `contribution-welcome` ラベル付きの Issue を `Closes #番号` で参照した PR: `guard-files` が通り、マージにはコードオーナーの承認が要る
3. `data/contributors.json` だけを変えた PR: すべてのチェックが通り、コードオーナーの承認なしでマージできる
