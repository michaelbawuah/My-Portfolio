"use client";
import {useEffect,useRef,useState} from "react";
import {usePathname} from "next/navigation";
import {useTheme} from "next-themes";
import type {Application,SPEObject} from "@splinetool/runtime";
import {keyboardPose,routeKeyboardMode,type KeyboardMode} from "@/lib/keyboard-motion";
import {toolkit} from "@/lib/toolkit";

const keyNames=["js","ts","html","css","react","vue","nextjs","tailwind","nodejs","express","postgres","mongodb","git","github","prettier","npm","firebase","wordpress","linux","docker","nginx","aws","vim","vercel"];
const modes=new Set<KeyboardMode>(["hero","skills","experience","projects","contact"]);

/** A clear foreground window for the shared scene on small screens. */
export function MobileKeyboardStage(){
 const path=usePathname();
 return <div className="mobile-keyboard-stage" data-keyboard-scene={routeKeyboardMode(path)} aria-hidden="true"><div data-keyboard-window/></div>;
}
/** One non-intercepting canvas. Accessible foreground controls drive the skills scene. */
export function GlobalKeyboardScene(){
 const canvas=useRef<HTMLCanvasElement>(null),host=useRef<HTMLDivElement>(null);
 const path=usePathname(),{resolvedTheme}=useTheme();
 const route=useRef(path),night=useRef(false),appRef=useRef<Application|null>(null);
 const [ready,setReady]=useState(false),[motionAllowed,setMotionAllowed]=useState<boolean|null>(null);
 const refreshScroll=useRef<()=>void>(()=>{});
 useEffect(()=>{const media=matchMedia("(prefers-reduced-motion: reduce)");const change=()=>setMotionAllowed(!media.matches);change();media.addEventListener("change",change);return()=>media.removeEventListener("change",change);},[]);
 useEffect(()=>{route.current=path;const id=requestAnimationFrame(()=>refreshScroll.current());return()=>cancelAnimationFrame(id);},[path]);
 useEffect(()=>{night.current=resolvedTheme==="dark";appRef.current?.setBackgroundColor(night.current?"#090f1b":"#f8faff");},[resolvedTheme]);
 useEffect(()=>{
  const element=canvas.current,container=host.current;if(!element||!container)return;
  if(motionAllowed===null)return;
  let dead=false,failed=false,loaded=false,loading=false,attempts=0,retryTimer=0,frame=0,previous=0,elapsed=0,modeTime=0,progress=0,width=innerWidth,height=innerHeight;
  let mode=routeKeyboardMode(route.current),selected=document.querySelector<HTMLElement>("[data-selected-tool]")?.dataset.selectedTool||"ts",slot:DOMRect|null=null;
  let app:Application|null=null,keyboard:SPEObject|undefined,cat:SPEObject|undefined;
  let frames:(SPEObject|undefined)[]=[],keys:{object:SPEObject;y:number}[]=[],texts:SPEObject[]=[];
  let keycapDesktop:SPEObject[]=[],keycapMobile:SPEObject[]=[],keycaps:SPEObject[]=[];
  let current=keyboardPose(mode,0,width,height),lastTextState="";
  container.dataset.sceneStatus="loading";
  function fail(reason="context-lost"){failed=true;loaded=false;container!.dataset.sceneStatus="unavailable";container!.dataset.sceneError=reason;cancelAnimationFrame(frame);app?.dispose();app=null;appRef.current=null;delete document.documentElement.dataset.keyboardReady;if(!dead)setReady(false);}
  function updateScroll(){
   const range=Math.max(document.documentElement.scrollHeight-innerHeight,1);
   progress=Math.max(0,Math.min(1,scrollY/range));slot=null;
   let next=routeKeyboardMode(route.current);
   for(const section of document.querySelectorAll<HTMLElement>("[data-keyboard-scene]")){
    if(!section.getClientRects().length||section.closest('[data-state="inactive"]'))continue;
    const rect=section.getBoundingClientRect();
    const dedicatedStage=section.classList.contains("mobile-keyboard-stage")||section.hasAttribute("data-keyboard-stage");
    if(dedicatedStage?rect.top<height&&rect.bottom>80:rect.top<height*.64&&rect.bottom>height*.34){
     const candidate=section.dataset.keyboardScene as KeyboardMode;
     if(modes.has(candidate)){
      const window=section.querySelector<HTMLElement>("[data-keyboard-window]");
      const bounds=window?.getBoundingClientRect();
      if(slot&&!bounds)continue;
      if(bounds&&(bounds.bottom<=0||bounds.top>=height))continue;
      next=candidate;slot=bounds||null;
     }
    }
   }
   if(next!==mode){mode=next;modeTime=0;lastTextState="";}
   container!.dataset.sceneFramed=slot?"true":"false";
   if(slot){
    container!.style.setProperty("--scene-left",`${slot.left}px`);container!.style.setProperty("--scene-top",`${slot.top}px`);
    container!.style.setProperty("--scene-width",`${slot.width}px`);container!.style.setProperty("--scene-height",`${slot.height}px`);
   }
   container!.dataset.sceneMode=mode;if(loaded&&!motionAllowed){previous=0;draw(performance.now());}
  }
  function resize(){width=innerWidth;height=innerHeight;if(loaded)app?.setSize(width,height);keycapDesktop.forEach(key=>{key.visible=true;});keycapMobile.forEach(key=>{key.visible=false;});updateScroll();}
  function selectTool(event:Event){const id=(event as CustomEvent<string>).detail;const tool=toolkit.find(t=>t.id===id);if(!tool)return;selected=id;app?.setVariables({heading:tool.name,desc:tool.sceneDescription});if(!motionAllowed){previous=0;draw(performance.now());}}
  function draw(now:number){
   if(dead||failed||!loaded||document.hidden||!keyboard||!app)return;
   const interval=1000/60;
   if(now-previous<interval-1){frame=requestAnimationFrame(draw);return;}
   const seconds=motionAllowed?(now-previous)/1000:0;const dt=Math.min(seconds,.08);previous=now;elapsed+=seconds;modeTime+=seconds;
   const target=keyboardPose(mode,progress,width,height),blend=motionAllowed?1-Math.exp(-dt*4):1;
   if(mode==="hero")target.ry+=Math.sin(elapsed*.22)*.4;
   if(mode==="projects")target.ry+=Math.sin(elapsed*.35)*.12;
   if(mode==="contact"){target.ry+=Math.sin(elapsed*.36)*.6;target.rx+=Math.sin(elapsed*.27)*.12;}
   if(mode==="skills")target.ry+=Math.sin(elapsed*.3)*.06;
   target.y+=Math.sin(elapsed*.8)*6;
   if(slot){
    target.x=slot.left+slot.width/2-width/2;target.y=height/2-(slot.top+slot.height/2);
    target.scale=width<801?Math.min(.17,slot.width/2400,slot.height/(mode==="projects"?2500:mode==="contact"?2300:2000)):Math.min(.24,slot.width/2600);
    if(width<801&&mode==="projects")target.y-=slot.height*.13;
   }
   for(const field of ["x","y","rx","ry","rz","scale"] as const)current[field]+=(target[field]-current[field])*blend;
   container!.dataset.sceneWindow=slot?`${Math.round(slot.top)},${Math.round(slot.height)}`:"background";
   Object.assign(keyboard.position,{x:current.x,y:current.y,z:0});
   Object.assign(keyboard.rotation,{x:current.rx,y:current.ry,z:current.rz});
   Object.assign(keyboard.scale,{x:current.scale,y:current.scale,z:current.scale});
   const typing=mode==="projects"&&(!motionAllowed||modeTime>.3);
   if(cat)cat.visible=typing;const catFrame=Math.floor(elapsed*10)%2;
   frames.forEach((f,i)=>{if(f)f.visible=typing&&i===catFrame;});
   const textState=`${mode}:${width<801}:${night.current}`;
   if(lastTextState!==textState){
    lastTextState=textState;
    const visible=`text-${width<801?"mobile":"desktop"}${night.current?"":"-dark"}`;
    texts.forEach(object=>{object.visible=mode==="skills"&&object.name===visible;});
   }
   const entry=motionAllowed?Math.max(0,1-elapsed/1.2):0;
   keycaps.forEach((key,i)=>{const t=motionAllowed?Math.min(1,Math.max(0,(elapsed-i*.025)/.65)):1;key.position.y=50+150*(1-t)**3;});
   keys.forEach(({object,y},i)=>{
    const float=mode==="contact"?(100+70*Math.sin(elapsed*(.65+i*.009)+i*.65))*(motionAllowed?Math.min(modeTime/1.8,1):1):0;
    const press=mode==="skills"&&object.name===selected?-9:typing&&i===Math.floor(elapsed*8)%keys.length?-10:0;
    const destination=y+float+press+entry*110;
    object.position.y+=(destination-object.position.y)*(motionAllowed?1-Math.exp(-dt*7):1);
   });
   app.requestRender();
   if(motionAllowed)frame=requestAnimationFrame(draw);
  }
  function visibility(){cancelAnimationFrame(frame);if(!loaded||!app||failed)return;if(document.hidden)app.stop();else{app.play();previous=performance.now();frame=requestAnimationFrame(draw);}}
  function initialize(instance:Application){
   if(dead){instance.dispose();return;}
   app=instance;
   keyboard=instance.findObjectByName("keyboard");if(!keyboard)throw Error("Scene unavailable");
   cat=instance.findObjectByName("bongo-cat");frames=[instance.findObjectByName("frame-1"),instance.findObjectByName("frame-2")];
   texts=[];keycaps=[];keycapDesktop=[];keycapMobile=[];
   for(const object of instance.getAllObjects()){
    if(object.name.startsWith("text-")){object.visible=false;texts.push(object);}
    if(object.name==="keycap"){object.visible=true;keycaps.push(object);}
    if(object.name==="keycap-desktop")keycapDesktop.push(object);
    if(object.name==="keycap-mobile")keycapMobile.push(object);
   }
   keyboard.visible=true;
   keys=keyNames.flatMap(name=>{const object=instance.findObjectByName(name);if(!object)return [];object.visible=true;return [{object,y:object.position.y}];});
   loaded=true;failed=false;appRef.current=instance;instance.setGlobalEvents(false);
   const tool=toolkit.find(t=>t.id===selected)||toolkit[0];instance.setVariables({heading:tool.name,desc:tool.sceneDescription});
   instance.setBackgroundColor(night.current?"#090f1b":"#f8faff");resize();current=keyboardPose(mode,progress,width,height);
   document.documentElement.dataset.keyboardReady="true";container!.dataset.sceneStatus="ready";delete container!.dataset.sceneError;setReady(true);visibility();
  }
  async function loadScene(){
   if(dead||loading||loaded)return;
   loading=true;attempts++;failed=false;
   container!.dataset.sceneStatus="loading";container!.dataset.sceneRenderer="spline";
   try{
    const {Application}=await import("@splinetool/runtime");if(dead)return;
    const instance=new Application(element!,{renderMode:"manual",wasmPath:"/interactive/spline-runtime"});app=instance;
    await instance.load("/interactive/skills-keyboard-unified.spline");
    if(dead){instance.dispose();return;}
    initialize(instance);
   }catch(error){
    if(!dead){
     console.warn("Portfolio 3D scene could not load",error);
     fail(error instanceof Error?error.message:"load-failed");
     if(attempts<2)retryTimer=window.setTimeout(()=>{void loadScene();},1500);
    }
   }finally{loading=false;}
  }
  const lost=(event:Event)=>{
   event.preventDefault();cancelAnimationFrame(frame);app?.stop();loaded=false;
   container!.dataset.sceneStatus="context-lost";delete document.documentElement.dataset.keyboardReady;setReady(false);
  };
  const restored=()=>{app?.dispose();app=null;appRef.current=null;attempts=0;void loadScene();};
  const resume=()=>{visibility();if(!loaded&&!loading&&attempts<2&&!document.hidden&&container!.dataset.sceneStatus!=="context-lost")void loadScene();};
  refreshScroll.current=updateScroll;
  const sizes=new ResizeObserver(updateScroll);sizes.observe(document.body);
  const sections=new MutationObserver(updateScroll);sections.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["data-state"]});
  window.addEventListener("scroll",updateScroll,{passive:true});window.addEventListener("resize",resize);
  window.addEventListener("portfolio:toolkit",selectTool);document.addEventListener("visibilitychange",resume);window.addEventListener("pageshow",resume);
  element.addEventListener("webglcontextlost",lost);element.addEventListener("webglcontextrestored",restored);updateScroll();void loadScene();
  return()=>{dead=true;refreshScroll.current=()=>{};delete document.documentElement.dataset.keyboardReady;setReady(false);cancelAnimationFrame(frame);sizes.disconnect();sections.disconnect();window.removeEventListener("scroll",updateScroll);window.removeEventListener("resize",resize);window.removeEventListener("portfolio:toolkit",selectTool);document.removeEventListener("visibilitychange",resume);window.removeEventListener("pageshow",resume);window.clearTimeout(retryTimer);element.removeEventListener("webglcontextlost",lost);element.removeEventListener("webglcontextrestored",restored);app?.dispose();appRef.current=null;};
 },[motionAllowed]);
 return <div ref={host} className={`global-keyboard-scene ${ready?"is-ready":""}`} data-scene-page={path==="/"?"home":path==="/work"?"work":path==="/contact"?"contact":"interior"} aria-hidden="true"><div className="global-scene-poster"><img src="/interactive/keyboard-scene-preview.png" width={1528} height={846} alt=""/></div><canvas ref={canvas} className="keyboard-webgl"/><div className="global-scene-veil"/></div>;
}
