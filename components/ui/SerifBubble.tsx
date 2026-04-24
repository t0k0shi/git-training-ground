interface SerifBubbleProps {
  side: 'left' | 'right';
  children: React.ReactNode;
}

const TAIL_BASE: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 0,
  height: 0,
  borderTop: '8px solid transparent',
  borderBottom: '8px solid transparent',
};

const TAIL_LEFT: React.CSSProperties = {
  ...TAIL_BASE,
  left: '-10px',
  borderRight: '10px solid var(--line)',
};

const TAIL_RIGHT: React.CSSProperties = {
  ...TAIL_BASE,
  right: '-10px',
  borderLeft: '10px solid var(--line)',
};

export function SerifBubble({ side, children }: SerifBubbleProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {side === 'left' && <span aria-hidden="true" style={TAIL_LEFT} />}
      <div
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--line)',
          borderRadius: 'var(--r-xl)',
          padding: '12px 18px',
          fontSize: '14px',
          color: 'var(--ink-2)',
          position: 'relative',
        }}
      >
        {children}
      </div>
      {side === 'right' && <span aria-hidden="true" style={TAIL_RIGHT} />}
    </div>
  );
}
