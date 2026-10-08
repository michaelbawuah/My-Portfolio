"use client";

import { useEffect, useRef, useState } from "react";
import type { Application, SPEObject } from "@splinetool/runtime";

/** A bounded adaptation of the reference's hero and floating-key poses. */
export function ImmersiveScene({mode="hero"}:{mode?:"hero"|"contact"}) {
 const host=useRef<HTMLDivElement>(null);
 const canvas=useRef<HTMLCanvasElement>(null);
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  const container=host.current,element=canvas.current;if(!container||!element)return;
  const media=matchMedia("(prefers-reduced-motion: reduce)");
  if(media.matches||(navigator as Navigator&{connection?:{saveData?:boolean}}).connection?.saveData)return;
  let app:Application|null=null,keyboard:SPEObject|undefined,dead=false,failed=false,started=false,inView=false,loaded=false;
  let timeout:ReturnType<typeof setTimeout>|undefined;
  let stopTweens=()=>{},pauseTweens=(_paused:boolean)=>{};
  const clear=()=>{failed=true;stopTweens();app?.dispose();app=null;setReady(false);};
  const visibility=()=>{if(!loaded||!app)return;const paused=document.hidden||!inView;pauseTweens(paused);if(paused)app.stop();else app.play();};
  const resize=()=>{if(!app||!loaded||!keyboard)return;const {width,height}=container.getBoundingClientRect();if(!width||!height)return;app.setSize(width,height);const size=.225*Math.min(width/620,1.12);Object.assign(keyboard.scale,{x:size,y:size,z:size});Object.assign(keyboard.position,{x:0,y:mode==="contact"?-80:-25,z:0});};
  const lost=(event:Event)=>{event.preventDefault();clear();};
  const preference=()=>{if(media.matches)clear();};
  async function start(){
   if(started||dead||!element)return;started=true;
   const probe=document.createElement("canvas");const gl=probe.getContext("webgl2")||probe.getContext("webgl");if(!gl)return;gl.getExtension("WEBGL_lose_context")?.loseContext();
   timeout=setTimeout(()=>{if(!loaded&&!dead)clear();},22000);
   try{
    const [{Application},{default:gsap}]=await Promise.all([import("@splinetool/runtime"),import("gsap")]);if(dead||failed)return;
    const instance=new Application(element,{renderMode:"continuous"});app=instance;
    await instance.load("/interactive/skills-keyboard.spline");
    if(dead||failed){instance.dispose();return;}
    loaded=true;if(timeout)clearTimeout(timeout);
    instance.setBackgroundColor("#f8faff");keyboard=instance.findObjectByName("keyboard");
    if(!keyboard)throw new Error("Keyboard object unavailable");
    keyboard.visible=true;
    Object.assign(keyboard.rotation,{x:mode==="contact"?-.35:0,y:-.3,z:mode==="contact"?-.12:.08});
    for(const item of instance.getAllObjects()){
     if(item.name.startsWith("text-")||["bongo-cat","frame-1","frame-2","keycap-mobile"].includes(item.name))item.visible=false;
     if(["keycap","keycap-desktop"].includes(item.name))item.visible=true;
    }
    resize();
    const tweens:gsap.core.Tween[]=[];
    tweens.push(gsap.from(keyboard.rotation,{y:-1.1,z:.3,duration:1.7,ease:"power3.out"}));
    tweens.push(gsap.to(keyboard.position,{y:(mode==="contact"?-80:-25)+20,duration:3.5,repeat:-1,yoyo:true,ease:"sine.inOut"}));
    tweens.push(gsap.to(keyboard.rotation,{y:.4,z:mode==="contact"?.09:-.08,duration:7,delay:1.7,repeat:-1,yoyo:true,ease:"sine.inOut"}));
    if(mode==="contact")for(const [i,name] of ["js","ts","react","nextjs","postgres","mongodb","docker","aws"].entries()){
     const key=instance.findObjectByName(name);if(key)tweens.push(gsap.to(key.position,{y:key.position.y+90+(i%3)*42,duration:2.8+i*.12,delay:i*.08,repeat:-1,yoyo:true,ease:"sine.inOut"}));
    }
    stopTweens=()=>tweens.forEach(t=>t.kill());pauseTweens=paused=>tweens.forEach(t=>t.paused(paused));setReady(true);visibility();
   }catch{if(!dead)clear();}
  }
  const intersection=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)void start();visibility();},{threshold:.05});intersection.observe(container);
  const sizes=new ResizeObserver(resize);sizes.observe(container);
  element.addEventListener("webglcontextlost",lost);document.addEventListener("visibilitychange",visibility);media.addEventListener("change",preference);
  return()=>{dead=true;intersection.disconnect();sizes.disconnect();if(timeout)clearTimeout(timeout);stopTweens();app?.dispose();element.removeEventListener("webglcontextlost",lost);document.removeEventListener("visibilitychange",visibility);media.removeEventListener("change",preference);};
 },[mode]);
 return <div className={`immersive-scene scene-${mode} ${ready?"scene-loaded":""}`} ref={host} aria-hidden="true"><img className="scene-poster" src="/interactive/keyboard-studio.webp" width={1024} height={1024} alt="" loading={mode==="hero"?"eager":"lazy"}/><canvas ref={canvas}/></div>;
}
