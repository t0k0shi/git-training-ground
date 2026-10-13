import type { Metadata } from "next";
// フォントは app/fonts/ に置いたものを読み込む。next/font/google はビルドのたびに
// Google Fonts から数百のファイルを取得し、取得に失敗するとビルドが落ちていたため（ADR-0014）
import "./fonts/fonts.css";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "Git Training Ground - はじめてのPRを、ここで。",
  description:
    "Git Training Groundは、安全にGit/GitHub PRを練習できるプラットフォームです。",
  openGraph: {
    title: "Git Training Ground",
    description: "安全にGit/GitHub PRを練習できるプラットフォーム",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
