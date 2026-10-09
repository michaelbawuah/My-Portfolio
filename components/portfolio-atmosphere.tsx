"use client";

import { useEffect, useRef } from "react";

export function PortfolioAtmosphere(){
 const canvas=useRef<HTMLCanvasElement>(null),cursor=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const element=canvas.current,ring=cursor.current;if(!element||!ring)return;
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  const fine=matchMedia("(pointer:fine)");
  if(reduced.matches)return;
  const ctx=element.getContext("2d");if(!ctx)return;
  let stopped=false,frame=0,width=innerWidth,height=innerHeight,tick=0,visible=true;
  let pointer={x:-1000,y:-1000},position={x:-1000,y:-1000},hover:HTMLElement|null=null;
  const points=Array.from({length:fine.matches?42:18},(_,i)=>({x:(i*.61803398875)%1,y:(i*.41421356237)%1,r:i%4===0?1.7:1,speed:.025+(i%5)*.006}));
  const resize=()=>{width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,1.5);element.width=width*dpr;element.height=height*dpr;element.style.width=`${width}px`;element.style.height=`${height}px`;ctx.setTransform(dpr,0,0,dpr,0,0);};
  const pointerMove=(event:PointerEvent)=>{if(event.pointerType!=="mouse")return;pointer={x:event.clientX,y:event.clientY};if(position.x===-1000)position={...pointer};const target=(event.target as Element).closest<HTMLElement>('a,button');hover=target||null;const editing=!!(event.target as Element).closest("input,textarea,select,[contenteditable=true]");ring.style.opacity=editing?"0":"1";ring.dataset.hover=hover?"true":"false";document.documentElement.dataset.customCursor="true";};
  const leave=()=>{pointer={x:-1000,y:-1000};ring.style.opacity="0";hover=null;delete document.documentElement.dataset.customCursor;};
  function draw(){
   if(stopped||!visible||!ring)return;tick++;ctx!.clearRect(0,0,width,height);
   for(const point of points){const x=point.x*width,y=((point.y*height-tick*point.speed)%height+height)%height;const dx=x-pointer.x,dy=y-pointer.y,distance=Math.hypot(dx,dy);const push=distance>0&&distance<110?(110-distance)*.16:0;ctx!.beginPath();ctx!.arc(x+(dx/(distance||1))*push,y+(dy/(distance||1))*push,point.r,0,Math.PI*2);ctx!.fillStyle="rgba(45,87,178,0.22)";ctx!.fill();}
   if(fine.matches&&pointer.x!==-1000){let x=pointer.x,y=pointer.y,w=22,h=22,r=50;if(hover){const rect=hover.getBoundingClientRect();x=rect.left+rect.width/2;y=rect.top+rect.height/2;w=rect.width+10;h=rect.height+10;r=12;}position.x+=(x-position.x)*.2;position.y+=(y-position.y)*.2;ring.style.transform=`translate3d(${position.x}px,${position.y}px,0) translate(-50%,-50%)`;ring.style.width=`${w}px`;ring.style.height=`${h}px`;ring.style.borderRadius=`${r}px`;}
   frame=requestAnimationFrame(draw);
  }
  const visibility=()=>{visible=!document.hidden;cancelAnimationFrame(frame);if(visible&&!stopped)frame=requestAnimationFrame(draw);};
  const preference=()=>{if(reduced.matches){stopped=true;delete document.documentElement.dataset.customCursor;cancelAnimationFrame(frame);ctx.clearRect(0,0,width,height);ring.style.opacity="0";}};
  resize();frame=requestAnimationFrame(draw);window.addEventListener("resize",resize);window.addEventListener("pointermove",pointerMove,{passive:true});document.addEventListener("pointerleave",leave);document.addEventListener("visibilitychange",visibility);reduced.addEventListener("change",preference);
  return()=>{stopped=true;delete document.documentElement.dataset.customCursor;cancelAnimationFrame(frame);window.removeEventListener("resize",resize);window.removeEventListener("pointermove",pointerMove);document.removeEventListener("pointerleave",leave);document.removeEventListener("visibilitychange",visibility);reduced.removeEventListener("change",preference);};
 },[]);

 return <><canvas className="portfolio-particles" ref={canvas} aria-hidden="true"/><div className="elastic-pointer" ref={cursor} aria-hidden="true"/></>;
}
