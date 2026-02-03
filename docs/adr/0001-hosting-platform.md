# ADR-0001: Hosting Platform Selection

## Status
Accepted

## Context
Git Training Ground is a static site (SSG) that needs reliable, free hosting for an OSS project. Key requirements: automatic deployment on merge, custom domain support, and good performance.

## Decision
Use **Vercel** as the hosting platform.

## Alternatives Considered
| Platform | Pros | Cons |
|----------|------|------|
| Vercel | Zero-config Next.js, free tier, preview deployments | Vendor lock-in |
| GitHub Pages | Free, built-in | No SSR support, limited build |
| AWS S3 + CloudFront | Full control | Complex setup, cost |

## Consequences
- **Positive**: Zero-config deployment, preview PRs, generous free tier
- **Negative**: Vendor lock-in to Vercel platform
- **Migration**: Can switch to any static host by changing deploy workflow
