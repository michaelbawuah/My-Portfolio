"use client";
import {useId,useState,type FormEvent} from "react";
import {z} from "zod";
import {person} from "@/lib/portfolio";
import LiquidButton from "@/components/glass-carousel/LiquidButton";

export const contactTopics=["Opportunity","Collaboration","Just saying hello"] as const;
export type ContactTopic=(typeof contactTopics)[number];
const prompts:Record<ContactTopic,string>={Opportunity:"Tell me about the role, team, and what you’re building…",Collaboration:"What’s the idea, and what would you like us to build together?","Just saying hello":"A question, a shared interest, or a simple hello…"};
const schema=z.object({name:z.string().trim().min(2,"Please enter your name.").max(80,"Use 80 characters or fewer."),email:z.string().trim().email("Please enter a valid email address."),topic:z.enum(contactTopics),message:z.string().trim().min(10,"Please write at least 10 characters.").max(2000,"Keep your message under 2,000 characters.")});

export function ContactComposer({heading="What are you thinking?",topic:controlledTopic,onTopicChange}:{heading?:string;topic?:ContactTopic;onTopicChange?:(topic:ContactTopic)=>void}) {
  const id=useId();
  const [errors,setErrors]=useState<Record<string,string>>({});
  const [status,setStatus]=useState("");
  const [localTopic,setLocalTopic]=useState<ContactTopic>("Opportunity");
  const [length,setLength]=useState(0);
  const topic=controlledTopic??localTopic;
  function choose(value:ContactTopic){setLocalTopic(value);onTopicChange?.(value);}
  function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    const form=event.currentTarget,data=new FormData(form);
    const result=schema.safeParse({name:data.get("name"),email:data.get("email"),topic,message:data.get("message")});
    if(!result.success){setErrors(Object.fromEntries(result.error.issues.map(issue=>[String(issue.path[0]),issue.message])));setStatus("");const field=form.elements.namedItem(String(result.error.issues[0].path[0]));if(field instanceof HTMLElement)field.focus();return;}
    setErrors({});const {name,email,message}=result.data;
    const subject=`${topic} — ${name}`,body=`Hi Michael,\n\n${message}\n\n${name}\n${email}`;
    window.location.href=`mailto:${person.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("Your email app has been requested. Review the draft and send it there. If it did not open, use the email address below.");
  }
  return <form className="contact-composer" onSubmit={submit} noValidate>
    <div className="composer-heading"><span className="mono">LET’S START WITH AN IDEA</span><h2>{heading}</h2></div>
    <fieldset className="composer-topics"><legend>I’m reaching out about</legend>{contactTopics.map(value=><label key={value}><input type="radio" name="topic" value={value} checked={topic===value} onChange={()=>choose(value)}/><span>{value}</span></label>)}</fieldset>
    <div className="composer-fields"><label>Your name<input name="name" autoComplete="name" placeholder="Alex Morgan" maxLength={80} aria-invalid={!!errors.name} aria-describedby={errors.name?`${id}-name-error`:undefined}/>{errors.name&&<span id={`${id}-name-error`} role="alert">{errors.name}</span>}</label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="alex@example.com" aria-invalid={!!errors.email} aria-describedby={errors.email?`${id}-email-error`:undefined}/>{errors.email&&<span id={`${id}-email-error`} role="alert">{errors.email}</span>}</label></div>
    <label className="composer-message">Your message<textarea name="message" rows={5} placeholder={prompts[topic]} maxLength={2000} onChange={event=>setLength(event.target.value.length)} aria-invalid={!!errors.message} aria-describedby={errors.message?`${id}-message-error`:undefined}/>{errors.message&&<span id={`${id}-message-error`} role="alert">{errors.message}</span>}<small className="composer-count">{length.toLocaleString()} / 2,000</small></label>
    <div className="composer-submit"><LiquidButton type="submit" arrow>Open email draft</LiquidButton><p>You review and send it in your email app.</p></div>{status&&<p className="composer-status" role="status">{status}</p>}
  </form>;
}
