const TILES = [
  {
    n: '01',
    title: '失敗 OK',
    body: 'マージされなくても大丈夫。まず出してみることが大事。',
  },
  {
    n: '02',
    title: '小さく',
    body: 'ファイル 1 つ編集するだけ。まずここから始めよう。',
  },
  {
    n: '03',
    title: 'みんなで',
    body: '世界中の人が練習している。あなただけじゃない。',
  },
];

export function ConceptSection() {
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
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
            fontSize: 'var(--fs-caption)',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--r-pill)',
            padding: '2px 12px',
            marginBottom: '20px',
          }}
        >
          concept
        </span>

        <h2
          style={{
            fontSize: 'var(--fs-section)',
            fontWeight: 800,
            color: 'var(--ink)',
            lineHeight: 1.3,
            marginBottom: '16px',
          }}
        >
          共同作業を実践して、Git に &ldquo;カラダ&rdquo; で慣れる。
        </h2>

        <p
          style={{
            fontSize: 'var(--fs-body)',
            color: 'var(--ink-2)',
            maxWidth: '640px',
            marginBottom: '48px',
            wordBreak: 'auto-phrase',
            lineBreak: 'strict',
          }}
        >
          「一人でコマンドを打つ練習」ではなく、「リアルな OSS フロー（fork → clone → branch → PR）」を体感する場所です。
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
          }}
          className="concept-tiles"
        >
          {TILES.map((tile) => (
            <div
              key={tile.n}
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                boxShadow: 'var(--shadow-card)',
                borderRadius: 'var(--r-lg)',
                padding: '24px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), ui-monospace, monospace',
                  fontSize: 'var(--fs-caption)',
                  color: 'var(--muted)',
                  marginBottom: '8px',
                }}
              >
                {tile.n}
              </div>
              <div
                style={{
                  fontSize: 'var(--fs-tile)',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: '8px',
                }}
              >
                {tile.title}
              </div>
              <p
                style={{
                  fontSize: 'var(--fs-body)',
                  color: 'var(--ink-2)',
                  margin: 0,
                }}
              >
                {tile.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .concept-tiles {
            grid-template-columns: 1fr !important;
          }
          section {
            padding: 60px 20px !important;
          }
        }
      `}</style>
    </section>
  );
}
