'use client';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'コンフリクトが起きた場合は？',
    answer: '最新のmainブランチからブランチを作り直し、再度PRを作成してください。',
  },
  {
    question: 'CIチェックが失敗した場合は？',
    answer: 'エラーメッセージを確認し、contributors.jsonの形式を修正してください。',
  },
  {
    question: 'PRがマージされない場合は？',
    answer: 'レビューコメントを確認し、必要な修正を行ってから再度プッシュしてください。',
  },
  {
    question: 'Gitをインストールしていません',
    answer: 'git-scm.com からダウンロードできます。インストール後、ターミナルで git --version を実行して確認してください。',
  },
  {
    question: 'GitHubアカウントが必要ですか？',
    answer: 'はい。github.com で無料アカウントを作成してください。',
  },
  {
    question: 'Forkって何ですか？',
    answer: 'リポジトリの個人コピーを作ることです。元のリポジトリに影響しません。',
  },
  {
    question: 'prNumberは何を書けばいいですか？',
    answer: '0のままでOKです。マージ時にメンテナーが更新します。',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-[#1E293B] mb-6">よくある質問</h2>
      <div className="space-y-3">
        {faqData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              className="w-full text-left px-6 py-4 font-medium text-[#1E293B] hover:bg-gray-50 transition-colors flex items-center justify-between"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              <span>{item.question}</span>
              <span className={`ml-2 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-[#64748B] leading-relaxed">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
