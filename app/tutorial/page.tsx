import { StepGuide } from '@/components/tutorial/StepGuide';
import { CodeBlock } from '@/components/tutorial/CodeBlock';
import { FAQ } from '@/components/tutorial/FAQ';

export default function TutorialPage() {
  return (
    <main>
      <h1>チュートリアル</h1>
      <p>はじめてのPRを作成する手順を説明します。</p>

      <StepGuide step={1} title="リポジトリをForkする">
        <p>GitHubのリポジトリページで「Fork」ボタンをクリックします。</p>
      </StepGuide>

      <StepGuide step={2} title="ローカルにCloneする">
        <p>Forkしたリポジトリをローカルにクローンします。</p>
        <CodeBlock code="git clone https://github.com/YOUR_USERNAME/git-training-ground.git" />
      </StepGuide>

      <StepGuide step={3} title="ブランチを作成する">
        <p>作業用のブランチを作成します。</p>
        <CodeBlock code={`cd git-training-ground
git checkout -b add-YOUR_NAME`} />
      </StepGuide>

      <StepGuide step={4} title="contributors.jsonを編集する">
        <p>data/contributors.json を開き、自分の情報を追加します。</p>
        <CodeBlock
          language="json"
          code={`{
  "name": "your-name",
  "github": "https://github.com/your-name",
  "favoriteColor": "#3B82F6",
  "favoriteEmoji": "🚀",
  "message": "はじめてのPR！",
  "joinedAt": "2026-02-03",
  "prNumber": 0
}`}
        />
      </StepGuide>

      <StepGuide step={5} title="変更をコミットする">
        <p>変更をステージングしてコミットします。</p>
        <CodeBlock code={`git add data/contributors.json
git commit -m "Add YOUR_NAME to contributors"`} />
      </StepGuide>

      <StepGuide step={6} title="リモートにプッシュする">
        <p>変更をGitHubにプッシュします。</p>
        <CodeBlock code="git push origin add-YOUR_NAME" />
      </StepGuide>

      <StepGuide step={7} title="Pull Requestを作成する">
        <p>GitHubでFork元のリポジトリに対してPull Requestを作成します。</p>
      </StepGuide>

      <StepGuide step={8} title="CIチェックを待つ">
        <p>自動テストが実行されます。すべてのチェックがパスするのを待ちましょう。</p>
      </StepGuide>

      <StepGuide step={9} title="マージを待つ">
        <p>メンテナーがレビューし、問題なければマージされます。おめでとうございます！</p>
      </StepGuide>

      <FAQ />
    </main>
  );
}
