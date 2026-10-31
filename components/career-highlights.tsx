import { ArrowUpRight } from "lucide-react";
import styles from "./career-highlights.module.css";

const highlights = [
  {
    organization: "NavoX",
    role: "Founder & Product Lead",
    date: "2026 – Present · Student AI assistant",
    description: "Leading product and engineering across student planning, coursework, voice interactions, and reviewable actions.",
    href: "/about#navox-founder",
    metric: "Product & engineering",
    tone: "teal",
  },
  {
    organization: "CUAir",
    role: "Imaging Systems Software Engineer",
    date: "Oct 2024 – Present · Cornell project team",
    description: "Leading a 9-engineer imaging subteam, connecting VTOL aircraft, cameras, and a Spring Boot + PostgreSQL ground server.",
    href: "/about#cuair",
    metric: "9 engineers",
    tone: "amber",
  },
  {
    organization: "SIVOXI",
    role: "Software Engineering & AI Intern",
    date: "May – Aug 2026 · Hybrid",
    description: "Shipped 15+ React and Flutter features, built secure API integrations, and cut ML data preparation time by 25%.",
    href: "/about#sivoxi",
    metric: "15+ features",
    tone: "indigo",
  },
  {
    organization: "Hudson River Trading",
    role: "Inside HRT · Algorithm Development Fellow",
    date: "May 2026 · New York, NY",
    description: "One of six selected for the quantitative research track. Built an order-book engine and tested reactive trading strategies.",
    href: "/about#hrt-fellowship",
    metric: "1 of 6 selected",
    tone: "rose",
  },
] as const;

export function CareerHighlights() {
  return <section className={styles.section} aria-labelledby="career-highlights-heading">
    <div className={styles.heading}>
      <div><span className="mono">EXPERIENCE / ENGINEERING & QUANT</span><h2 id="career-highlights-heading">From the ground server<br/>to the <span>trading system.</span></h2></div>
      <a className="text-link" href="/about#experience">Explore my experience <ArrowUpRight size={17}/></a>
    </div>
    <div className={styles.grid}>{highlights.map(item => <a href={item.href} className={`${styles.card} glass-experience-card`} data-tone={item.tone} key={item.organization}>
      <span className={styles.organization}>{item.organization}<ArrowUpRight size={18} aria-hidden="true"/></span>
      <h3>{item.role}</h3><span className={styles.date}>{item.date}</span><p>{item.description}</p><strong className={styles.metric}>{item.metric}</strong>
    </a>)}</div>
    <p className={styles.programs}>Fellowships & programs also include D. E. Shaw Connect, Bloomberg Engineering Discovery, Susquehanna Discover Day, and Two Sigma New Seekers.</p>
  </section>;
}
