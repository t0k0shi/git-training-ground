export function HowItWorks() {
  const steps = [
    { id: 'fork', icon: '🍴', title: 'Fork してクローン', description: 'リポジトリをフォークし、ローカルに clone します。' },
    { id: 'add', icon: '✏️', title: '絵文字を追加', description: 'emojis.txt に好きな絵文字を追加します。' },
    { id: 'pr', icon: '🚀', title: 'PR を作成', description: 'プルリクエストを作成し、マージを待ちます。' },
  ];
  return (
    <section className="py-16 px-4 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-[#1E293B] mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.id} className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2563EB] text-white text-sm font-bold mb-3">
                {i + 1}
              </div>
              <div className="text-3xl mb-2">{step.icon}</div>
              <h3 className="text-lg font-semibold text-[#1E293B] mb-1">{step.title}</h3>
              <p className="text-[#64748B] text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
