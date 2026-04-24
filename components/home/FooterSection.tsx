'use client';

interface FooterSectionProps {
  count: number;
}

const DOMO_ARIGATO = ['D', 'O', 'M', 'O', '・', 'A', 'R', 'I', 'G', 'A', 'T', 'O', ' ', '!', '!'];

export function FooterSection({ count }: FooterSectionProps) {
  return (
    <footer
      className="relative overflow-hidden text-ink"
      style={{
        padding: '100px 40px 60px',
        background:
          'linear-gradient(to bottom, var(--bg) 0%, var(--bg-2) 100%)',
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--ink) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-[1120px] mx-auto flex flex-col items-center gap-12">
        <div
          className="flex flex-col items-center justify-center rounded-full border-2 border-ink bg-paper"
          style={{
            width: 132,
            height: 132,
            boxShadow: '3px 3px 0 var(--accent)',
            transform: 'rotate(-6deg)',
          }}
        >
          <span className="font-mono font-bold text-2xl leading-none">
            {count}
          </span>
          <span className="font-mono text-xs text-muted mt-1">
            人が参加中
          </span>
        </div>

        <h2
          className="font-black tracking-tight text-center leading-none"
          style={{ fontSize: '8vw' }}
          aria-label="DOMO ARIGATO!!"
        >
          {DOMO_ARIGATO.map((char, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                color: i % 2 === 1 ? 'var(--accent)' : 'var(--ink)',
                animation: 'bounce-char 3s ease-in-out infinite',
                animationDelay: `${i * 100}ms`,
              }}
              aria-hidden="true"
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </h2>

        <div className="text-center max-w-2xl">
          <p className="text-ink-2 leading-loose">
            練習場を使ってくれて、本当にありがとう。
          </p>
          <p className="text-ink-2 leading-loose">
            あなたの first PR が、きっと誰かの背中を押します。
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/tutorial"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-accent text-paper font-bold shadow-card hover:-translate-y-0.5 transition-transform"
          >
            いますぐ参加する
            <span aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.share) {
                navigator
                  .share({
                    title: 'git-training-ground',
                    url: typeof window !== 'undefined' ? window.location.href : '',
                  })
                  .catch(() => { });
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-pill border-2 border-ink font-semibold text-ink hover:bg-ink hover:text-bg transition-colors"
          >
            このページをシェア
          </button>
        </div>

        <div className="w-full pt-10 border-t border-line flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted font-mono">
          <p>© 2026 git-training-ground</p>
          <p>Licensed under MIT</p>
          <p>Made with 🍵 &amp; ☕</p>
        </div>
      </div>
    </footer>
  );
}
