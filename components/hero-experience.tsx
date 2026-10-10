"use client";

import { ArrowDown, ArrowUpRight, Code2, ExternalLink } from "lucide-react";
import { person } from "@/lib/portfolio";
import Magnet from "@/components/react-bits/Magnet";

export function HeroExperience() {
  return (
    <section className="immersive-hero studio-hero" aria-labelledby="home-title">
      <div className="hero-registration">
        <span>CORNELL ENGINEERING · CLASS OF 2028</span>
        <span>SOFTWARE / AI / SYSTEMS</span>
      </div>
      <div className="immersive-hero-copy">
        <p className="eyebrow"><span className="studio-spark" aria-hidden="true"/> MICHAEL BAFFOUR AWUAH</p>
        <h1 className="studio-title" id="home-title">
          <span className="hero-line"><span className="hero-word">Building</span></span>
          <span className="hero-line"><span className="hero-word">what comes</span></span>
          <span className="hero-line"><em className="hero-word">next.</em><svg className="hero-underline" viewBox="0 0 280 20" aria-hidden="true"><path pathLength="1" d="M4 13 Q120 0 270 9 M65 18 Q165 7 278 15"/></svg></span>
        </h1>
        <p className="immersive-description">I’m Michael, studying Electrical &amp; Computer Engineering at Cornell. I’m building NavoX to make everyday work easier, and Fluxion to understand the machinery underneath AI.</p>
        <div className="hero-actions">
          <Magnet><a href="#selected-builds" className="button-primary">Explore what I’m building <ArrowDown size={17}/></a></Magnet>
          <Magnet><a href="/about" className="button-secondary">My story <ArrowUpRight size={17}/></a></Magnet>
        </div>
        <div className="hero-social-links">
          <a href={person.github} target="_blank" rel="noopener noreferrer"><Code2 size={19} aria-hidden="true"/>GitHub</a>
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer"><ExternalLink size={19} aria-hidden="true"/>LinkedIn</a>
        </div>
      </div>
      <div className="hero-studio">
        <div className="studio-orbit" aria-hidden="true"><span/><span/><span/></div>
        <a className="studio-portrait" href="/about" aria-label="Meet Michael — read my story">
          <div className="studio-photo"><img src="/personal/michael-landing-atrium.webp" alt="Michael Baffour Awuah smiling in a decorated black suit and glasses" width={1147} height={1372} fetchPriority="high"/></div>
          <span className="studio-photo-caption"><span>Michael<small>MBA~STEINS</small></span><ArrowUpRight size={23}/></span>
        </a>
        <a className="studio-note studio-note-navox" href="/projects/navox"><img src="/logos/navox.png" width={38} height={38} alt=""/><span><small>CURRENTLY BUILDING</small><strong>NavoX <ArrowUpRight size={14}/></strong></span></a>
        <a className="studio-note studio-note-fluxion" href="/projects/fluxion"><span className="studio-code-symbol" aria-hidden="true">∂</span><span><small>UNDER THE HOOD</small><strong>Tensor → Transformer</strong></span></a>
        <div className="studio-keyboard-window" data-keyboard-scene="hero" data-keyboard-stage aria-hidden="true"><div data-keyboard-window/></div>
        <span className="studio-coordinate" aria-hidden="true">ALWAYS FIGURING THINGS OUT.</span>
      </div>
      <a className="hero-scroll-cue" href="#selected-builds"><span className="scroll-cue-track" aria-hidden="true"><i/></span>Scroll to look inside <ArrowDown size={16}/></a>
    </section>
  );
}
