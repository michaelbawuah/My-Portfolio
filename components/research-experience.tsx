"use client";

import { useState } from "react";
import { ArrowUpRight, Fingerprint, GitBranch, ScanLine } from "lucide-react";
import { GlassSurface } from "@/components/interior-experience";
import LiquidButton from "@/components/glass-carousel/LiquidButton";
import Orb from "@/components/glass-carousel/Orb";
import { ResearchComparison } from "@/components/portfolio-interactions";

export function ResearchExperience() {
  const [study,setStudy]=useState<"toolret"|"disclosure">("toolret");
  return <section className="inner-research-hero">
    <div className="inner-research-copy"><span className="inner-eyebrow"><i/> THE RESEARCH NOTEBOOK</span><h1>Ask carefully.<br/><em>Measure honestly.</em></h1><p>My research spans efficient neural retrieval and machine learning for financial disclosures. Each question becomes a reproducible experiment, with the methods, measurements, and current findings available to inspect.</p><div className="hero-actions"><LiquidButton href="#toolret" color="var(--glass-indigo)" arrow>Explore the studies</LiquidButton><LiquidButton href="/about/impact#research" variant="ghost">Earlier research</LiquidButton></div><div className="research-values"><span><Fingerprint size={16}/>Traceable inputs</span><span><GitBranch size={16}/>Reproducible methods</span><span><ScanLine size={16}/>Explicit limits</span></div></div>
    <GlassSurface className="study-console"><div className="console-top"><span className="mono"><i/> STUDY EXPLORER</span><Orb variant="twin" color="var(--glass-indigo)" size={54}/></div><div className="study-switch" role="group" aria-label="Choose a research study"><button type="button" aria-pressed={study==="toolret"} onClick={()=>setStudy("toolret")}><span>01</span>ToolRet</button><button type="button" aria-pressed={study==="disclosure"} onClick={()=>setStudy("disclosure")}><span>02</span>Disclosure Drift</button></div>
      <div className="study-screen" key={study} aria-live="polite">{study==="toolret"?<><div className="study-metric"><span className="mono">UNTOUCHED CONFIRMATION</span><strong>23.4<span>%</span></strong><p>fewer cross-encoder calls</p></div><ResearchComparison/><div className="study-caption"><span>Quality loss tolerance</span><strong>0.01 nDCG@10</strong></div></>:<><div className="study-metric"><span className="mono">COMPLETED SEMANTIC ANALYSIS</span><strong>1.46<span>M</span></strong><p>tokens encoded with MiniLM</p></div><div className="semantic-flow"><span>155<small>filings</small></span><i>→</i><span>5,828<small>chunks</small></span><i>→</i><span>135<small>pairs</small></span></div><div className="semantic-trace" aria-hidden="true">{Array.from({length:36},(_,i)=><i key={i} style={{height:`${22+(i*17)%63}%`}}/>)}</div><p className="study-detail">Two independent processes reproduced the document vectors and pair features exactly. Forecasting evaluation remains in progress.</p></>}
      <a className="study-open" href={study==="toolret"?"#toolret":"#disclosure-drift"}>Open the methods &amp; evidence <ArrowUpRight size={17}/></a></div>
    </GlassSurface>
  </section>;
}
