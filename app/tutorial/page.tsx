import Link from 'next/link';
import { StepGuide } from '@/components/tutorial/StepGuide';
import { CodeBlock } from '@/components/tutorial/CodeBlock';
import { FAQ } from '@/components/tutorial/FAQ';

export default function TutorialPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* ヒーローエリア */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-[#2563EB]/5 via-[#F8FAFC] to-[#10B981]/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-[#1E293B] mb-4">
            はじめてのPRチュートリアル
          </h1>
          <p className="text-lg text-[#64748B]">
            ステップバイステップで、あなたの最初のPull Requestを作成しましょう。
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* 前提条件 */}
        <section className="mb-12 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#1E293B] mb-4">前提条件</h2>
          <ul className="space-y-3 text-[#64748B]">
            <li className="flex items-start gap-3">
              <span className="text-[#10B981] font-bold mt-0.5">✓</span>
              <span>
                <strong className="text-[#1E293B]">Git</strong> がインストール済みであること（ターミナルで{' '}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">git --version</code>{' '}
                を実行して確認できます）
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#10B981] font-bold mt-0.5">✓</span>
              <span>
                <strong className="text-[#1E293B]">GitHub アカウント</strong> を持っていること（
                <a href="https://github.com" className="text-[#2563EB] underline" target="_blank" rel="noopener noreferrer">github.com</a>{' '}
                で無料作成できます）
              </span>
            </li>
          </ul>
        </section>

        {/* ステップガイド */}
        <div className="space-y-0">
          <StepGuide step={1} title="リポジトリをForkする">
            <p>
              GitHubのリポジトリページで右上の「Fork」ボタンをクリックします。
              Forkとは、リポジトリの個人コピーを自分のアカウントに作ることです。
              元のリポジトリには影響しないので、安心して作業できます。
            </p>
          </StepGuide>

          <StepGuide step={2} title="ローカルにCloneする">
            <p>Forkしたリポジトリをローカルにクローンします。</p>
            <CodeBlock code="git clone https://github.com/YOUR_USERNAME/git-training-ground.git" />
          </StepGuide>

          <StepGuide step={3} title="ブランチを作成する">
            <p>作業用のブランチを作成します。</p>
            <CodeBlock code={`cd git-training-ground\ngit checkout -b add-YOUR_NAME`} />
          </StepGuide>

          <StepGuide step={4} title="contributors.jsonを編集する">
            <p>
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">data/contributors.json</code>{' '}
              を開き、配列の末尾に自分の情報を追加します。各フィールドの説明は以下の通りです。
            </p>
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
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="py-1.5 pr-4 font-medium text-[#1E293B] whitespace-nowrap">name</td><td className="py-1.5">あなたの名前（GitHub IDでもOK）</td></tr>
                  <tr><td className="py-1.5 pr-4 font-medium text-[#1E293B] whitespace-nowrap">github</td><td className="py-1.5">GitHubプロフィールURL</td></tr>
                  <tr><td className="py-1.5 pr-4 font-medium text-[#1E293B] whitespace-nowrap">favoriteColor</td><td className="py-1.5">好きな色（16進数カラーコード）</td></tr>
                  <tr><td className="py-1.5 pr-4 font-medium text-[#1E293B] whitespace-nowrap">favoriteEmoji</td><td className="py-1.5">好きな絵文字</td></tr>
                  <tr><td className="py-1.5 pr-4 font-medium text-[#1E293B] whitespace-nowrap">message</td><td className="py-1.5">ひとことメッセージ</td></tr>
                  <tr><td className="py-1.5 pr-4 font-medium text-[#1E293B] whitespace-nowrap">joinedAt</td><td className="py-1.5">今日の日付（YYYY-MM-DD形式）</td></tr>
                  <tr><td className="py-1.5 pr-4 font-medium text-[#1E293B] whitespace-nowrap">prNumber</td><td className="py-1.5">0のまま（マージ時にメンテナーが更新します）</td></tr>
                </tbody>
              </table>
            </div>
          </StepGuide>

          <StepGuide step={5} title="変更をコミットする">
            <p>変更をステージングしてコミットします。</p>
            <CodeBlock code={`git add data/contributors.json\ngit commit -m "Add YOUR_NAME to contributors"`} />
          </StepGuide>

          <StepGuide step={6} title="リモートにプッシュする">
            <p>変更をGitHubにプッシュします。</p>
            <CodeBlock code="git push origin add-YOUR_NAME" />
          </StepGuide>

          <StepGuide step={7} title="Pull Requestを作成する">
            <p>
              GitHubでFork元のリポジトリに対してPull Requestを作成します。
              「Compare &amp; pull request」ボタンが表示されるのでクリックしてください。
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
              <p><strong className="text-[#1E293B]">タイトル例:</strong> Add YOUR_NAME to contributors</p>
              <p><strong className="text-[#1E293B]">説明欄:</strong> 自己紹介や参加の動機を書くと、レビュアーに喜ばれます。</p>
            </div>
          </StepGuide>

          <StepGuide step={8} title="CIチェックを待つ">
            <p>
              PRを作成すると自動テスト（CI）が実行されます。以下の項目がチェックされます。
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>contributors.json のJSON構文チェック</li>
              <li>スキーマバリデーション（必須フィールドの確認）</li>
              <li>NGワードチェック</li>
              <li>ビルドの成功</li>
            </ul>
            <p className="text-sm">すべてのチェックがパスするのを待ちましょう。失敗した場合はエラーメッセージを確認して修正してください。</p>
          </StepGuide>

          <StepGuide step={9} title="マージを待つ">
            <p>メンテナーがレビューし、問題なければマージされます。おめでとうございます！</p>
          </StepGuide>
        </div>

        {/* 完了セクション */}
        <section className="mt-16 text-center bg-gradient-to-r from-[#2563EB]/5 to-[#10B981]/5 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-[#1E293B] mb-3">PRがマージされたら...</h2>
          <p className="text-[#64748B] mb-6">
            おめでとうございます！あなたのカードがトップページに表示されます。
          </p>
          <Link
            href="/"
            className="inline-block bg-[#2563EB] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#1d4ed8] transition-colors"
          >
            トップページを見る
          </Link>
        </section>

        <FAQ />
      </div>
    </main>
  );
}
