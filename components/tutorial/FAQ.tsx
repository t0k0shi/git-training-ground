'use client';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'GitHubアカウントが必要ですか？',
    answer: 'はい。github.com で無料アカウントを作成してください。',
  },
  {
    question: 'Forkって何ですか？',
    answer: 'リポジトリの個人コピーを作ることです。元のリポジトリに影響しません。',
  },
  {
    question: 'CIチェックが失敗した場合は？',
    answer: 'エラーメッセージを確認し、data/contributors.json の形式を修正してください。Forkしたリポジトリで該当ファイルを再度編集してコミットすると、PRに反映されます。',
  },
  {
    question: 'PRがマージされない場合は？',
    answer: 'レビューコメントを確認し、必要な修正を行ってください。CodeRabbit からの自動レビュー（日本語）も参考になります。',
  },
  {
    question: 'コンフリクトが起きた場合は？',
    answer: '他の人のPRがマージされると起きることがあります。本ページ下部の「コンフリクトが起きたら」セクションの手順に従うか、そのまま待てば管理人が調整します。',
  },
  {
    question: 'コマンドラインでやりたい場合は？',
    answer: '各ステップの下部にある「コマンドラインで操作したい方へ」の折りたたみを開いてください。git clone からの流れで操作できます。',
  },
  {
    question: '「JSONの形式が不正」というエラーが出た',
    answer: 'カンマの位置・クオートの閉じ忘れ・波括弧の対応を確認してください。先頭にカンマを付けてコピペする方式を使うと、多くの構文ミスを防げます。',
  },
  {
    question: '「他のエントリが削除されています」エラーが出た',
    answer: '他の人のエントリを消さないでください。配列の最後に自分のエントリを追加するだけにしてください。',
  },
  {
    question: 'favoriteColor はどんな色を入れればいい？',
    answer: '#RRGGBB 形式の 16 進数カラーコード（例: #FF5E5B）を入力してください。NIPPON COLORS や原色大辞典などのサイトから選べます。',
  },
  {
    question: 'favoriteEmoji に複数の絵文字を入れたい',
    answer: '1 つだけ入れてください（ZWJ シーケンスなど「見た目 1 文字」の絵文字は OK）。複数は CV-08 のバリデーションで弾かれます。',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-ink mb-6">よくある質問</h2>
      <div className="space-y-3">
        {faqData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              className="w-full text-left px-6 py-4 font-medium text-ink hover:bg-bg-2 transition-colors flex items-center justify-between"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              <span>{item.question}</span>
              <span className={`ml-2 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-ink-2 leading-relaxed">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
