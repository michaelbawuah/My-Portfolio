import { pageMetadata } from "@/lib/seo";
import { PageFrame, PageTitle } from "@/components/portfolio-layout";
import { SocialProfileLinks } from "@/components/personal-story";
import { ContactLinks } from "@/components/portfolio-interactions";
import { ContactComposer } from "@/components/contact-composer";
export const metadata=pageMetadata("Contact","Connect with Michael Baffour Awuah for software engineering, AI/ML opportunities, or technical collaboration.","/contact");
export default function Contact(){return <PageFrame className="contact-shell"><div className="contact-studio" data-keyboard-scene="contact"><div className="contact-studio-intro"><PageTitle kicker="START A CONVERSATION" title={<>A good idea<br/>starts with <em>hello.</em></>} description="Software engineering, AI/ML, or something we haven’t imagined yet. Let’s talk."/><div className="contact-scene-window" data-keyboard-window aria-hidden="true"/></div><div className="contact-studio-panel"><ContactComposer/><div className="contact-direct"><ContactLinks/><SocialProfileLinks compact/></div></div></div><div className="contact-projects"><span className="mono">BEFORE YOU GO</span><a href="/work">Explore my projects</a><a href="/research">Read my research</a></div></PageFrame>;}
