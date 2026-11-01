import { pageMetadata } from "@/lib/seo";
import { PageFrame } from "@/components/portfolio-layout";
import { ContactExperience } from "@/components/contact-experience";
export const metadata=pageMetadata("Contact","Connect with Michael Baffour Awuah for software engineering, AI/ML opportunities, or technical collaboration.","/contact");
export default function Contact(){return <PageFrame className="contact-shell"><ContactExperience/></PageFrame>;}
