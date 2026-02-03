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
    <div className="code-block">
      <div className="code-header">
        <span className="language">{language}</span>
        <button onClick={handleCopy} className="copy-button">
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}
