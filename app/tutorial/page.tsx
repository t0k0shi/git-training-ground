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
            絵文字を1つ追加するだけ！あなたの最初のPull Requestを作成しましょう。
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
              右上の「<strong>Fork</strong>」ボタンをクリックし、次の画面で「<strong>Create fork</strong>」をクリックしてください。
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="text-[#64748B]">
                <strong className="text-[#1E293B]">Forkとは？</strong><br />
                リポジトリの個人コピーを自分のアカウントに作ることです。元のリポジトリには影響しないので、安心して作業できます。
              </p>
            </div>
          </StepGuide>

          <StepGuide step={2} title="emojis.txt を開く">
            <p className="mb-3">
              Forkしたリポジトリ（自分のアカウントの git-training-ground）で、<code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">data/emojis.txt</code> を開きます。
            </p>
            <p>
              ファイル一覧から <strong>data</strong> フォルダ → <strong>emojis.txt</strong> の順にクリックしてください。
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

          <StepGuide step={4} title="好きな絵文字を追加する">
            <p className="mb-4 text-lg font-medium text-[#1E293B]">
              ファイルの最後に、好きな絵文字を追加するだけ！
            </p>

            <div className="bg-[#1E293B] rounded-lg p-4 text-sm font-mono text-white overflow-x-auto mb-4">
              <pre>{`🚀
🎉🎉
🌟🌟🌟

🐱🐱  ← 最後に追加！`}</pre>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm mb-4">
              <p className="text-blue-800 font-medium mb-2">💡 カードの大きさを選べます</p>
              <div className="space-y-1 text-blue-700">
                <p><code className="bg-blue-100 px-1.5 rounded">🐱</code> → 小さいカード</p>
                <p><code className="bg-blue-100 px-1.5 rounded">🐱🐱</code> → 中くらい</p>
                <p><code className="bg-blue-100 px-1.5 rounded">🐱🐱🐱</code> → 大きいカード（目立つ！）</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
              <p className="text-amber-800">
                <strong>⚠️ 注意:</strong> 他の人の絵文字は消さないでください。自分の絵文字を<strong>最後に追加</strong>するだけです。
              </p>
            </div>
          </StepGuide>

          <StepGuide step={5} title="変更をコミットする">
            <p className="mb-3">
              編集が終わったら、ページ右上の「<strong>Commit changes...</strong>」ボタンをクリックします。
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2 mb-3">
              <p><strong className="text-[#1E293B]">Commit message:</strong> Add my emoji 🐱</p>
              <p><strong className="text-[#1E293B]">選択:</strong> 「Create a new branch for this commit and start a pull request」を選ぶ</p>
            </div>
            <p className="text-sm text-[#64748B]">
              ブランチ名は自動で提案されますが、<code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">add-my-emoji</code> のようにわかりやすい名前に変えてもOKです。
            </p>
          </StepGuide>

          <StepGuide step={6} title="Pull Requestを作成する">
            <p className="mb-3">
              「<strong>Propose changes</strong>」をクリックすると、Pull Request作成画面に移ります。
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm mb-3">
              <p className="text-amber-800">
                <strong>⚠️ 重要:</strong> PR先が <code className="bg-amber-100 px-1 rounded">t0k0shi/git-training-ground</code> になっていることを確認してください。自分のFork内へのPRにならないように注意！
              </p>
            </div>
            <p>
              内容を確認して「<strong>Create pull request</strong>」をクリックしてください。
            </p>
          </StepGuide>

          <StepGuide step={7} title="CIチェックを待つ">
            <p className="mb-3">
              PRを作成すると自動テスト（CI）が実行されます。
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm mb-3">
              <li>絵文字の形式チェック</li>
              <li>既存エントリが削除されていないかチェック</li>
            </ul>
            <p className="text-sm text-[#64748B]">
              すべてのチェックがパスするのを待ちましょう。
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
            おめでとうございます！あなたの絵文字がトップページに表示されます。
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
