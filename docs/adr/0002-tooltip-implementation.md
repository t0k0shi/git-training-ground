# ADR-0002: Tooltip Implementation Strategy

## Status
Accepted

## Context
EmojiCard needs hover tooltips to show contributor name and message. Options range from CSS-only to full UI library.

## Decision
Use **custom implementation** with CSS + React useState.

## Alternatives Considered
| Approach | Pros | Cons |
|----------|------|------|
| Custom (CSS + state) | Lightweight, no deps | Minimal a11y |
| Radix UI | Full a11y, robust | Bundle size overhead |
| Floating UI | Precise positioning | Complex API |

## Consequences
- **Positive**: Zero additional dependencies, simple implementation
- **Negative**: Basic accessibility (role="tooltip" only)
- **Migration Path**: If a11y requirements increase, migrate to Radix UI Tooltip
