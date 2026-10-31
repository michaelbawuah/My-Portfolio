import { PageFrame } from "@/components/portfolio-layout";
import { HeroExperience } from "@/components/hero-experience";
import { socialProfiles } from "@/lib/personal";
import { person } from "@/lib/portfolio";
import { ActivityHighlights } from "@/components/activity-highlights";
import { LedgerHomeFeature } from "@/components/ledger-home-feature";
import { ProjectCarousel } from "@/components/glass/project-carousel";
import { LiquidButton } from "@/components/glass/liquid-button";
import { ProjectOrbit } from "@/components/project-orbit";
import { showcaseProjects } from "@/lib/project-showcase";
import { ArrowUpRight, Orbit } from "lucide-react";
export default function Home(){
 const schema={"@context":"https://schema.org","@type":"ProfilePage",mainEntity:{"@type":"Person","@id":`${person.origin}/#person`,name:person.name,alternateName:"MBA~Steins",url:person.origin,image:`${person.origin}/personal/michael-landing-atrium.webp`,description:"Electrical & Computer Engineering undergraduate at Cornell University building software, AI, and distributed systems.",affiliation:{"@type":"CollegeOrUniversity",name:"Cornell University"},sameAs:[person.github,person.linkedin,socialProfiles.tiktok,socialProfiles.instagram],knowsAbout:["Software engineering","Machine learning","Distributed systems","Computer engineering"]}};
 const carouselProjects=showcaseProjects.map(({slug,name,summary,description,category,image,imageAlt,stack})=>({slug,name,summary,description,category,image,imageAlt,stack}));
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/><PageFrame className="home-shell">
  <HeroExperience projectCount={showcaseProjects.length} categoryCount={new Set(showcaseProjects.map(project=>project.category)).size}/>
  <section id="selected-work" className="glass-selected-work" aria-labelledby="selected-work-title"><div className="glass-section-heading"><div><span className="mono">SELECTED WORK / {String(showcaseProjects.length).padStart(2,"0")} CASE STUDIES</span><h2 id="selected-work-title">A few ideas.<br/><em>A lot of engineering.</em></h2></div><LiquidButton href="/work" variant="secondary" icon={<ArrowUpRight size={17} aria-hidden="true"/>}>Browse all work</LiquidButton></div><ProjectCarousel projects={carouselProjects}/></section>
  <details className="glass-orbit-disclosure"><summary><span><Orbit size={20} aria-hidden="true"/> Another way to explore</span><span>Open the project orbit <ArrowUpRight size={16} aria-hidden="true"/></span></summary><ProjectOrbit/></details>
  <LedgerHomeFeature/><section className="cp-home-feature"><div><span className="mono">ALGORITHMS / C++</span><h2>835 C++ implementations.<br/><em>Tested & documented.</em></h2><p>I maintain a public algorithm reference collection spanning CSES, Codeforces, and AtCoder, with explanations, complexity analysis, and reproducible tests.</p><LiquidButton href="/projects/pro-competitive-programming" icon={<ArrowUpRight size={17} aria-hidden="true"/>}>Explore the solutions</LiquidButton></div><a href="/projects/pro-competitive-programming" aria-label="Explore the visual algorithm guide"><img src="/projects/pro-cp/fenwick.svg" width={980} height={600} alt="Fenwick tree diagram showing a prefix sum as three smaller ranges" loading="lazy"/></a></section>
  <ActivityHighlights/>
  <section className="glass-contact-banner"><span className="mono">THE NEXT CHAPTER</span><h2>Let’s build something<br/><em>worth exploring.</em></h2><LiquidButton href="/contact" icon={<ArrowUpRight size={19} aria-hidden="true"/>}>Start a conversation</LiquidButton></section>
 </PageFrame></>;
}
