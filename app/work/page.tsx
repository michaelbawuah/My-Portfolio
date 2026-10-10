import {pageMetadata} from "@/lib/seo";
import {PageFrame} from "@/components/portfolio-layout";
import {LetsWorkTogether} from "@/components/lets-work-together";
import {InteractiveProjects} from "@/components/interactive-projects";
import {BuildShowcase} from "@/components/build-showcase";
import styles from "./work-heading.module.css";

export const metadata=pageMetadata("Projects","Explore NavoX, Fluxion, ModelForge, MarketLab, ToolRet, SlopeChat, and Pro Competitive Programming: Michael Baffour Awuah’s software, AI, research, and collaborative projects.","/work");

export default function Work(){
  return (
    <PageFrame className="work-showcase-shell">
      <header className={`showcase-heading ${styles.heading}`}>
        <div className={styles.copy}>
          <p className={`eyebrow ${styles.kicker}`}>SELECTED WORK</p>
          <h1 className={styles.title}>Ideas come to <em>life.</em></h1>
          <p className={styles.description}>A closer look at the products, systems, and questions I’ve spent my time building.</p>
          <a className="work-collection-jump" href="#all-projects">Browse the full collection <span aria-hidden="true">↓</span></a>
        </div>
      </header>
      <BuildShowcase variant="work"/>
      <header className="work-collection-heading" id="all-projects">
        <h2>The full collection.</h2>
        <p>Products, systems, research, and collaborations. Find the full collection below.</p>
      </header>
      <InteractiveProjects/>
      <LetsWorkTogether/>
    </PageFrame>
  );
}
