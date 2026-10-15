import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Avatar } from '@/components/home/Avatar';

const URL = 'https://avatars.githubusercontent.com/u/3?s=80';

describe('Avatar', () => {
  it('src が null なら何も描画しない', () => {
    const { container } = render(<Avatar src={null} alt="ketts" size={40} />);
    expect(container.innerHTML).toBe('');
  });

  it('alt に渡した名前（name）を使う', () => {
    render(<Avatar src={URL} alt="ketts" size={40} />);
    const img = screen.getByAltText('ketts') as HTMLImageElement;
    expect(img.src).toBe(URL);
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.width).toBe(40);
  });

  it('読み込みに失敗したら、img を消す（壊れた画像の枠と alt の文字を出さない）', () => {
    const { container } = render(<Avatar src={URL} alt="ketts" size={40} />);
    fireEvent.error(screen.getByAltText('ketts'));
    expect(container.querySelector('img')).toBeNull();
  });

  it('JavaScript が動く前に読み込みに失敗していた画像も、描画後に消す', () => {
    // complete かつ naturalWidth が 0 = 読み込みに失敗した画像（onError はもう呼ばれない）
    const complete = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'complete');
    const naturalWidth = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'naturalWidth');
    Object.defineProperty(HTMLImageElement.prototype, 'complete', { configurable: true, get: () => true });
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', { configurable: true, get: () => 0 });
    try {
      const { container } = render(<Avatar src={URL} alt="ketts" size={40} />);
      expect(container.querySelector('img')).toBeNull();
    } finally {
      if (complete) Object.defineProperty(HTMLImageElement.prototype, 'complete', complete);
      if (naturalWidth) Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', naturalWidth);
    }
  });

  it('読み込み済みの画像（naturalWidth > 0）は消さない', () => {
    const complete = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'complete');
    const naturalWidth = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'naturalWidth');
    Object.defineProperty(HTMLImageElement.prototype, 'complete', { configurable: true, get: () => true });
    Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', { configurable: true, get: () => 80 });
    try {
      render(<Avatar src={URL} alt="ketts" size={40} />);
      expect(screen.getByAltText('ketts')).toBeInTheDocument();
    } finally {
      if (complete) Object.defineProperty(HTMLImageElement.prototype, 'complete', complete);
      if (naturalWidth) Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', naturalWidth);
    }
  });
});
