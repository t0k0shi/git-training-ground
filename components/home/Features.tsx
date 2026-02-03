const features = [
  {
    id: 'safe',
    icon: '🛡️',
    title: '壊れない',
    description: '練習用リポジトリなので、何をしても本番に影響しません。',
  },
  {
    id: 'quick',
    icon: '⚡',
    title: '3分で完了',
    description: 'シンプルな手順で、すぐにPRの体験ができます。',
  },
  {
    id: 'proof',
    icon: '🏆',
    title: '実績になる',
    description: 'GitHubのコントリビューション履歴に残ります。',
  },
];

export function Features() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-[#1E293B] mb-10">
          なぜ Git Training Ground？
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.id} className="text-center">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold text-[#1E293B] mb-2">{f.title}</h3>
              <p className="text-[#64748B] text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
