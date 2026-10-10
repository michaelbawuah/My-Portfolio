"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SystemsVisual } from "@/components/portfolio-interactions";
import { person } from "@/lib/portfolio";
import {Code2,ExternalLink} from "lucide-react";
import Magnet from "@/components/react-bits/Magnet";


export function HeroExperience(){
 const [word,setWord]=useState(0);const reduced=useReducedMotion();
 const words=["AI assistants.","Learning engines.","Reliable systems."];
 useEffect(()=>{if(reduced)return;const timer=setInterval(()=>{if(!document.hidden)setWord(w=>(w+1)%words.length);},3400);return()=>clearInterval(timer);},[reduced,words.length]);
 return <section className="immersive-hero"><div className="hero-registration"><span>CORNELL ENGINEERING · CLASS OF 2028</span><span>SOFTWARE / AI / SYSTEMS</span></div><div className="immersive-hero-copy"><p className="eyebrow">MICHAEL BAFFOUR AWUAH</p><h1 className="kinetic-heading"><span>Building</span><span>what comes <em>next.</em></span></h1><div className="hero-changing" aria-label="AI assistants, learning engines, and reliable systems"><span className="changing-line" aria-hidden="true"/><div aria-hidden="true"><AnimatePresence mode="wait"><motion.span key={word} initial={reduced?false:{y:28,filter:"blur(7px)",opacity:0}} animate={{y:0,filter:"blur(0px)",opacity:1}} exit={{y:-22,filter:"blur(7px)",opacity:0}} transition={{duration:.45}}>{words[word]}</motion.span></AnimatePresence></div></div><p className="immersive-description">I turn ideas into software people can use—and systems they can trust. Electrical &amp; Computer Engineering at Cornell. Curious all the way down.</p><div className="hero-actions"><Magnet><a href="/work" className="button-primary">Explore my work</a></Magnet><Magnet><a href="/contact" className="button-secondary">Let’s connect</a></Magnet></div><div className="hero-social-links"><a href={person.github} target="_blank" rel="noopener noreferrer"><Code2 size={20} aria-hidden="true"/>GitHub</a><a href={person.linkedin} target="_blank" rel="noopener noreferrer"><ExternalLink size={20} aria-hidden="true"/>LinkedIn</a></div></div><SystemsVisual/></section>;
}
