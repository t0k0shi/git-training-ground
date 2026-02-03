import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tooltip } from '@/components/common/Tooltip';

describe('Tooltip', () => {
  it('children を正しくレンダリングする', () => {
    render(
      <Tooltip>
        <span>Test content</span>
      </Tooltip>
    );
    const content = screen.getByText('Test content');
    expect(content).toBeInTheDocument();
  });

  it('role="tooltip" を持つ', () => {
    render(
      <Tooltip>
        <span>Test content</span>
      </Tooltip>
    );
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
  });
});
