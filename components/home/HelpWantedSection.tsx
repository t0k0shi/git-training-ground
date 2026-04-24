import { SerifBubble } from '@/components/ui/SerifBubble';

const DIFF_LINES = [
  { n: 30, text: '  {' },
  { n: 31, text: '    "name": "あなたの名前",' },
  { n: 32, text: '    "github": "your-github-handle",' },
  { n: 33, text: '    "favoriteColor": "#FF5E5B",' },
  { n: 34, text: '    "favoriteEmoji": "🦊",' },
  { n: 35, text: '    "message": "よろしくです！",' },
  { n: 36, text: '    "joinedAt": "2026-04-24"' },
  { n: 37, text: '  },' },
];

export function HelpWantedSection() {
  return (
    <section
      style={{
        background: 'var(--bg)',
        padding: '80px 40px',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'center',
        }}
        className="help-wanted-grid"
      >
        <div>
          <h2
            style={{
              fontSize: 'var(--fs-section)',
              fontWeight: 800,
              color: 'var(--ink)',
              lineHeight: 1.3,
              marginBottom: '24px',
            }}
          >
            contributors.json を編集して、あなたのエントリを追加しよう。
          </h2>

          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 20px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {[
              'JSON を 1 エントリ書くだけ',
              'Pull Request を出すだけ',
              'それだけで完了！',
            ].map((item) => (
              <li
                key={item}
                style={{
                  fontSize: 'var(--fs-body)',
                  color: 'var(--ink-2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>✓</span>
                {item}
              </li>
            ))}
          </ul>

          <p
            style={{
              fontSize: 'var(--fs-body)',
              color: 'var(--muted)',
              margin: 0,
            }}
          >
            contributors.json に自分の情報を追加すると、トップページにカードが表示されます。
          </p>
        </div>

        <div>
          <div
            style={{
              background: '#0F1419',
              boxShadow: 'var(--shadow-code)',
              borderRadius: 'var(--r-lg)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ display: 'flex', gap: '6px' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#FF5F57',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#FFBD2E',
                    display: 'inline-block',
                  }}
                />
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#28C840',
                    display: 'inline-block',
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
                  fontSize: 'var(--fs-caption)',
                  color: 'var(--muted)',
                  border: '1px solid rgba(120,115,106,0.4)',
                  borderRadius: 'var(--r-pill)',
                  padding: '1px 8px',
                }}
              >
                main
              </span>
            </div>

            <div
              style={{
                padding: '16px 0',
                fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
                fontSize: 'var(--fs-mono)',
              }}
            >
              {DIFF_LINES.map((line) => (
                <div
                  key={line.n}
                  style={{
                    display: 'flex',
                    background: 'rgba(40, 200, 80, 0.15)',
                    padding: '1px 0',
                  }}
                >
                  <span
                    style={{
                      width: '36px',
                      textAlign: 'right',
                      paddingRight: '12px',
                      color: 'rgba(120,115,106,0.6)',
                      userSelect: 'none',
                      flexShrink: 0,
                    }}
                  >
                    {line.n}
                  </span>
                  <span style={{ color: '#28C840', paddingRight: '8px', flexShrink: 0 }}>+</span>
                  <span style={{ color: '#CBD5E1' }}>{line.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <SerifBubble side="right">
              面白そう🌈… でも、なんだか難しそう…？🤔
            </SerifBubble>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .help-wanted-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
