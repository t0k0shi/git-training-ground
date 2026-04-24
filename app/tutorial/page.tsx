import Link from 'next/link';
import { StepGuide } from '@/components/tutorial/StepGuide';
import { CodeBlock } from '@/components/tutorial/CodeBlock';
import { FAQ } from '@/components/tutorial/FAQ';
import { asset } from '@/lib/asset';

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
            contributors.json にあなたのエントリを追加するだけ！最初のPull Requestを作成しましょう。
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
            ※ Gitのインストールは不要です。すべてブラウザ上で完結します。コマンドラインで操作したい方向けに各ステップの最後に補足を載せています。
          </p>
        </section>

        {/* ステップガイド */}
        <div className="space-y-0">
          {/* Step 1 */}
          <StepGuide step={1} title="リポジトリをForkする">
            <p className="mb-3">
              まず、<a href="https://github.com/t0k0shi/git-training-ground" className="text-[#2563EB] underline" target="_blank" rel="noopener noreferrer">Git Training Ground のリポジトリ</a>を開きます。
            </p>
            <p className="mb-3">
              右上の「<strong>Fork</strong>」ボタンをクリックし、次の画面で「<strong>Create fork</strong>」をクリックしてください。
            </p>

            <figure className="my-4">
              <img
                src={asset('/tutorial/step1-fork-button.png')}
                alt="リポジトリ右上の Fork ボタン"
                className="rounded-lg border border-gray-200 max-w-full"
              />
            </figure>

            <figure className="my-4">
              <img
                src={asset('/tutorial/step1-create-fork.png')}
                alt="Create fork ボタンをクリック"
                className="rounded-lg border border-gray-200 max-w-full"
              />
            </figure>

            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="text-[#64748B]">
                <strong className="text-[#1E293B]">Forkとは？</strong><br />
                リポジトリの個人コピーを自分のアカウントに作ることです。元のリポジトリには影響しないので、安心して作業できます。
              </p>
            </div>
          </StepGuide>

          {/* Step 2 */}
          <StepGuide step={2} title="contributors.json を開く">
            <p className="mb-3">
              Forkしたリポジトリ（自分のアカウントの git-training-ground）で、<code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">data/contributors.json</code> を開きます。
            </p>
            <p className="mb-3">
              ファイル一覧から <strong>data</strong> フォルダ → <strong>contributors.json</strong> の順にクリックしてください。
            </p>

            <figure className="my-4">
              <img
                src={asset('/tutorial/step2-data-folder.png')}
                alt="data フォルダを開く"
                className="rounded-lg border border-gray-200 max-w-full"
              />
            </figure>

            <figure className="my-4">
              <img
                src={asset('/tutorial/step2-contributors-json.png')}
                alt="contributors.json を選択"
                className="rounded-lg border border-gray-200 max-w-full"
              />
            </figure>

            <details className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm">
              <summary className="cursor-pointer font-medium text-[#1E293B]">
                コマンドラインで操作したい方へ
              </summary>
              <div className="mt-3 space-y-2 text-[#64748B]">
                <p>Fork したリポジトリを自分の PC にクローンして編集することもできます。</p>
                <CodeBlock code="git clone https://github.com/<yourname>/git-training-ground.git" />
                <CodeBlock code="cd git-training-ground" />
                <p className="mt-2"><code className="bg-slate-100 px-1 rounded">&lt;yourname&gt;</code> は自分の GitHub ユーザー名に置き換えてください。</p>
              </div>
            </details>
          </StepGuide>

          {/* Step 3 */}
          <StepGuide step={3} title="編集モードに入る">
            <p className="mb-3">
              ファイルを開いたら、右上の<strong>鉛筆アイコン（Edit this file）</strong>をクリックします。
            </p>

            <figure className="my-4">
              <img
                src={asset('/tutorial/step3-edit-pencil.png')}
                alt="Edit this file の鉛筆アイコン"
                className="rounded-lg border border-gray-200 max-w-full"
              />
            </figure>

            <p className="text-sm text-[#64748B]">
              編集画面が開き、直接ファイルを書き換えられるようになります。
            </p>

            <details className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm">
              <summary className="cursor-pointer font-medium text-[#1E293B]">
                コマンドラインで操作したい方へ
              </summary>
              <div className="mt-3 space-y-2 text-[#64748B]">
                <p>作業用ブランチを作成してから編集します。<code className="bg-slate-100 px-1 rounded">&lt;yourname&gt;</code> は半角英数字のハンドル名に置き換えてください（ひらがな・漢字・空白は不可）。</p>
                <CodeBlock code="git switch -c add-<yourname>" />
                <p className="mt-2">例: <code className="bg-slate-100 px-1 rounded">git switch -c add-oginochihiro</code></p>
                <p>その後、お好きなエディタで <code className="bg-slate-100 px-1 rounded">data/contributors.json</code> を開きます。</p>
              </div>
            </details>
          </StepGuide>

          {/* Step 4 */}
          <StepGuide step={4} title="自分のエントリを追加する">
            <p className="mb-4 text-lg font-medium text-[#1E293B]">
              下のコードをコピーして、ファイルの配列末尾に貼り付けるだけ！
            </p>

            <p className="mb-2 text-sm text-[#1E293B] font-medium">
              ① 以下のコードを<strong>そのまま</strong>コピーしてください（先頭の <code className="bg-gray-100 px-1 rounded">,</code>（カンマ）も必要です）:
            </p>
            <div className="bg-[#1E293B] rounded-lg p-4 text-sm font-mono text-white overflow-x-auto mb-4">
              <pre>{`  ,
  {
    "name": "あなたの名前",
    "github": "your-github-handle",
    "favoriteColor": "#FF5E5B",
    "favoriteEmoji": "🦊",
    "message": "よろしくです！",
    "joinedAt": "2026-04-24"
  }`}</pre>
            </div>

            <p className="mb-2 text-sm text-[#1E293B] font-medium">
              ② 貼り付ける位置: <strong>配列の最後のエントリの <code className="bg-gray-100 px-1 rounded">{'}'}</code> の直後、<code className="bg-gray-100 px-1 rounded">{']'}</code> の直前</strong>。
            </p>

            <figure className="my-4">
              <img
                src={asset('/tutorial/step4-paste-position.png')}
                alt="カーソル位置: 最後のエントリの } の直後"
                className="rounded-lg border border-gray-200 max-w-full"
              />
            </figure>

            <p className="mb-2 text-sm text-[#1E293B] font-medium">
              ③ 貼り付けたら、自分の情報に書き換えます。変更後はこんな感じになります:
            </p>
            <div className="bg-[#1E293B] rounded-lg p-4 text-sm font-mono text-white overflow-x-auto mb-4">
              <pre>{`[
  {
    "name": "ketts",
    "github": "t0k0shi",
    "favoriteColor": "#E63946",
    "favoriteEmoji": "🚀",
    "message": "はじめてのOSS貢献！",
    "joinedAt": "2026-04-24"
  },
  {
    "name": "oginochihiro",
    "github": "https://github.com/oginochihiro",
    "favoriteColor": "#FF5E5B",
    "favoriteEmoji": "🦊",
    "message": "よろしくです！",
    "joinedAt": "2026-04-24"
  }
]`}</pre>
            </div>

            <figure className="my-4">
              <img
                src={asset('/tutorial/step4-after-paste.png')}
                alt="貼り付け後のエディタ"
                className="rounded-lg border border-gray-200 max-w-full"
              />
            </figure>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm mb-4">
              <p className="text-blue-800 font-medium mb-2">各フィールドの意味</p>
              <div className="space-y-1 text-blue-700">
                <p><code className="bg-blue-100 px-1.5 rounded">name</code> — 表示名（ハンドルネーム可）</p>
                <p><code className="bg-blue-100 px-1.5 rounded">github</code> — GitHub ハンドルまたは URL</p>
                <p><code className="bg-blue-100 px-1.5 rounded">favoriteColor</code> — カードボーダー色（<code className="bg-blue-100 px-1 rounded">#RRGGBB</code> 形式）</p>
                <p><code className="bg-blue-100 px-1.5 rounded">favoriteEmoji</code> — 1 文字の絵文字</p>
                <p><code className="bg-blue-100 px-1.5 rounded">message</code> — 1 行自己紹介</p>
                <p><code className="bg-blue-100 px-1.5 rounded">joinedAt</code> — PR を出す日付（<code className="bg-blue-100 px-1 rounded">YYYY-MM-DD</code>）</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm mb-4">
              <p className="text-blue-800 font-medium mb-2">参考になるサイト</p>
              <ul className="space-y-1 text-blue-700 list-disc list-inside">
                <li>絵文字: <a href="https://emojipedia.org/" target="_blank" rel="noopener noreferrer" className="underline">Emojipedia</a></li>
                <li>日本の伝統色: <a href="https://nipponcolors.com" target="_blank" rel="noopener noreferrer" className="underline">NIPPON COLORS</a></li>
                <li>原色大辞典: <a href="https://www.colordic.org" target="_blank" rel="noopener noreferrer" className="underline">colordic.org</a></li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
              <p className="text-amber-800">
                <strong>⚠️ 注意:</strong> 他の人のエントリは消さないでください。
                コピペしたコードの先頭の <code className="bg-amber-100 px-1 rounded">,</code> は必ず残してください（JSON の構文ルール）。
              </p>
            </div>
          </StepGuide>

          {/* Step 5 */}
          <StepGuide step={5} title="変更をコミットする">
            <p className="mb-3">
              編集が終わったら、ページ右上の「<strong>Commit changes...</strong>」ボタンをクリックします。
            </p>

            <figure className="my-4">
              <img
                src={asset('/tutorial/step5-commit-button.png')}
                alt="Commit changes... ボタン"
                className="rounded-lg border border-gray-200 max-w-full"
              />
            </figure>

            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2 mb-3">
              <p><strong className="text-[#1E293B]">Commit message:</strong> <code className="bg-white px-1.5 py-0.5 rounded">Add &lt;yourname&gt; to contributors</code>（<code className="bg-white px-1 rounded">&lt;yourname&gt;</code> は自分のハンドル名に置換）</p>
              <p><strong className="text-[#1E293B]">選択:</strong> 「Create a new branch for this commit and start a pull request」を選ぶ</p>
              <p><strong className="text-[#1E293B]">ブランチ名:</strong> <code className="bg-white px-1.5 py-0.5 rounded">add-&lt;yourname&gt;</code> のように設定（例: <code className="bg-white px-1 rounded">add-oginochihiro</code>）</p>
            </div>

            <figure className="my-4">
              <img
                src={asset('/tutorial/step5-new-branch.png')}
                alt="新しいブランチを作成する選択画面"
                className="rounded-lg border border-gray-200 max-w-full"
              />
            </figure>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm mb-3">
              <p className="text-amber-800">
                <strong>ブランチ名の注意:</strong> 半角英数字とハイフンのみ使用してください。ひらがな・漢字・空白は使えません。
              </p>
            </div>

            <p>
              「<strong>Propose changes</strong>」をクリックしてコミットを完了します。
            </p>

            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
              <p className="text-red-800">
                <strong>⚠️ Forkにコミットしただけでは反映されません！</strong><br />
                この操作で自分のForkリポジトリにコミットされますが、
                本家リポジトリには<strong>まだ反映されていません</strong>。
                次のStep 6で「Pull Request」を作成して、はじめて本家に反映のリクエストが送られます。
              </p>
            </div>

            <details className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm">
              <summary className="cursor-pointer font-medium text-[#1E293B]">
                コマンドラインで操作したい方へ
              </summary>
              <div className="mt-3 space-y-2 text-[#64748B]">
                <p>ローカルで編集した場合、以下のコマンドでコミット・プッシュします:</p>
                <CodeBlock code="git add data/contributors.json" />
                <CodeBlock code='git commit -m "Add <yourname> to contributors"' />
                <CodeBlock code="git push origin HEAD" />
              </div>
            </details>
          </StepGuide>

          {/* Step 6 */}
          <StepGuide step={6} title="元のリポジトリからPull Requestを作成する">
            <p className="mb-3">
              コミット後、<a href="https://github.com/t0k0shi/git-training-ground" className="text-[#2563EB] underline" target="_blank" rel="noopener noreferrer">元のリポジトリ（t0k0shi/git-training-ground）</a>を開いてください。
            </p>
            <p className="mb-3">
              ページ上部に黄色いバナーで「<strong>Compare & pull request</strong>」ボタンが表示されます。これをクリックしてください。
            </p>

            <figure className="my-4">
              <img
                src={asset('/tutorial/step6-compare-banner.png')}
                alt="Compare & pull request バナー"
                className="rounded-lg border border-gray-200 max-w-full"
              />
            </figure>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm mb-3">
              <p className="text-amber-800">
                <strong>⚠️ 重要:</strong> 必ず元のリポジトリ（<code className="bg-amber-100 px-1 rounded">t0k0shi/git-training-ground</code>）側から操作してください。自分のFork内で操作すると、PRの送り先が自分のForkになってしまいます。
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="text-[#64748B]">
                <strong className="text-[#1E293B]">バナーが表示されない場合は？</strong><br />
                時間が経つとバナーが消えることがあります。その場合は自分のForkページで「<strong>Contribute</strong>」→「<strong>Open pull request</strong>」をクリックするか、「<strong>Pull requests</strong>」タブ →「<strong>New pull request</strong>」→「<strong>compare across forks</strong>」から、base を <code className="bg-gray-100 px-1 rounded">t0k0shi/git-training-ground</code>、compare を自分のフォークのブランチに設定してください。
              </p>
            </div>

            <details className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm">
              <summary className="cursor-pointer font-medium text-[#1E293B]">
                コマンドラインで操作したい方へ
              </summary>
              <div className="mt-3 space-y-2 text-[#64748B]">
                <p>GitHub CLI (<a href="https://cli.github.com/" target="_blank" rel="noopener noreferrer" className="underline">gh</a>) があれば、ターミナルから PR を作成できます:</p>
                <CodeBlock code="gh pr create --repo t0k0shi/git-training-ground --title 'Add <yourname> to contributors' --body ''" />
              </div>
            </details>
          </StepGuide>

          {/* Step 7 */}
          <StepGuide step={7} title="PRの内容を確認して送信する">
            <p className="mb-3">
              「<strong>Open a pull request</strong>」画面が表示されます。base が <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">t0k0shi/git-training-ground</code> になっていることを確認してください。
            </p>

            <figure className="my-4">
              <img
                src={asset('/tutorial/step7-open-pr.png')}
                alt="Open a pull request 画面（base の確認）"
                className="rounded-lg border border-gray-200 max-w-full"
              />
            </figure>

            <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2 mb-3">
              <p><strong className="text-[#1E293B]">Title:</strong> <code className="bg-white px-1.5 py-0.5 rounded">Add &lt;yourname&gt; to contributors</code>（コミットメッセージが自動入力されます）</p>
              <p><strong className="text-[#1E293B]">Description:</strong> 空欄でもOKです</p>
            </div>
            <p>
              内容を確認して「<strong>Create pull request</strong>」をクリックしてください。
            </p>
          </StepGuide>

          {/* Step 8 */}
          <StepGuide step={8} title="CIチェックを待つ">
            <p className="mb-3">
              PRを作成すると自動テスト（CI）が実行されます。
            </p>

            <figure className="my-4">
              <img
                src={asset('/tutorial/step8-checks-tab.png')}
                alt="CI チェックの実行画面"
                className="rounded-lg border border-gray-200 max-w-full"
              />
            </figure>

            <ul className="list-disc list-inside space-y-1 text-sm mb-3">
              <li>contributors.json の形式チェック（必須フィールド・favoriteColor 形式・重複ハンドルなど）</li>
              <li>既存エントリが削除されていないかチェック</li>
              <li>1 PR で 1 エントリのみ追加しているかチェック</li>
            </ul>
            <p className="text-sm text-[#64748B]">
              すべてのチェックがパスするのを待ちましょう。もしエラーが出たら、エラーメッセージに従って修正してください。
            </p>
          </StepGuide>

          {/* Step 9 */}
          <StepGuide step={9} title="マージを待つ">
            <p>
              メンテナーがレビューし、問題なければマージされます。おめでとうございます！
            </p>
          </StepGuide>
        </div>

        {/* コンフリクト誘導リンク */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
          <p className="text-blue-800 text-sm">
            PRを出した後に「コンフリクト」と表示されたら？
          </p>
          <a
            href="#conflict-resolution"
            className="inline-block mt-2 text-[#2563EB] font-medium underline text-sm"
          >
            コンフリクトについて →
          </a>
        </div>

        {/* コンフリクト解決セクション */}
        <section id="conflict-resolution" className="mt-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-[#1E293B] mb-6">
            コンフリクトが起きたら
          </h2>

          {/* 安心メッセージ */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <p className="text-green-800 leading-relaxed">
              PRを出した後に「コンフリクトがあります」と表示されることがあります。
              これは、あなたが作業している間に他の人の変更がマージされたためです。
            </p>
            <p className="text-green-800 font-bold mt-3">
              心配しないでください！
            </p>
            <p className="text-green-800 mt-1">
              管理人がマージ時に調整しますので、そのまま待っていれば大丈夫です。
            </p>
            <p className="text-green-700 text-sm mt-3">
              「自分で直してみたい！」という方は、以下の手順を試してみてください。
              （やらなくても大丈夫です）
            </p>
          </div>

          {/* Step A */}
          <div className="mb-6 bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#1E293B] mb-3">
              <span className="text-[#2563EB] mr-2">Step A</span>
              upstream を登録する
            </h3>
            <p className="text-[#64748B] mb-3">
              fork 元のリポジトリを &quot;upstream&quot; として登録します。
            </p>
            <CodeBlock code="git remote add upstream https://github.com/t0k0shi/git-training-ground.git" />
          </div>

          {/* Step B */}
          <div className="mb-6 bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#1E293B] mb-3">
              <span className="text-[#2563EB] mr-2">Step B</span>
              upstream の最新を取得する
            </h3>
            <p className="text-[#64748B] mb-3">
              upstream の最新変更を自分のブランチに取り込みます。
            </p>
            <CodeBlock code="git fetch upstream" />
            <CodeBlock code="git merge upstream/main" />
          </div>

          {/* Step C */}
          <div className="mb-6 bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#1E293B] mb-3">
              <span className="text-[#2563EB] mr-2">Step C</span>
              コンフリクトを解決する
            </h3>
            <p className="text-[#64748B] mb-3">
              コンフリクトマーカー（<code className="bg-gray-100 px-1 rounded">{'<<<<<<<'}</code>, <code className="bg-gray-100 px-1 rounded">=======</code>, <code className="bg-gray-100 px-1 rounded">{'>>>>>>>'}</code>）を削除して、自分のエントリと他の人のエントリの両方を残します。JSON のカンマの位置にも注意してください。
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-sm mb-3">
              <p className="text-[#64748B] font-medium mb-2">変更前（コンフリクトマーカーあり）:</p>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs leading-relaxed overflow-x-auto">{`[
  {
    "name": "ketts",
    "github": "t0k0shi",
    ...
  },
<<<<<<< HEAD
  {
    "name": "自分",
    "github": "me",
    ...
  }
=======
  {
    "name": "他の人",
    "github": "you",
    ...
  }
>>>>>>> upstream/main
]`}</pre>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="text-[#64748B] font-medium mb-2">変更後（両方のエントリを残す）:</p>
              <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs leading-relaxed overflow-x-auto">{`[
  {
    "name": "ketts",
    "github": "t0k0shi",
    ...
  },
  {
    "name": "他の人",
    "github": "you",
    ...
  },
  {
    "name": "自分",
    "github": "me",
    ...
  }
]`}</pre>
            </div>
          </div>

          {/* Step D */}
          <div className="mb-6 bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#1E293B] mb-3">
              <span className="text-[#2563EB] mr-2">Step D</span>
              解決をコミットして push する
            </h3>
            <p className="text-[#64748B] mb-3">
              解決した変更をコミットして push します。
            </p>
            <CodeBlock code="git add data/contributors.json" />
            <CodeBlock code='git commit -m "resolve conflict"' />
            <CodeBlock code="git push origin HEAD" />
          </div>

          {/* まとめ */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <p className="text-blue-800">
              これでPRのコンフリクトが解決されます！
            </p>
            <p className="text-blue-700 text-sm mt-2">
              うまくいかなかった場合はコメントで質問してください。管理人がサポートします。
            </p>
          </div>
        </section>

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
