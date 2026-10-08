import type { ReactNode } from "react";
import { InteractiveNavigation } from "@/components/interactive-navigation";
import { person } from "@/lib/portfolio";
import { TechnologyDock } from "@/components/technology-dock";
import { PortfolioAtmosphere } from "@/components/portfolio-atmosphere";
import { MobileKeyboardStage } from "@/components/global-keyboard-scene";
import { RadialShortcuts } from "@/components/radial-shortcuts";
export function PageFrame({children,className=""}:{children:ReactNode;className?:string}){return <div className={`portfolio-shell ${className}`}><PortfolioAtmosphere/><a className="skip-link" href="#main">Skip to content</a><InteractiveNavigation/><main id="main"><MobileKeyboardStage/>{children}</main><footer className="site-footer"><a href="/" className="footer-brand">MBA~Steins</a><span>© {new Date().getFullYear()} {person.name}</span><a href={`mailto:${person.email}`}>Let’s connect</a></footer><RadialShortcuts/></div>;}
export function PageTitle({kicker,title,description}:{kicker:string;title:ReactNode;description:string}){return <header className="page-heading"><div className="page-kicker"><span className="mono">{kicker}</span></div><h1>{title}</h1><p>{description}</p></header>;}
export function TechStack({technologies}:{technologies:readonly string[]}){return <TechnologyDock technologies={technologies}/>;}
