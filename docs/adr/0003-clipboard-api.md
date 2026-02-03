# ADR-0003: Code Copy Feature Implementation

## Status
Accepted

## Context
Tutorial page CodeBlock needs a copy-to-clipboard feature. Target audience uses modern browsers.

## Decision
Use **native Clipboard API** (`navigator.clipboard.writeText`) without fallback.

## Alternatives Considered
| Approach | Pros | Cons |
|----------|------|------|
| Clipboard API | Native, no deps | No IE11 support |
| react-copy-to-clipboard | Easy, cross-browser | Extra dependency |
| execCommand('copy') | Legacy support | Deprecated |

## Consequences
- **Positive**: Zero dependencies, standard API
- **Negative**: Not supported on IE11 and older browsers
- **Browser Support**: Chrome 66+, Safari 13.1+, Firefox 63+, Edge 79+
