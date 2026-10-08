export type KeyboardMode = "hero" | "skills" | "experience" | "projects" | "contact";
export type KeyboardPose = {x:number;y:number;rx:number;ry:number;rz:number;scale:number};
export function routeKeyboardMode(path:string):KeyboardMode {
 if(path === "/") return "hero";
 if(path === "/contact") return "contact";
 if(path === "/work" || path.startsWith("/projects/")) return "projects";
 return "experience";
}
/** Distinct compositions, with a continuous turn as the visitor scrolls. */
export function keyboardPose(mode:KeyboardMode,progress:number,width:number,height:number):KeyboardPose {
 const p=Math.max(0,Math.min(1,progress)),mobile=width<801;
 const factor=mobile?Math.min(Math.max(width/390,.65),1.25):Math.min(Math.max(width/1280,.5),1.15);
 const base:KeyboardPose={x:mobile?0:width*.2,y:-height*.12,rx:0,ry:0,rz:0,scale:(mobile?.13:.25)*factor};
 if(mode==="hero") return {...base,x:mobile?0:-width*.23,ry:p*Math.PI*2,rx:Math.sin(p*Math.PI)*.16};
 if(mode==="skills") return {...base,ry:Math.PI/12};
 if(mode==="experience") return {...base,rx:Math.PI/12,ry:-Math.PI/4+p*Math.PI*1.5,rz:-.06};
 if(mode==="projects") return {...base,x:0,rx:Math.PI,ry:Math.PI/3+p*Math.PI*.8,rz:Math.PI,scale:(mobile?.14:.32)*factor};
 return {...base,rx:-.2,ry:-Math.PI/8,scale:(mobile?.13:.23)*factor};
}
