"use client";

import { useRef, useState, type ReactNode } from "react";
import { Maximize2, ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GlassSurface } from "@/components/interior-experience";

export function CaseVisual({label,src,alt="",width=1400,height=800,caption,children}:{label:string;src?:string;alt?:string;width?:number;height?:number;caption:ReactNode;children?:ReactNode}) {
  const [open,setOpen]=useState(false);
  const trigger=useRef<HTMLButtonElement>(null);
  return <><GlassSurface className="case-hero-visual inner-case-visual"><div className="visual-toolbar"><span className="mono"><i className="visual-status"/>{label}</span>{src?<button type="button" onClick={()=>setOpen(true)} ref={trigger} aria-label={`Enlarge ${label} visual`}><Maximize2 size={17}/></button>:<span className="window-controls" aria-hidden="true"><i/><i/><i/></span>}</div>{src?<button className="case-visual-open" type="button" onClick={event=>{trigger.current=event.currentTarget;setOpen(true);}} aria-label={`Inspect ${label} image`}><img src={src} alt={alt} width={width} height={height} fetchPriority="high" draggable={false}/><span>Take a closer look <Maximize2 size={14}/></span></button>:<div className="case-visual-content">{children}</div>}<div className="visual-bottomline">{caption}</div><span className="visual-edge" aria-hidden="true"/></GlassSurface>{src&&<Dialog open={open} onOpenChange={setOpen}><DialogContent className="case-visual-dialog" onCloseAutoFocus={event=>{event.preventDefault();trigger.current?.focus();}}><DialogTitle>{label}</DialogTitle><div className="case-visual-full"><img src={src} alt={alt} width={width} height={height}/></div><DialogDescription>{alt}</DialogDescription><a href={src} className="text-link" target="_blank" rel="noopener noreferrer">Open original image <ArrowUpRight size={16}/></a></DialogContent></Dialog>}</>;
}
