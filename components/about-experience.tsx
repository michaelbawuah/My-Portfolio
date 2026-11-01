"use client";

import { useCallback, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { aboutPhoto, cadetPhotos, creatorPhotos } from "@/lib/personal";
import LiquidButton from "@/components/glass-carousel/LiquidButton";
import useSwipe from "@/components/glass-carousel/useSwipe";
import { GlassSurface } from "@/components/interior-experience";

const chapters = [
  { name: "Engineer", title: "Built with curiosity.", detail: "CORNELL ENGINEERING · ECE ’28", photo: aboutPhoto, color: "var(--glass-teal)", href: "#experience", cta: "Explore my experience" },
  { name: "Cadet", title: "Better, together.", detail: "AFROTC · DETACHMENT 520", photo: cadetPhotos[0], color: "var(--glass-amber)", href: "/about/afrotc", cta: "Step into cadet life" },
  { name: "Creator", title: "A different perspective.", detail: "MBA~STEINS · CONTENT & COMMUNITY", photo: creatorPhotos[0], color: "var(--glass-indigo)", href: "/about/creator", cta: "Meet MBA~Steins" },
];

export function AboutExperience() {
  const [index, setIndex] = useState(0);
  const step = useCallback((direction: number) => setIndex(i => (i + direction + chapters.length * 2) % chapters.length), []);
  const stepPx = useCallback(() => Math.min(420, window.innerWidth * .8), []);
  const swipe = useSwipe({ stepPx, onStep: step });
  const current = chapters[index];
  return <section className="inner-about-hero" style={{"--story-color":current.color} as CSSProperties}>
    <div className="inner-about-copy"><span className="inner-eyebrow"><i/> THE PERSON BEHIND THE BUILDS</span><h1>Engineer.<br/>Cadet. <em>Creator.</em></h1><p>I’m Michael Baffour Awuah, an Electrical &amp; Computer Engineering student at Cornell. I build AI products, explore fast systems, and ask questions that connect software with the world.</p><p className="inner-hero-note">Different settings. The same curiosity.</p>
      <div className="story-switch" role="group" aria-label="Explore Michael’s story">{chapters.map((chapter,i) => <button key={chapter.name} type="button" aria-pressed={index===i} onClick={()=>setIndex(i)}><span>0{i+1}</span>{chapter.name}</button>)}</div>
      <div className="hero-actions"><LiquidButton href={current.href} color={current.color} arrow>{current.cta}</LiquidButton><LiquidButton href="#story" variant="ghost">Read my story</LiquidButton></div>
    </div>
    <div className="story-deck-wrap">
      <div {...swipe.bind} ref={swipe.ref} className={`story-deck ${swipe.dragging?"is-dragging":""}`} tabIndex={0} aria-label="Portrait stories. Swipe, or use the left and right arrow keys." onKeyDown={event=>{if(event.key==="ArrowLeft"||event.key==="ArrowRight"){event.preventDefault();step(event.key==="ArrowRight"?1:-1);}}}>
        {chapters.map((chapter,i) => { const d=((i-index+4)%3)-1;return <figure key={chapter.name} className={`story-portrait ${index===i?"is-active":""}`} aria-hidden={index!==i} style={{"--portrait-d":d,"--portrait-a":Math.abs(d),"--drag":swipe.offset,"--portrait-color":chapter.color} as CSSProperties}>
          <img src={chapter.photo.src} alt={chapter.photo.alt} width={chapter.photo.width} height={chapter.photo.height} fetchPriority={i===0?"high":undefined} loading={i===0?"eager":"lazy"} draggable={false}/>
          <figcaption><span className="mono">{chapter.detail}</span><strong>{chapter.title}</strong><span className="portrait-signature">Michael Baffour Awuah <span>0{i+1} / 03</span></span></figcaption>
        </figure>;})}
        <div className="portrait-orbit" aria-hidden="true"/>
      </div>
      <div className="story-deck-controls"><span className="mono" aria-live="polite">0{index+1} / 03 · {current.name}</span><div><button type="button" onClick={()=>step(-1)} aria-label="Previous portrait story"><ArrowLeft size={18}/></button><button type="button" onClick={()=>step(1)} aria-label="Next portrait story"><ArrowRight size={18}/></button></div></div>
    </div>
    <GlassSurface className="inner-profile-strip"><div><span className="mono">THE FOUNDATION</span><strong>Cornell ECE <span>Class of 2028</span></strong></div><div><span className="mono">THE INTERESTS</span><strong>AI · Systems · Quant</strong></div><div><span className="mono">THE APPROACH</span><strong>Correct. Clear. Then fast.</strong></div></GlassSurface>
  </section>;
}
