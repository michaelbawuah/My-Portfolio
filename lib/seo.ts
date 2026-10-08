import type { Metadata } from "next";
import { person } from "@/lib/portfolio";
export function pageMetadata(title:string,description:string,path:string):Metadata{return {title,description,alternates:{canonical:path},openGraph:{title:`${title} | ${person.name}`,description,url:`${person.origin}${path}`,type:"website"},twitter:{card:"summary",title:`${title} | ${person.name}`,description}};}
