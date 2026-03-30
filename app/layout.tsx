import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ContentCraft — AI Content Generator",
  description: "Generate viral hooks, captions, hashtags, and scripts for Instagram, YouTube, and TikTok in seconds.",
  keywords: ["content generator", "social media", "AI writing", "Instagram", "YouTube", "TikTok", "hooks", "captions", "hashtags"],
  openGraph: {
    title: "ContentCraft — AI Content Generator",
    description: "Generate viral hooks, captions, hashtags, and scripts in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
