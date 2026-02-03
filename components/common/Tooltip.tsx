import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
}

export function Tooltip({ children }: TooltipProps) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1E293B] text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap z-10" role="tooltip">
      {children}
    </div>
  );
}
