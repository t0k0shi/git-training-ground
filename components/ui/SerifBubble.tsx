interface SerifBubbleProps {
  side: 'left' | 'right';
  children: React.ReactNode;
}

export function SerifBubble({ side, children }: SerifBubbleProps) {
  const tailLeft: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '-10px',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
    borderRight: '10px solid var(--line)',
  };

  const tailRight: React.CSSProperties = {
    content: '""',
    position: 'absolute',
    top: '50%',
    right: '-10px',
    transform: 'translateY(-50%)',
    width: 0,
    height: 0,
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
    borderLeft: '10px solid var(--line)',
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {side === 'left' && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '-10px',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: '10px solid var(--line)',
          }}
        />
      )}
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
      {side === 'right' && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            right: '-10px',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: '10px solid var(--line)',
          }}
        />
      )}
    </div>
  );
}
