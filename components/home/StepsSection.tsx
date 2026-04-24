import { SerifBubble } from '@/components/ui/SerifBubble';

const STEPS = [
  { n: 1, emoji: '🍴', title: 'プロジェクトをフォーク',    hint: 'Fork',   cmd: 'GitHub: Fork ボタン' },
  { n: 2, emoji: '📥', title: 'ローカルにクローン',         hint: 'Clone',  cmd: 'git clone <repo-url>' },
  { n: 3, emoji: '🌿', title: 'ブランチを作成',             hint: 'Branch', cmd: 'git checkout -b add-my-entry' },
  { n: 4, emoji: '✏️', title: 'contributors.json を編集',  hint: 'Edit',   cmd: 'エディタで data/contributors.json を開く' },
  { n: 5, emoji: '💾', title: '変更をコミット',             hint: 'Commit', cmd: 'git add data/contributors.json && git commit -m "Add my entry"' },
  { n: 6, emoji: '🚀', title: 'プッシュ',                   hint: 'Push',   cmd: 'git push origin add-my-entry' },
  { n: 7, emoji: '📬', title: 'プルリクエストを作成',        hint: 'PR',     cmd: 'GitHub: Compare & pull request' },
  { n: 8, emoji: '👀', title: 'レビューに対応してマージ',    hint: 'Review', cmd: 'コメントに返信してマージ完了！' },
];

export function StepsSection() {
  return (
    <section
      style={{
        background: 'var(--bg)',
        padding: '80px 40px',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <svg
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            width: '40px',
            height: '100%',
            pointerEvents: 'none',
          }}
          preserveAspectRatio="none"
        >
          <path
            d="M20 0 C 32 200, 8 360, 20 560 S 32 900, 20 1100 S 8 1500, 20 1800"
            stroke="var(--ink)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="2 6"
            opacity="0.35"
          />
        </svg>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {STEPS.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={step.n}
                className="step-row"
                style={{
                  display: 'flex',
                  justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  marginBottom: '40px',
                }}
              >
                <div
                  style={{
                    width: '45%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isLeft ? 'flex-start' : 'flex-end',
                    gap: '8px',
                  }}
                  className="step-content"
                >
                  <div
                    className="step-node"
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      background: 'var(--paper)',
                      border: '2px solid var(--accent)',
                      boxShadow: 'var(--shadow-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '36px',
                      flexShrink: 0,
                    }}
                  >
                    {step.emoji}
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
                      fontSize: 'var(--fs-caption)',
                      color: 'var(--muted)',
                    }}
                  >
                    STEP {String(step.n).padStart(2, '0')}
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
                      fontSize: 'var(--fs-caption)',
                      color: 'var(--accent)',
                      border: '1px solid var(--accent)',
                      borderRadius: 'var(--r-pill)',
                      padding: '2px 10px',
                    }}
                  >
                    {step.hint}
                  </span>

                  <div
                    style={{
                      fontSize: 'var(--fs-step)',
                      fontWeight: 800,
                      color: 'var(--ink)',
                    }}
                  >
                    {step.title}
                  </div>

                  <code
                    style={{
                      background: 'var(--ink)',
                      color: 'var(--bg)',
                      padding: '2px 8px',
                      fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
                      fontSize: '11px',
                      borderRadius: '4px',
                    }}
                  >
                    {step.cmd}
                  </code>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            marginTop: '16px',
          }}
        >
          <a
            href="/tutorial"
            style={{
              display: 'inline-block',
              border: '2px solid var(--ink)',
              borderRadius: 'var(--r-pill)',
              padding: '12px 32px',
              fontSize: 'var(--fs-body)',
              fontWeight: 600,
              color: 'var(--ink)',
              textDecoration: 'none',
              background: 'transparent',
            }}
          >
            README で詳しく見る
          </a>

          <SerifBubble side="left">
            思ったより簡単だった…！✨ さっそく PR 投げてみる💨
          </SerifBubble>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .step-row {
            justify-content: flex-start !important;
          }
          .step-content {
            width: 100% !important;
            align-items: flex-start !important;
          }
          .step-node {
            width: 56px !important;
            height: 56px !important;
            font-size: 26px !important;
          }
        }
      `}</style>
    </section>
  );
}
