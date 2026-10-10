import {pageMetadata} from "@/lib/seo";
import {PageFrame} from "@/components/portfolio-layout";
import {LetsWorkTogether} from "@/components/lets-work-together";
import {InteractiveProjects} from "@/components/interactive-projects";
import styles from "./work-heading.module.css";

export const metadata=pageMetadata("Projects","Explore NavoX, Fluxion, Gatehaven, ModelForge, MarketLab, ToolRet, SlopeChat, and Pro Competitive Programming: Michael Baffour Awuah’s software, AI, research, and collaborative projects.","/work");

export default function Work(){
  return (
    <PageFrame className="work-showcase-shell">
      <header className={`showcase-heading ${styles.heading}`}>
        <div className={styles.copy}>
          <p className={`eyebrow ${styles.kicker}`}>SELECTED WORK</p>
          <h1 className={styles.title}>Ideas come to <em>life.</em></h1>
          <p className={styles.description}>A closer look at the products, systems, and questions I’ve spent my time building.</p>
        </div>
      </header>
      <InteractiveProjects/>
      <LetsWorkTogether/>
    </PageFrame>
  );
}
