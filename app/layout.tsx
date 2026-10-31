import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./interactions.css";
import "./immersive.css";
import "./themes.css";
import "./activity.css";
import "./reading.css";
import "./competitive-programming.css";
import "lenis/dist/lenis.css";
import "./motion.css";
import "./glass.css";
import "@/components/glass-carousel/fonts.css";
import "@/components/glass-carousel/tokens.css";
import "@/components/glass-carousel/orb.css";
import "@/components/glass-carousel/liquid-button.css";
import "@/components/glass-carousel/glass-carousel.css";
import "@/components/glass-carousel/accent.css";
import "@/components/glass-carousel/pour.css";
import GooFilter from "@/components/glass-carousel/GooFilter";
import {PortfolioTheme} from "@/components/portfolio-theme";
import {GlobalKeyboardScene} from "@/components/global-keyboard-scene";

export const viewport: Viewport = { themeColor: "#060a12" };

export const metadata: Metadata = {
  title: { default: "Michael Baffour Awuah | Software Engineer & AI Systems", template: "%s | Michael Baffour Awuah" },
  description: "Michael Baffour Awuah's engineering portfolio: AI assistants, deep learning frameworks, C++ trading systems, autonomous aircraft imaging, and model deployment infrastructure. Cornell Engineering · ECE 2028.",
  metadataBase: new URL("https://michaelbaffourawuah.com"),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", title: "Michael Baffour Awuah | Software & AI Systems", description: "Engineering intelligent software and dependable systems. Explore Michael Baffour Awuah's software engineering experience, quantitative research, and Cornell projects.", url: "https://michaelbaffourawuah.com", siteName: "MBA~Steins — Michael Baffour Awuah" },
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
      <body className="antialiased"><div className="page-aurora" aria-hidden="true"/><GooFilter /><PortfolioTheme><GlobalKeyboardScene/>{children}</PortfolioTheme></body>
    </html>
  );
}
