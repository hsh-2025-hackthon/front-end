import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OurGo | 與親友一起規劃完美旅程",
  description: "OurGo 是協作式旅行規劃平台，讓您與朋友家人一起創建、分享和管理旅行行程。智能規劃、即時同步、預算管理，打造您的完美旅行體驗。",
  keywords: "OurGo, 旅行規劃, 行程規劃, 協作旅行, 旅遊計劃, 團體旅行",
  authors: [{ name: "OurGo Team" }],
  openGraph: {
    title: "OurGo | 與親友一起規劃完美旅程",
    description: "OurGo 是協作式旅行規劃平台，讓您與朋友家人一起創建、分享和管理旅行行程。",
    type: "website",
    locale: "zh_TW",
  },
  twitter: {
    card: "summary_large_image",
    title: "OurGo | 與親友一起規劃完美旅程",
    description: "OurGo 是協作式旅行規劃平台，讓您與朋友家人一起創建、分享和管理旅行行程。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
