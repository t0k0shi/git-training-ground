export function HowItWorks() {
  const steps = [
    { id: 'fork', icon: '🍴', title: 'Fork してクローン', description: 'リポジトリをフォークし、ローカルに clone します。' },
    { id: 'add', icon: '✏️', title: '情報を追加', description: 'contributors.json に自分の情報を追加します。' },
    { id: 'pr', icon: '🚀', title: 'PR を作成', description: 'プルリクエストを作成し、マージを待ちます。' },
  ];
  return (
    <section className="how-it-works-section">
      <h2>How It Works</h2>
      <div className="steps-grid">
        {steps.map((step) => (
          <div key={step.id} className="step-item">
            <div className="step-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
