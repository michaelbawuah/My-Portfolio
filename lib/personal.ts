import photos from "./personal-photos.json";
export const socialProfiles={tiktok:"https://www.tiktok.com/@mbasteins560",instagram:"https://www.instagram.com/mba_steins/"};
export type PersonalPhoto={src:string;width:number;height:number;alt:string;caption:string;group:string};
export const personalPhotos:PersonalPhoto[]=photos;
export const cadetPhotos=personalPhotos.filter(p=>p.group==="rotc");
export const creatorPhotos=personalPhotos.filter(p=>p.group==="automotive");
export const aboutPhoto=personalPhotos.find(p=>p.group==="portrait")!;
