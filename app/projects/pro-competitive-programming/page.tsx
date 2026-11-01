import LiquidButton from "@/components/glass-carousel/LiquidButton";
import { CaseVisual } from "@/components/case-visual";
import { ExternalLink, Code2, FileText, CheckCheck } from "lucide-react";
import { PageFrame, TechStack } from "@/components/portfolio-layout";
import { SectionNavigator } from "@/components/section-navigator";
import { pageMetadata } from "@/lib/seo";
import { competitiveProject as project, competitiveRepo, competitiveSource } from "@/lib/competitive-programming";
import solutions from "@/lib/competitive-solutions.json";

export const metadata = pageMetadata("Pro Competitive Programming — C++ algorithms", "Explore Michael Baffour Awuah’s maintained collection of 835 verified C++ reference implementations from CSES, Codeforces, and AtCoder, with explanations, visuals, and reproducible tests.", "/projects/pro-competitive-programming");

const platforms = [{ name: "CSES", count: 96, width: "11.50%", path: "cses" }, { name: "Codeforces", count: 114, width: "13.65%", path: "codeforces" }, { name: "AtCoder", count: 625, width: "74.85%", path: "atcoder" }];
const checks = [
  ["835", "Standalone C++17 builds", "Warnings treated as errors."],
  ["2,964", "Fixed input/output cases", "Distinct sample and edge-case fixtures."],
  ["32,040", "Library property comparisons", "Reusable structures checked against simple models."],
  ["10,100", "Differential & structural cases", "101 solutions; deterministic seed 2110."],
  ["31", "Constraint-limit regressions", "Large inputs, long chains, and integer limits."],
  ["35", "Runner & checker tests", "Catalogue integrity and semantic output checks."],
];

export default function CompetitiveProgrammingPage() {
  const overview = <>
    <div className="notebook-heading"><span className="mono">WHY I BUILT IT</span><h2>A tested C++ algorithm reference library.</h2><p>{project.overview}</p></div>
    <div className="cp-platforms">{platforms.map(p => <a key={p.name} href={`${competitiveRepo}/tree/main/solutions/${p.path}`} target="_blank" rel="noopener noreferrer"><span className="mono">{p.name}</span><strong>{p.count}</strong><span>C++ implementations <ExternalLink size={15}/></span></a>)}</div>
    <div className="cp-coverage" role="img" aria-label="835 C++ implementations: 96 CSES, 114 Codeforces, 625 AtCoder">{platforms.map(p => <span key={p.name} style={{ width: p.width }} title={`${p.name}: ${p.count}`}/>)}</div>
    <div className="feature-grid">{project.features.map(feature => <article key={feature.title}><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
    <div className="cp-topics" aria-label="Algorithm topics">{["Graph algorithms", "Dynamic programming", "Binary search", "Range queries", "Greedy algorithms", "Strings", "Number theory", "Combinatorics"].map(topic => <span key={topic}>{topic}</span>)}</div>
    <section className="built-with"><div className="section-heading"><span className="mono">IMPLEMENTATION & TESTING</span><h2>C++ at the center.</h2></div><TechStack technologies={project.stack}/><p>C++17 reference implementations and reusable headers, with Python tooling for catalogue checks, test execution, and differential verification.</p></section>
  </>;
  const algorithms = <>
    <div className="notebook-heading"><span className="mono">SEE THE REASONING</span><h2>Six patterns, made visible.</h2><p>These worked examples show recurring algorithmic patterns. Follow a diagram, trace the steps, and connect the reasoning to the C++ implementation below.</p></div>
    <div className="cp-visual-grid">{solutions.map((solution, i) => <figure key={solution.path}><a href={`#solution-${i + 1}`}><img src={`/projects/pro-cp/${solution.visual}.svg`} alt={`${solution.technique} worked example for ${solution.title}`} width={980} height={600} loading="lazy"/></a><figcaption><span className="mono">{solution.technique}</span><h3>{solution.title}</h3><p>{solution.description}</p><a href={`#solution-${i + 1}`} className="text-link">Explore the solution</a></figcaption></figure>)}</div>
  </>;
  const selected = <>
    <div className="notebook-heading"><span className="mono">READ THE C++</span><h2>Inside the implementations.</h2><p>Six examples from the collection, covering different ways to approach a problem. Read the C++ here, then open the notes for the reasoning, complexity, and mistakes to watch for.</p></div>
    <div className="cp-solutions">{solutions.map((solution, i) => <article key={solution.path} id={`solution-${i + 1}`} className="cp-solution"><div className="cp-solution-heading"><span className="mono">{solution.platform}</span><span>{solution.technique}</span></div><h3>{solution.title}</h3><p>{solution.description}</p><div className="cp-complexity"><span><small>TIME</small>{solution.time}</span><span><small>SPACE</small>{solution.space}</span></div><details><summary><Code2 size={18}/>Read C++17 implementation</summary><pre tabIndex={0} aria-label={`${solution.title} C++ source`}><code>{solution.code}</code></pre></details><div className="cp-solution-links"><a href={`${competitiveSource}/${solution.path}`} target="_blank" rel="noopener noreferrer">Source on GitHub <ExternalLink size={15}/></a><a href={`${competitiveSource}/${solution.notes}`} target="_blank" rel="noopener noreferrer">Reasoning & learning notes <FileText size={15}/></a></div></article>)}</div>
  </>;
  const evidence = <>
    <div className="notebook-heading"><span className="mono">RECORDED OCTOBER 7, 2026</span><h2>Tested beyond the sample cases.</h2><p>The repository includes tests alongside the implementations so students can check behavior and catch mistakes. These results are recorded in the repository from local runs on Linux with GCC 13.3.0 and Python 3.12.14.</p></div>
    <div className="cp-checks">{checks.map(([value, title, description]) => <article key={title}><CheckCheck size={22}/><strong>{value}</strong><h3>{title}</h3><p>{description}</p></article>)}</div>
    <div className="scope-panel"><span className="mono">CHECK THE WORK YOURSELF</span><p>The verification notes include the commands, test coverage, and boundary cases behind these results. All 835 implementations were included in the recorded sanitizer and library-assertion checks. Students can reproduce the runs and add tests of their own.</p></div>
    <div className="hero-actions"><LiquidButton href={`${competitiveSource}/docs/verification.md`} target="_blank" rel="noopener noreferrer">Read the verification record</LiquidButton><LiquidButton href={`${competitiveRepo}/actions/workflows/verify.yml`} target="_blank" rel="noopener noreferrer" variant="ghost">See CI runs</LiquidButton></div>
  </>;
  const resources = <>
    <div className="notebook-heading"><span className="mono">KEEP EXPLORING</span><h2>Use it in your own preparation.</h2><p>I keep the collection public so other students can inspect the implementations and verification. Choose a topic, try a problem, and use the explanation to work through the parts that are still unclear. The repository also includes a learning roadmap, C++ notes, and reusable data structures.</p></div>
    <figure className="cp-repository"><a href={competitiveRepo} target="_blank" rel="noopener noreferrer"><img src="/projects/pro-cp/repository.png" alt="Pro-Competitive-Programming public GitHub repository listing, supplied by Michael" width={1014} height={365} loading="lazy"/></a><figcaption>The public repository. Counts and code on this page reflect the October 11, 2026 snapshot.</figcaption></figure>
    <div className="resource-grid">{project.resources.map(resource => <a key={resource.href} href={resource.href} target="_blank" rel="noopener noreferrer"><span className="mono">{resource.kind}</span><strong>{resource.label}</strong><ExternalLink size={19}/></a>)}</div>
  </>;
  return <PageFrame className="case-shell cp-shell accent-blue"><div className="case-breadcrumb"><a href="/work">All projects</a><span>/ Pro Competitive Programming</span><span className="mono">ALGORITHMS</span></div><section className="cp-hero"><div><div className="case-brandline"><img src="/tech/cplusplus.svg" width={58} height={58} alt="C++"/><span className="mono">ALGORITHMS / C++ / PROBLEM SOLVING</span></div><h1>Pro Competitive<br/><em>Programming.</em></h1><p className="cp-hero-description">835 C++ implementations.<br/>Tested. Documented. Reproducible.</p><p className="cp-hero-detail">I maintain a public algorithm reference library with explanations, complexity analysis, reusable data structures, and a verification harness spanning fixed, sanitizer, property, differential, and boundary checks.</p><div className="hero-actions"><LiquidButton href="#solutions">Explore the implementations</LiquidButton><LiquidButton href={competitiveRepo} target="_blank" rel="noopener noreferrer" variant="ghost">View repository <ExternalLink size={17}/></LiquidButton></div></div><CaseVisual label="ALGORITHM NOTEBOOK" src="/projects/pro-cp/graph.svg" alt="A directed weighted graph showing a shortest path from node 1 to node 5 with total cost 8" width={980} height={600} caption={<span>Understand the pattern. Follow the implementation.</span>}/></section><SectionNavigator label="Competitive programming sections" sections={[{id:"overview",label:"Overview",content:overview},{id:"algorithms",label:"Visual guide",content:algorithms},{id:"solutions",label:"Implementations",content:selected},{id:"evidence",label:"Evidence",content:evidence},{id:"resources",label:"Code & notes",content:resources}]}/><nav className="case-next" aria-label="More projects"><a href="/work">All projects</a><a href="/projects/fluxion">Explore Fluxion</a></nav></PageFrame>;
}
