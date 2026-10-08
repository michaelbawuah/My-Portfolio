import {pageMetadata} from "@/lib/seo";
import {PageFrame} from "@/components/portfolio-layout";
import {LetsWorkTogether} from "@/components/lets-work-together";
import {InteractiveProjects} from "@/components/interactive-projects";
export const metadata=pageMetadata("Projects","Explore NavoX, Fluxion, ModelForge, MarketLab, ToolRet, SlopeChat, and Pro Competitive Programming: Michael Baffour Awuah’s software, AI, research, and collaborative projects.","/work");
export default function Work(){return <PageFrame className="work-showcase-shell"><header className="showcase-heading"><p className="eyebrow">SELECTED WORK</p><h1>Ideas come to <em>life.</em></h1><p>A closer look at the products, systems, and questions I’ve spent my time building.</p></header><InteractiveProjects/><LetsWorkTogether/></PageFrame>;}
