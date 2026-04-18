import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: "LifeAdmin AI — The Operating System for Your Personal Life",
  description: "LifeAdmin AI predicts what you'll forget before you forget it. Manage tasks, bills, habits, and goals with AI-powered intelligence.",
  keywords: ["life management", "AI assistant", "task manager", "habit tracker", "bill reminders", "productivity", "consequence engine"],
  authors: [{ name: "LifeAdmin AI Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#6366f1",
  openGraph: {
    title: "LifeAdmin AI — The Operating System for Your Personal Life",
    description: "Predict what you'll forget before you forget it. The only life admin tool with a consequence engine.",
    type: "website",
    siteName: "LifeAdmin AI",
    locale: "en_IN",
    url: "https://lifeadmin.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeAdmin AI",
    description: "The operating system for your personal life. AI-powered tasks, habits and finance.",
    creator: "@lifeadmin_ai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
