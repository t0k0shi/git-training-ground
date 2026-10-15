'use client';

import { useCallback, useState } from 'react';

interface AvatarProps {
  /** アバターの URL。null なら何も描画しない */
  src: string | null;
  /** 表示名（name）。GitHub のユーザー名は渡さない */
  alt: string;
  size: number;
  className?: string;
  style?: React.CSSProperties;
  /** アバターを出せない（src が null・読み込みに失敗）ときに、代わりに描画するもの。省略すると何も描画しない */
  fallback?: React.ReactNode;
}

// 読み込めない画像は、壊れた画像の枠や alt の文字を出さずに消す。
// JavaScript が動く前に読み込みに失敗すると onError が呼ばれないので、img が DOM に付いたときにも読み込みの結果を確かめる
export function Avatar({ src, alt, size, className, style, fallback = null }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  // img が DOM に付いた時点で、すでに読み込みに失敗していないかを確かめる
  const checkLoaded = useCallback((img: HTMLImageElement | null) => {
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (!src || failed) return <>{fallback}</>;

  return (
    <img
      ref={checkLoaded}
      src={src}
      alt={alt}
      loading="lazy"
      width={size}
      height={size}
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}
