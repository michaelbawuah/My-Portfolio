"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowRight, ArrowUpRight, AudioLines, Braces, Cpu, Fingerprint, GraduationCap, Layers3, Search, ShieldCheck } from "lucide-react";
import { GlassPanel } from "./glass-panel";
import { LiquidButton } from "./liquid-button";

const tracks = [
  { label: "Systems", name: "Ledger", slug: "ledger", category: "C++ / LLVM", summary: "From an order book to an authored compiler pass.", detail: "Bounded storage. An independent oracle. Inspectable experiments.", steps: ["Command", "Match", "Verify"], icon: Cpu },
  { label: "AI products", name: "NavoX", slug: "navox", category: "VOICE / AI", summary: "One assistant. The context of your day.", detail: "Voice interactions, source-linked memory and reviewable actions.", steps: ["Listen", "Reason", "Review"], icon: AudioLines },
  { label: "Research", name: "ToolRet", slug: "toolret", category: "RETRIEVAL / ML", summary: "When does reranking earn its cost?", detail: "A conditional router, untouched confirmation queries and an independent audit.", steps: ["Retrieve", "Route", "Evaluate"], icon: Search },
] as const;

export function EngineeringDashboard({ projectCount, categoryCount }: { projectCount: number; categoryCount: number }) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const track = tracks[selected];
  const Icon = track.icon;

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tracks.length;
    else if (event.key === "ArrowLeft") next = (index + tracks.length - 1) % tracks.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tracks.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return <GlassPanel className="engineering-dashboard" aria-label="Explore my engineering work">
    <div className="dashboard-topline"><span><Fingerprint size={15} aria-hidden="true" /> ENGINEERING NOTEBOOK</span><span className="dashboard-lights" aria-hidden="true"><i /><i /><i /></span></div>
    <a href="/about" className="dashboard-profile">
      <img src="/personal/michael-landing-atrium.webp" alt="Michael Baffour Awuah" width={1147} height={1372} fetchPriority="high" />
      <div><strong>Michael Baffour Awuah</strong><span><GraduationCap size={14} aria-hidden="true" /> Cornell Engineering · ECE ’28</span></div>
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
    <div className="dashboard-tabs" role="tablist" aria-label="Engineering disciplines">
      {tracks.map((item, index) => <button key={item.label} type="button" ref={node => { tabs.current[index] = node; }} role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => navigate(event, index)}>{item.label}</button>)}
    </div>
    {tracks.map((item, index) => <div key={item.slug} id={`${id}-panel-${index}`} role="tabpanel" aria-labelledby={`${id}-tab-${index}`} hidden={selected !== index} tabIndex={0} className="dashboard-project">
      {selected === index && <>
        <div className="dashboard-project-label"><span>{track.category}</span><Icon size={24} aria-hidden="true" /></div>
        <h2>{track.name}<span>.</span></h2><p className="dashboard-summary">{track.summary}</p>
        <div className="dashboard-flow" aria-label={track.steps.join(" to ")}>{track.steps.map((step, stepIndex) => <span key={step}>{stepIndex === 0 ? <Braces size={16} aria-hidden="true" /> : stepIndex === 1 ? <Layers3 size={16} aria-hidden="true" /> : <ShieldCheck size={16} aria-hidden="true" />}{step}{stepIndex < 2 && <ArrowRight className="dashboard-flow-arrow" size={14} aria-hidden="true" />}</span>)}</div>
        <p className="dashboard-detail">{track.detail}</p>
        <LiquidButton href={`/projects/${track.slug}`} variant="secondary" icon={<ArrowUpRight size={16} aria-hidden="true" />}>Open {track.name}</LiquidButton>
      </>}
    </div>)}
    <div className="dashboard-bottomline"><span><strong>{String(projectCount).padStart(2, "0")}</strong> case studies</span><span><strong>{String(categoryCount).padStart(2, "0")}</strong> areas of work</span><span className="dashboard-signature">MBA<span>~</span>Steins</span></div>
  </GlassPanel>;
}
