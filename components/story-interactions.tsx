"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SectionNavigator } from "@/components/section-navigator";
import type { PersonalPhoto } from "@/lib/personal";

export function StoryNotebook({story,experience,toolkit}:{story:ReactNode;experience:ReactNode;toolkit:ReactNode}) {
  const sections=[{id:"story",label:"My story",content:story},{id:"experience",label:"Experience",content:experience},{id:"toolkit",label:"Engineering toolkit",content:toolkit}];
  return <SectionNavigator id="about-notebook" sections={sections} className="story-notebook" label="About Michael" initialSection="toolkit"/>;
}

export function MediaGallery({photos,title}:{photos:readonly PersonalPhoto[];title:string}) {
  const [selected,setSelected]=useState<number|null>(null);
  const trigger=useRef<HTMLAnchorElement|null>(null);
  useEffect(()=>{
    if(selected===null)return;
    function handleKey(event:KeyboardEvent){if(event.key==="ArrowRight"||event.key==="ArrowLeft"){event.preventDefault();const delta=event.key==="ArrowRight"?1:-1;setSelected(i=>i===null?null:(i+delta+photos.length)%photos.length);}}
    window.addEventListener("keydown",handleKey);
    return ()=>window.removeEventListener("keydown",handleKey);
  },[selected,photos.length]);
  if(!photos.length)return null;
  const current=photos[selected??0];
  return <Dialog open={selected!==null} onOpenChange={open=>{if(!open)setSelected(null);}}><div className="personal-gallery">{photos.map((photo,i)=><figure key={photo.src}><a href={photo.src} target="_blank" rel="noopener noreferrer" className="gallery-photo" aria-label={`View photo: ${photo.caption}`} onClick={event=>{event.preventDefault();trigger.current=event.currentTarget;setSelected(i);}}><img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy"/><span className="photo-open">View photo</span></a><figcaption>{photo.caption}</figcaption></figure>)}</div><DialogContent className="story-lightbox" onCloseAutoFocus={event=>{event.preventDefault();trigger.current?.focus();}}><div className="lightbox-header"><DialogTitle>{title}</DialogTitle></div><img className="lightbox-image" src={current.src} alt={current.alt} width={current.width} height={current.height}/><DialogDescription className="lightbox-caption">{current.caption}</DialogDescription><div className="lightbox-controls"><button type="button" className="button-secondary" onClick={()=>setSelected(i=>i===null?null:(i-1+photos.length)%photos.length)}>Previous photo</button><a href={current.src} className="text-link" target="_blank" rel="noopener noreferrer">Open full photo</a><button type="button" className="button-secondary" onClick={()=>setSelected(i=>i===null?null:(i+1)%photos.length)}>Next photo</button></div></DialogContent></Dialog>;
}
