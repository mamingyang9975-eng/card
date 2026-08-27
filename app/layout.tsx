import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ARCANA — 卡牌选择',
  description: '一个轻量、专注的卡牌选择与使用原型。',
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
