import type { Metadata } from "next";
import { PageFrame, PageTitle } from "@/components/portfolio-layout";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page does not exist. Explore Michael Baffour Awuah’s projects or return to the homepage.",
  alternates: { canonical: null },
  robots: { index: false, follow: false },
  openGraph: null,
  twitter: null,
};

export default function NotFound(){return <PageFrame><PageTitle kicker="PAGE NOT FOUND" title={<>Let’s get you<br/><em>back on track.</em></>} description="This page doesn’t exist. Open my projects or return to the homepage."/><div className="hero-actions"><a href="/" className="button-primary">Return home</a><a href="/work" className="button-secondary">Explore projects</a></div></PageFrame>;}
