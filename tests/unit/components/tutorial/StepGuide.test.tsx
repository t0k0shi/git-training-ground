import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StepGuide } from '@/components/tutorial/StepGuide';

describe('StepGuide', () => {
  it('step番号とtitleが表示される', () => {
    render(
      <StepGuide step={1} title="テストタイトル">
        <p>テストコンテンツ</p>
      </StepGuide>
    );

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('テストタイトル')).toBeInTheDocument();
  });

  it('childrenが正しくレンダリングされる', () => {
    render(
      <StepGuide step={2} title="タイトル">
        <p>これは子要素です</p>
        <span>複数の要素</span>
      </StepGuide>
    );

    expect(screen.getByText('これは子要素です')).toBeInTheDocument();
    expect(screen.getByText('複数の要素')).toBeInTheDocument();
  });
});
