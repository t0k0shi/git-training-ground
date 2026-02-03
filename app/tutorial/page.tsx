import Link from 'next/link';
import { StepGuide } from '@/components/tutorial/StepGuide';
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
            ブラウザだけで完結！Gitのインストール不要で、あなたの最初のPull Requestを作成しましょう。
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* 前提条件 */}
        <section className="mb-12 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#1E293B] mb-4">必要なもの</h2>
          <ul className="space-y-3 text-[#64748B]">
            <li className="flex items-start gap-3">
              <span className="text-[#10B981] font-bold mt-0.5">✓</span>
              <span>
                <strong className="text-[#1E293B]">GitHub アカウント</strong>（
                <a href="https://github.com" className="text-[#2563EB] underline" target="_blank" rel="noopener noreferrer">github.com</a>{' '}
                で無料作成できます）
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#10B981] font-bold mt-0.5">✓</span>
              <span>
                <strong className="text-[#1E293B]">ブラウザ</strong>（これを読んでいるなら準備OK）
              </span>
            </li>
          </ul>
          <p className="mt-4 text-sm text-[#64748B]">
            ※ Gitのインストールは不要です。すべてブラウザ上で完結します。
          </p>
        </section>

        {/* ステップガイド */}
        <div className="space-y-0">
          <StepGuide step={1} title="リポジトリをForkする">
            <p className="mb-3">
              まず、<a href="https://github.com/t0k0shi/git-training-ground" className="text-[#2563EB] underline" target="_blank" rel="noopener noreferrer">Git Training Ground のリポジトリ</a>を開きます。
            </p>
            <p className="mb-3">
              右上の「<strong>Fork</strong>」ボタンをクリックしてください。
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="text-[#64748B]">
                <strong className="text-[#1E293B]">Forkとは？</strong><br />
                リポジトリの個人コピーを自分のアカウントに作ることです。元のリポジトリには影響しないので、安心して作業できます。
              </p>
            </div>
          </StepGuide>

          <StepGuide step={2} title="contributors.json を開く">
            <p className="mb-3">
              Forkしたリポジトリ（自分のアカウントの git-training-ground）で、<code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">data/contributors.json</code> を開きます。
            </p>
            <p>
              ファイル一覧から <strong>data</strong> フォルダ → <strong>contributors.json</strong> の順にクリックしてください。
            </p>
          </StepGuide>

          <StepGuide step={3} title="編集モードに入る">
            <p className="mb-3">
              ファイルを開いたら、右上の<strong>鉛筆アイコン（Edit this file）</strong>をクリックします。
            </p>
            <p className="text-sm text-[#64748B]">
              編集画面が開き、直接ファイルを書き換えられるようになります。
            </p>
          </StepGuide>

          <StepGuide step={4} title="自分の情報を追加する">
            <p className="mb-3">
              配列の末尾（最後の <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{'}'}</code> の後ろ）にカンマを追加し、自分の情報を追加します。
            </p>
            <div className="bg-[#1E293B] rounded-lg p-4 text-sm font-mono text-white overflow-x-auto mb-4">
              <pre>{`{
  "name": "your-name",
  "github": "https://github.com/your-name",
  "favoriteColor": "#3B82F6",
  "favoriteEmoji": "🚀",
  "message": "はじめてのPR！",
  "joinedAt": "2026-02-03",
  "prNumber": 0
}`}</pre>
            </div>
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
            <p className="mb-3">
              編集が終わったら、ページ右上の「<strong>Commit changes...</strong>」ボタンをクリックします。
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2 mb-3">
              <p><strong className="text-[#1E293B]">Commit message:</strong> Add YOUR_NAME to contributors</p>
              <p><strong className="text-[#1E293B]">選択:</strong> 「Create a new branch for this commit and start a pull request」を選ぶ</p>
            </div>
            <p className="text-sm text-[#64748B]">
              ブランチ名は自動で提案されますが、<code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">add-your-name</code> のようにわかりやすい名前に変えてもOKです。
            </p>
          </StepGuide>

          <StepGuide step={6} title="Pull Requestを作成する">
            <p className="mb-3">
              「<strong>Propose changes</strong>」をクリックすると、Pull Request作成画面に移ります。
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2 mb-3">
              <p><strong className="text-[#1E293B]">タイトル:</strong> Add YOUR_NAME to contributors</p>
              <p><strong className="text-[#1E293B]">説明欄:</strong> 自己紹介や参加の動機を書くと、レビュアーに喜ばれます。</p>
            </div>
            <p>
              内容を確認して「<strong>Create pull request</strong>」をクリックしてください。
            </p>
          </StepGuide>

          <StepGuide step={7} title="CIチェックを待つ">
            <p className="mb-3">
              PRを作成すると自動テスト（CI）が実行されます。以下の項目がチェックされます。
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm mb-3">
              <li>contributors.json のJSON構文チェック</li>
              <li>スキーマバリデーション（必須フィールドの確認）</li>
              <li>NGワードチェック</li>
              <li>ビルドの成功</li>
            </ul>
            <p className="text-sm text-[#64748B]">
              すべてのチェックがパスするのを待ちましょう。失敗した場合はエラーメッセージを確認して修正してください。
            </p>
          </StepGuide>

          <StepGuide step={8} title="マージを待つ">
            <p>
              メンテナーがレビューし、問題なければマージされます。おめでとうございます！
            </p>
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

        {/* CLI版への案内 */}
        <section className="mt-12 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-[#1E293B] mb-3">CLIで操作したい方へ</h2>
          <p className="text-[#64748B] text-sm mb-4">
            Gitコマンドを使って操作したい場合は、以下の流れで行えます。
          </p>
          <details className="text-sm">
            <summary className="cursor-pointer text-[#2563EB] font-medium">CLI版の手順を見る</summary>
            <div className="mt-4 space-y-4 text-[#64748B]">
              <div>
                <p className="font-medium text-[#1E293B] mb-1">1. クローン</p>
                <code className="block bg-gray-100 px-3 py-2 rounded text-sm">git clone https://github.com/YOUR_USERNAME/git-training-ground.git</code>
              </div>
              <div>
                <p className="font-medium text-[#1E293B] mb-1">2. ブランチ作成</p>
                <code className="block bg-gray-100 px-3 py-2 rounded text-sm">cd git-training-ground && git checkout -b add-YOUR_NAME</code>
              </div>
              <div>
                <p className="font-medium text-[#1E293B] mb-1">3. 編集後、コミット & プッシュ</p>
                <code className="block bg-gray-100 px-3 py-2 rounded text-sm">git add data/contributors.json && git commit -m &quot;Add YOUR_NAME&quot; && git push origin add-YOUR_NAME</code>
              </div>
              <p>その後、GitHub上でPull Requestを作成してください。</p>
            </div>
          </details>
        </section>

        <FAQ />
      </div>
    </main>
  );
}
