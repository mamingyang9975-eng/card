import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ARCANA — 感知与探索',
  description: '在安全的强度里，用卡牌靠近感受、关系与真实需要。',
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
