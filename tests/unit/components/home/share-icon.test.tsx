import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ShareIcon } from '@/components/ui/ShareIcon';

describe('ShareIcon', () => {
  it('スクリーンリーダーから隠された 18x18 の SVG を描画する', () => {
    const html = renderToStaticMarkup(<ShareIcon />);
    expect(html).toContain('<svg');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('width="18"');
    expect(html).toContain('height="18"');
  });

  it('文字色に追従する（stroke が currentColor）', () => {
    const html = renderToStaticMarkup(<ShareIcon />);
    expect(html).toContain('stroke="currentColor"');
  });

  it('共有アイコンの 3 つの円と 2 本の線を持つ', () => {
    const html = renderToStaticMarkup(<ShareIcon />);
    expect(html.match(/<circle/g)).toHaveLength(3);
    expect(html.match(/<line/g)).toHaveLength(2);
  });
});
