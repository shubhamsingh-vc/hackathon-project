import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ContentCraft — AI Content Generator",
  description:
    "Generate viral hooks, captions, hashtags, and scripts for Instagram, YouTube, and TikTok in seconds. Powered by Claude Sonnet 4.6.",
  keywords: [
    "content generator", "social media", "AI writing", "Instagram",
    "YouTube", "TikTok", "hooks", "captions", "hashtags", "video scripts",
  ],
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
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`} data-scroll-behavior="smooth">
      <body className="antialiased min-h-screen flex flex-col relative">
        {/* Ambient background orbs */}
        <div className="bg-orbs" aria-hidden="true" />
        {/* Grain texture */}
        <div className="grain" aria-hidden="true" />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
