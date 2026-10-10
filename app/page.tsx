import { PageFrame } from "@/components/portfolio-layout";
import { HeroExperience } from "@/components/hero-experience";
import { socialProfiles } from "@/lib/personal";
import { person } from "@/lib/portfolio";
import { ActivityHighlights } from "@/components/activity-highlights";
import { BuildShowcase } from "@/components/build-showcase";
export default function Home(){
 const schema={"@context":"https://schema.org","@type":"ProfilePage",mainEntity:{"@type":"Person","@id":`${person.origin}/#person`,name:person.name,alternateName:"MBA~Steins",url:person.origin,image:`${person.origin}/personal/michael-landing-atrium.webp`,description:"Electrical & Computer Engineering undergraduate at Cornell University building software, AI, and distributed systems.",affiliation:{"@type":"CollegeOrUniversity",name:"Cornell University"},sameAs:[person.github,person.linkedin,socialProfiles.tiktok,socialProfiles.instagram],knowsAbout:["Software engineering","Machine learning","Distributed systems","Computer engineering"]}};
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/><PageFrame className="home-shell"><HeroExperience/><BuildShowcase/><ActivityHighlights/></PageFrame></>;
}
