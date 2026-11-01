import { ArrowUpRight, Code2, Database, Layers3, ListFilter, Smartphone, Sparkles } from "lucide-react";
import styles from "./career-highlights.module.css";

type Highlight = {
  id: string; organization: string; role: string; date: string; description: string;
  href: string; metric: string; metricDetail: string; tone: string; discipline: string;
  logo: string; photo?: string; photoAlt?: string; caption: string; stack: readonly string[];
};

const highlights: readonly Highlight[] = [
  {
    id: "neuralseek", organization: "NeuralSeek", role: "AI Agent Builder Intern",
    date: "Oct – Nov 2025 · Remote",
    description: "Built multi-model Python workflows processing 50,000+ records daily and a multi-step RAG agent for query classification, source ranking, and grounded generation.",
    href: "/about#neuralseek-internship", metric: "−35%", metricDetail: "Token costs · prompt caching & batch inference",
    tone: "teal", discipline: "AGENTIC AI", logo: "/experience/neuralseek-logo.svg", caption: "From retrieval to grounded answers.",
    stack: ["Python", "mAIstro", "RAG", "IBM watsonx"],
  },
  {
    id: "cuair", organization: "CUAir", role: "Imaging Systems Software Engineer",
    date: "Oct 2024 – Present · Cornell project team",
    description: "Leading a 9-engineer imaging subteam, connecting VTOL aircraft, cameras, and a Spring Boot + PostgreSQL ground server.",
    href: "/about#cuair", metric: "9", metricDetail: "Engineers on my subteam",
    tone: "amber", discipline: "AERIAL SYSTEMS", logo: "/experience/cuair-logo.png",
    photo: "/experience/cuair-atlas.jpg", photoAlt: "CUAir’s Atlas aircraft, photographed by the Cornell project team",
    caption: "CUAir · Atlas aircraft", stack: ["Spring Boot", "PostgreSQL", "Raspberry Pi"],
  },
  {
    id: "sivoxi", organization: "SIVOXI", role: "Software Engineering & AI Intern",
    date: "May – Aug 2026 · Hybrid",
    description: "Shipped 15+ React and Flutter features, built secure API integrations, and cut ML data preparation time by 25%.",
    href: "/about#sivoxi", metric: "15+", metricDetail: "Features shipped · 25% less data prep",
    tone: "indigo", discipline: "SOFTWARE + AI", logo: "/experience/sivoxi-logo.svg",
    caption: "Interfaces. Integrations. Intelligence.", stack: ["React", "Flutter", "Python", "REST APIs"],
  },
  {
    id: "hrt", organization: "Hudson River Trading", role: "Inside HRT · Algorithm Development Fellow",
    date: "May 2026 · New York, NY",
    description: "One of six selected for the quantitative research track. Built an order-book engine and tested reactive trading strategies.",
    href: "/about#hrt-fellowship", metric: "1 of 6", metricDetail: "Selected · Quantitative Research track",
    tone: "rose", discipline: "QUANTITATIVE RESEARCH", logo: "/experience/hrt-logo.svg",
    photo: "/experience/hrt-new-york.webp", photoAlt: "View of the New York skyline from Hudson River Trading’s office terrace",
    caption: "HRT · New York office view", stack: ["C++", "Python", "Pandas", "NumPy"],
  },
];

function ExperienceVisual({ item, index }: { item: Highlight; index: number }) {
  return <div className={styles.visual} data-visual={item.id}>
    {item.photo && <img className={styles.photo} src={item.photo} alt={item.photoAlt} width={1200} height={800} loading="lazy" decoding="async" draggable={false} />}
    <div className={styles.visualGrid} aria-hidden="true" />
    <span className={styles.discipline}><i />{item.discipline}</span><span className={styles.index} aria-hidden="true">0{index + 1}</span>
    {item.id === "neuralseek" && <div className={styles.neuralseekArt} aria-hidden="true">
      <div className={styles.agentFlow}>
        <span className={styles.flowLabel}>mAIstro / retrieval agent</span>
        <div className={styles.agentNode}><ListFilter size={20}/><span>Classify</span><small>01 / query</small></div>
        <div className={styles.agentNode}><Database size={20}/><span>Rank</span><small>02 / sources</small></div>
        <div className={styles.agentNode}><Sparkles size={20}/><span>Generate</span><small>03 / grounded</small></div>
      </div>
    </div>}
    {item.id === "sivoxi" && <div className={styles.sivoxiArt} aria-hidden="true">
      <div className={styles.productTile}><Code2 size={20}/><span>Web</span><i /><i /><i /></div>
      <div className={styles.productTile}><Smartphone size={20}/><span>Mobile</span><i /><i /><i /></div>
      <div className={styles.productTile}><Layers3 size={20}/><span>AI & data</span><i /><i /><i /></div>
      <span className={styles.brandCore}><img src={item.logo} alt="" width={76} height={76} loading="lazy" draggable={false}/></span>
    </div>}
    <div className={styles.visualFooter}>
      <span className={styles.brandPlate} data-brand={item.id}><img src={item.logo} alt={`${item.organization} logo`} width={item.id === "neuralseek" ? 1711 : 54} height={item.id === "neuralseek" ? 299 : 54} loading="lazy" draggable={false}/>{item.id !== "hrt" && item.id !== "neuralseek" && <span>{item.organization}</span>}</span>
      <span className={styles.caption}>{item.caption}</span>
    </div>
  </div>;
}

function ExperienceCard({ item, index }: { item: Highlight; index: number }) {
  return <a href={item.href} className={`${styles.card} glass-experience-card`} data-tone={item.tone} aria-label={`${item.organization}: ${item.role}. Explore my experience.`}>
    <ExperienceVisual item={item} index={index}/>
    <div className={styles.body}>
      <div className={styles.organization}>{item.organization}<span className={styles.arrow}><ArrowUpRight size={19} aria-hidden="true"/></span></div>
      <h3>{item.role}</h3><span className={styles.date}>{item.date}</span><p>{item.description}</p>
      <ul className={styles.stack} aria-label="Technologies">{item.stack.map(tech => <li key={tech}>{tech}</li>)}</ul>
      <div className={styles.impact}><strong>{item.metric}</strong><span>{item.metricDetail}</span><span className={styles.readMore}>View experience <ArrowUpRight size={13} aria-hidden="true"/></span></div>
    </div>
  </a>;
}

export function CareerHighlights() {
  return <section id="experience-highlights" className={styles.section} aria-labelledby="career-highlights-heading">
    <div className={styles.heading}>
      <div><span className="mono">EXPERIENCE / ENGINEERING & QUANT</span><h2 id="career-highlights-heading">From the ground server<br/>to the <span>trading system.</span></h2></div>
      <a className="text-link" href="/about#experience">Explore my experience <ArrowUpRight size={17}/></a>
    </div>
    <div className={styles.grid}>{highlights.map((item, index) => <ExperienceCard item={item} index={index} key={item.id}/>)}</div>
    <p className={styles.programs}>Fellowships & programs also include D. E. Shaw Connect, Bloomberg Engineering Discovery, Susquehanna Discover Day, and Two Sigma New Seekers.</p>
  </section>;
}
