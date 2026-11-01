"use client";
import { useState } from "react";
import { BriefcaseBusiness, MessageCircle, Network, ArrowUpRight } from "lucide-react";
import { ContactComposer, type ContactTopic } from "@/components/contact-composer";
import { ContactLinks } from "@/components/portfolio-interactions";
import { SocialProfileLinks } from "@/components/personal-story";
import { GlassSurface } from "@/components/interior-experience";
import Orb from "@/components/glass-carousel/Orb";

const directions = [
  {topic:"Opportunity",label:"A place to build.",description:"Software engineering, AI/ML, and quantitative systems.",icon:BriefcaseBusiness},
  {topic:"Collaboration",label:"An idea to explore.",description:"A useful product, an interesting system, or a shared experiment.",icon:Network},
  {topic:"Just saying hello",label:"A conversation to start.",description:"A question, a shared interest, or a different perspective.",icon:MessageCircle},
] as const;

export function ContactExperience(){
  const [topic,setTopic]=useState<ContactTopic>("Opportunity");
  const current=directions.find(item=>item.topic===topic)!;
  return <>
    <section className="inner-contact-hero">
      <div className="inner-contact-copy"><span className="inner-eyebrow"><i/> LET’S MAKE SOMETHING MATTER</span><h1>A good idea<br/>starts with <em>hello.</em></h1><p>Software engineering, AI/ML, or something we haven’t imagined yet. Let’s talk.</p>
        <GlassSurface className="contact-signal"><div className="signal-heading"><span className="mono">WHAT BRINGS YOU HERE?</span><Orb variant="liquid" color="var(--glass-teal)" size={66}/></div><div className="signal-directions" role="group" aria-label="Choose a conversation topic">{directions.map(({topic:value,icon:Icon})=><button type="button" key={value} aria-pressed={topic===value} onClick={()=>setTopic(value)}><Icon size={20}/><span>{value}</span><ArrowUpRight size={15}/></button>)}</div><div className="signal-note" key={topic} aria-live="polite"><h2>{current.label}</h2><p>{current.description}</p></div><div className="signal-route" aria-hidden="true"><span>Your idea</span><i/><span>A conversation</span><i/><span>What’s next</span></div></GlassSurface>
      </div>
      <GlassSurface className="inner-contact-form"><div className="contact-form-top"><span className="mono">TO / MICHAEL BAFFOUR AWUAH</span><span className="mono">01 — HELLO</span></div><ContactComposer heading="What’s on your mind?" topic={topic} onTopicChange={setTopic}/></GlassSurface>
    </section>
    <section className="inner-contact-direct" aria-label="More ways to connect"><div><span className="mono">KEEP THE CONVERSATION GOING</span><h2>Find me<br/><em>around the internet.</em></h2></div><GlassSurface className="contact-direct"><ContactLinks/><SocialProfileLinks compact/></GlassSurface></section>
  </>;
}
