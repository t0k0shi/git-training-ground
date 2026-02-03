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
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="faq-section">
      <h2>よくある質問</h2>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              {item.question}
            </button>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
