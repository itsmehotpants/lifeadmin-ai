import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: "LifeAdmin AI — The Operating System for Your Personal Life",
  description: "LifeAdmin AI predicts what you'll forget before you forget it. Manage tasks, bills, habits, and goals with AI-powered intelligence.",
  keywords: ["life management", "AI assistant", "task manager", "habit tracker", "bill reminders", "productivity"],
  authors: [{ name: "LifeAdmin AI" }],
  openGraph: {
    title: "LifeAdmin AI — The Operating System for Your Personal Life",
    description: "LifeAdmin AI predicts what you'll forget before you forget it.",
    type: "website",
    siteName: "LifeAdmin AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "LifeAdmin AI",
    description: "The operating system for your personal life",
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
