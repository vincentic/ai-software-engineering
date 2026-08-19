import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "待办清单 | Todo List",
  description: "一个支持中英切换的待办清单应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
