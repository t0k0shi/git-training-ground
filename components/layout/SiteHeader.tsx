'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 全ページ共通のヘッダー。app/layout.tsx で描画する
// 今のページのリンクに aria-current="page" を付ける

const linkClass =
  'text-ink-2 text-xs md:text-sm whitespace-nowrap hover:text-accent transition-colors aria-[current=page]:text-accent aria-[current=page]:font-semibold';

// trailingSlash の設定に左右されないよう、末尾のスラッシュを取り除いて比べる
function normalize(path: string): string {
  return path.replace(/\/+$/, '') || '/';
}

export function SiteHeader() {
  const current = normalize(usePathname() ?? '/');
  const ariaCurrent = (path: string) => (current === path ? 'page' : undefined);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-2 px-4 md:px-6 py-4 bg-bg/90 backdrop-blur border-b border-line">
      <Link
        href="/"
        aria-current={ariaCurrent('/')}
        className="font-mono font-bold text-ink text-xs md:text-sm tracking-tight whitespace-nowrap"
      >
        git-training-ground
      </Link>
      <div className="flex items-center gap-2.5 md:gap-4">
        <Link href="/tutorial" aria-current={ariaCurrent('/tutorial')} className={linkClass}>
          チュートリアル
        </Link>
        <Link href="/#contributors" className={linkClass}>
          参加者
        </Link>
        <a
          href="https://github.com/t0k0shi/git-training-ground"
          className="px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm rounded-pill border-2 border-ink font-semibold text-ink whitespace-nowrap hover:bg-ink hover:text-bg transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Repo
        </a>
      </div>
    </nav>
  );
}
