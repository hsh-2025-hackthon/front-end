import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "OurGo | 與朋友家人一起規劃完美旅程",
  description: "OurGo 讓旅行規劃變得簡單有趣！與朋友家人協作創建、分享和管理您的旅行行程。即時同步，輕鬆分帳，讓每一次旅行都成為美好回憶。",
  keywords: "旅行規劃, 行程安排, 協作旅行, 多人旅遊, 分帳, OurGo",
  authors: [{ name: "OurGo Team" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
