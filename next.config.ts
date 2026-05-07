import type { NextConfig } from "next";

// GitHub Pages デプロイ判定用の環境変数。
// 旧名 'GITHUB_PAGES' は GitHub Actions 内の予約名 (将来的な衝突可能性) のため、
// 'NEXT_PUBLIC_GITHUB_PAGES' に統一 (CodeRabbit 指摘 PR #30 対応)。
const isGitHubPages = process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/git-training-ground" : "";

// lib/asset.ts が参照する環境変数を build 時にも inline で設定
// （NEXT_PUBLIC_ prefix で client/server 双方から参照可能）
process.env.NEXT_PUBLIC_BASE_PATH = basePath;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
