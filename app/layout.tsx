import type { Metadata } from "next";
import "./globals.css";
import "./interactions.css";
import "./immersive.css";
import "./themes.css";
import "./activity.css";
import "./reading.css";
import "./competitive-programming.css";
import "lenis/dist/lenis.css";
import "./motion.css";
import {PortfolioTheme} from "@/components/portfolio-theme";
import {GlobalKeyboardScene} from "@/components/global-keyboard-scene";

export const metadata: Metadata = {
  title: { default: "Michael Baffour Awuah | Software Engineer & AI Systems", template: "%s | Michael Baffour Awuah" },
  description: "Michael Baffour Awuah's engineering portfolio: AI assistants, deep learning frameworks, reproducible financial software, and model deployment systems. Cornell Engineering.",
  metadataBase: new URL("https://michaelbaffourawuah.com"),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", title: "Michael Baffour Awuah | Software & AI Systems", description: "Engineering intelligent software and dependable systems. Explore Michael Baffour Awuah's projects, research, and Cornell background.", url: "https://michaelbaffourawuah.com", siteName: "MBA~Steins — Michael Baffour Awuah" },
  twitter: { card: "summary", title: "Michael Baffour Awuah | Software & AI Systems", description: "AI assistants, deep learning systems, and reproducible research. Cornell Engineering." },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased"><PortfolioTheme><GlobalKeyboardScene/>{children}</PortfolioTheme></body>
    </html>
  );
}
