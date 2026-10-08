"use client";

import { DocumentLink as Link } from "@/components/document-link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Code2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { person } from "@/lib/portfolio";
import {ThemeSwitch} from "@/components/portfolio-theme";

const pages = [
  {name:"Home",href:"/",note:"An introduction",image:"/personal/michael-landing-atrium.webp",caption:"Michael Baffour Awuah · MBA~Steins",kind:"portrait"},
  {name:"Work",href:"/work",note:"Ideas, implemented",image:"/projects/navox.jpg",caption:"AI assistants, learning engines & reliable systems",kind:"screen"},
  {name:"Research",href:"/research",note:"Questions, tested",image:"/logos/toolret.png",caption:"ToolRet · conditional tool reranking",kind:"brand"},
  {name:"About",href:"/about",note:"Engineer. Cadet. Creator.",image:"/personal/michael-landing-atrium.webp",caption:"Cornell Engineering · Class of 2028",kind:"portrait"},
  {name:"Impact",href:"/about/impact",note:"Robotics, leadership & service",image:"/personal/michael-landing-atrium.webp",caption:"Engineering research · Opoku Ware School · Community service",kind:"portrait"},
  {name:"Toolkit",href:"/about#toolkit",note:"Explore the technology",image:"/projects/fluxion.png",caption:"From interface to infrastructure",kind:"screen"},
  {name:"Contact",href:"/contact",note:"Let’s build something",image:"/brand/mba-steins.png",caption:person.email,kind:"brand"},
];

export function InteractiveNavigation(){
 const pathname=usePathname();
 const [scrolled,setScrolled]=useState(false);
 useEffect(()=>{const update=()=>setScrolled(window.scrollY>16);update();window.addEventListener("scroll",update,{passive:true});return()=>window.removeEventListener("scroll",update);},[]);
 const [open,setOpen]=useState(false);
 const [preview,setPreview]=useState(1);
 const reduced=useReducedMotion();
 const current=pages[preview];
 const active=(href:string)=>pathname===href || (href==="/about"&&pathname.startsWith("/about/")) || (href==="/work"&&pathname.startsWith("/projects/")&&pathname!=="/projects/toolret") || (href==="/research"&&pathname==="/projects/toolret");
 return <header className="site-nav" data-scrolled={scrolled}>
  <div className="nav-brand"><Link href="/" className="wordmark" aria-label="MBA~Steins — Michael Baffour Awuah home"><img src="/brand/mba-steins.png" alt="MBA~Steins" width={440} height={62} fetchPriority="high"/></Link><Link className="nav-home" href="/" aria-current={pathname==="/"?"page":undefined}>Home</Link></div>
  <nav aria-label="Main navigation" className="desktop-nav">{pages.filter(p=>["Work","Research","About","Contact"].includes(p.name)).map(p=><a key={p.name} href={p.href} aria-current={active(p.href)?"page":undefined}>{p.name}</a>)}</nav>
  <a className="nav-github" href={person.github} target="_blank" rel="noopener noreferrer"><Code2 size={18}/><span>GitHub</span></a>
  <ThemeSwitch/>
  <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><button className="explore-menu-button" type="button" aria-label="Open navigation menu"><span>Menu</span><Menu size={22}/></button></DialogTrigger>
   <DialogContent className="explore-menu" showCloseButton={false}>
    <div className="explore-menu-top"><DialogTitle>MBA~Steins</DialogTitle><DialogDescription className="menu-description">Explore Michael’s portfolio</DialogDescription><DialogClose asChild><button className="explore-menu-close" aria-label="Close navigation menu"><span>Close</span><X size={24}/></button></DialogClose></div>
    <div className="explore-menu-grid"><nav className="explore-menu-links" aria-label="Explore portfolio">{pages.map((p,i)=><motion.a key={p.name} href={p.href} initial={reduced?false:{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:reduced?0:i*.045,duration:.3}} onMouseEnter={()=>setPreview(i)} onFocus={()=>setPreview(i)} onClick={()=>setOpen(false)} aria-current={active(p.href)?"page":undefined}><span className="menu-label"><span>{p.name}</span><span aria-hidden="true">{p.name}</span></span><span className="menu-link-note">{p.note}</span></motion.a>)}</nav>
     <aside className="menu-preview" aria-hidden="true"><div className="menu-preview-top"><span className="mono">A CLOSER LOOK</span></div><AnimatePresence mode="wait"><motion.div key={current.name} className={`menu-preview-image ${current.kind}`} initial={reduced?false:{opacity:0,y:14,rotate:1}} animate={{opacity:1,y:0,rotate:0}} exit={{opacity:0,y:-8}} transition={{duration:.22}}><img src={current.image} alt="" width={1000} height={700}/></motion.div></AnimatePresence><strong>{current.name}</strong><p>{current.caption}</p></aside>
    </div>
    <div className="explore-menu-bottom"><a href={`mailto:${person.email}`}>{person.email}</a><div><a href={person.github} target="_blank" rel="noopener noreferrer">GitHub</a><a href={person.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div>
   </DialogContent>
  </Dialog>
 </header>;
}
