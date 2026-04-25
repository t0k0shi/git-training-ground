'use client';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'bash' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-ink/20 my-3">
      <div className="flex items-center justify-between bg-ink-2 px-4 py-2">
        <span className="text-xs text-bg-2 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-bg-2 hover:text-paper transition-colors px-2 py-1 rounded hover:bg-ink"
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>
      <pre className="bg-ink text-bg p-4 overflow-x-auto text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
