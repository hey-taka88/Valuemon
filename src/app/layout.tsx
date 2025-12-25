import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "Shadow Lantern - 影から価値観を召喚する",
  description: "負の感情から本当の価値観を発見し、モンスターとして育てる心理学ベースの行動変容アプリ",
  keywords: ["価値観", "自己分析", "心理学", "行動変容", "ゲーミフィケーション"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

