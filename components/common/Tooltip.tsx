import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
}

export function Tooltip({ children }: TooltipProps) {
  return (
    <div className="tooltip" role="tooltip">
      {children}
    </div>
  );
}
