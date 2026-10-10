import { Code2, Download, ExternalLink, Play } from "lucide-react";
import { PageFrame } from "@/components/portfolio-layout";
import { CaseNotebook, PipelineExplorer } from "@/components/portfolio-interactions";
import { gatehavenProject as project, gatehavenRelease, gatehavenCI, gatehavenDemo } from "@/lib/gatehaven";
import { pageMetadata } from "@/lib/seo";
import styles from "./gatehaven.module.css";

export const metadata = pageMetadata(
  "Gatehaven — Digital Logic Sandbox",
  project.description,
  "/projects/gatehaven",
);

export default function GatehavenPage() {
  const overview = <>
    <div className="notebook-heading">
      <span className="mono">THE IDEA</span>
      <h2>Logic you can build, break, and understand.</h2>
      <p>{project.overview}</p>
    </div>
    <figure id="gatehaven-demo" className={styles.demo}>
      <video controls playsInline preload="none" poster="/projects/gatehaven/demo-poster.png" width={1920} height={1080} aria-label="Gatehaven gameplay: building and running a logic circuit" aria-describedby="gatehaven-demo-caption">
        <source src={gatehavenDemo} type="video/mp4" />
        <a href={gatehavenDemo}>Open the Gatehaven gameplay demo</a>.
      </video>
      <figcaption id="gatehaven-demo-caption">A 50-second tour through the actual editor, recorded with scripted input. Native file dialogs are omitted. <a href={gatehavenDemo} target="_blank" rel="noopener noreferrer">Open video</a></figcaption>
    </figure>
    <div className={`feature-grid ${styles.features}`}>
      {project.features.map(feature => <article key={feature.title}><h3>{feature.title}</h3><p>{feature.text}</p></article>)}
      <article><h3>Go beyond the canvas</h3><p>File communicators exchange binary data through explicitly selected local files. The simulation core stays independent of file dialogs and operating-system streams.</p></article>
    </div>
    <section className="built-with" aria-label="Gatehaven technology">
      <div className="section-heading"><span className="mono">BUILT WITH</span><h2>Native from the core up.</h2></div>
      <ul className={styles.technologies}>{["C++23", "SDL3", "CMake", "Python", "CTest", "GitHub Actions"].map(technology => <li key={technology}>{technology}</li>)}</ul>
    </section>
  </>;

  const system = <>
    <div className="notebook-heading">
      <span className="mono">UNDER THE CANVAS</span>
      <h2>From a drawn wire to a running circuit.</h2>
      <p>The part I care about is making each step explainable. A gate reads the previous tick’s inputs before power propagates, so the outcome follows the circuit rules rather than the order in which I happened to place the cells.</p>
    </div>
    <PipelineExplorer steps={project.stages} name="Gatehaven" />
    <figure className={styles.screenshot}>
      <a href="/projects/gatehaven/components.png" target="_blank" rel="noopener noreferrer" aria-label="Open the full-size Gatehaven component gallery"><img src="/projects/gatehaven/components.png" width={1280} height={800} loading="lazy" alt="Gatehaven’s component palette: wires, crossings, power, signals, logic gates, relays, screens, and file ports" /></a>
      <figcaption>The component palette, rendered by Gatehaven. Open the image to inspect it full size.</figcaption>
    </figure>
    <div className="section-heading decisions-heading"><span className="mono">ENGINEERING DECISIONS</span><h2>What sits underneath.</h2></div>
    <div className="decision-grid">
      <article><h3>A core without a window</h3><p>Circuit rules, simulation, documents, and editing live separately from SDL. I can exercise the same engine through headless tests and the command-line tools.</p></article>
      <article><h3>Work where it matters</h3><p>A sparse grid stores occupied cells. Visible-row and column indexes keep drawing focused on the viewport; compiled connections and reusable buffers reduce repeated simulation work.</p></article>
      <article><h3>Edits that survive mistakes</h3><p>Loading validates a complete document before replacing the current circuit. Saves use a temporary file, and recovery snapshots use ownership locks so another window cannot claim active work.</p></article>
    </div>
  </>;

  const evidence = <>
    <div className="notebook-heading">
      <span className="mono">CHECK THE WORK</span>
      <h2>Test the behavior, including the failures.</h2>
      <p>The checks reach past individual gates: they exercise editing, malformed documents, separate app processes, recovery after a killed process, and installed packages. The published preview candidate passed its full CI run across macOS, Windows, and Linux.</p>
    </div>
    <div className="decision-grid">
      <article><h3>Circuit behavior</h3><p>Seeded differential tests compare simulation states. Crossing isolation, delayed edges, edits, resets, and legacy document round trips have explicit checks.</p></article>
      <article><h3>Recovery under failure</h3><p>Separate processes test shared clipboards, competing recovery attempts, abrupt termination, and failed writes that must preserve existing work.</p></article>
      <article><h3>Desktop and packaging</h3><p>SDL event workflows exercise drawing, stepping, zooming, saving, and reopening. CI checks native builds, installed execution, package contents, and sanitizers.</p></article>
    </div>
    <figure className={styles.screenshot}>
      <a href="/projects/gatehaven/lessons.png" target="_blank" rel="noopener noreferrer" aria-label="Open the full-size Gatehaven lessons screenshot"><img src="/projects/gatehaven/lessons.png" width={1280} height={800} loading="lazy" alt="Gatehaven’s built-in circuit lessons menu over the circuit editor" /></a>
      <figcaption>Built-in lessons give you circuits to inspect and change before starting from an empty canvas.</figcaption>
    </figure>
    <div className="scope-panel"><span className="mono">CURRENT RELEASE</span><p>Gatehaven 0.5 Preview 1 is an unsigned development preview; the macOS app is not notarized. Automated checks do not complete the remaining hands-on accessibility, physical-device, and clean-machine acceptance work.</p></div>
    <a href={gatehavenCI} className="text-link" target="_blank" rel="noopener noreferrer">Inspect the published candidate’s CI run</a>
  </>;

  const resources = <>
    <div className="notebook-heading"><span className="mono">OPEN THE WORK</span><h2>Try it, then look inside.</h2><p>Download the desktop preview for your platform, follow the circuit editor manual, or read through the engine and its tests.</p></div>
    <div className={styles.release}>
      <img src={project.logo} alt="" width={88} height={88} loading="lazy" />
      <div><h3>Gatehaven 0.5 Preview 1</h3><p>macOS, Windows, and Linux · Intel / x64 and ARM64 packages</p><a href={gatehavenRelease} className="button-primary" target="_blank" rel="noopener noreferrer"><Download size={17} />Choose your download</a><p className={styles.releaseNote}>The release page includes installation steps, checksums, and preview limitations.</p></div>
    </div>
    <div className="resource-grid">{project.resources.map(resource => <a key={resource.href} href={resource.href} target="_blank" rel="noopener noreferrer"><span className="mono">{resource.kind}</span><strong>{resource.label}</strong><ExternalLink size={19} /></a>)}</div>
  </>;

  return <PageFrame className={`case-shell accent-green ${styles.shell}`}>
    <div className="case-breadcrumb"><a href="/work">All projects</a><span>/ Gatehaven</span></div>
    <section className="case-hero">
      <div className="case-hero-copy">
        <div className="case-brandline"><img className="project-mark" src={project.logo} alt="Gatehaven logo" width={96} height={96} /><span className="mono">C++ / DIGITAL LOGIC SANDBOX</span></div>
        <h1>Gatehaven<span>.</span></h1><h2>{project.summary}</h2><p>{project.description}</p>
        <div className="hero-actions"><a className="button-primary" href={gatehavenRelease} target="_blank" rel="noopener noreferrer"><Download size={17} />Download preview</a><a className="button-secondary" href="#gatehaven-demo"><Play size={17} />Watch gameplay</a><a className="text-link" href={project.repo} target="_blank" rel="noopener noreferrer"><Code2 size={17} /> GitHub source</a></div>
      </div>
      <div className="case-hero-visual">
        <div className="visual-toolbar"><span className="mono">GATEHAVEN / CIRCUIT EDITOR</span><span className="window-controls" aria-hidden="true"><i /><i /><i /></span></div>
        <a href={project.image} target="_blank" rel="noopener noreferrer" className={styles.heroImage} aria-label="Open the full-size Gatehaven circuit editor screenshot"><img src={project.image} alt={project.imageAlt} width={1280} height={800} fetchPriority="high" /></a>
        <div className="visual-bottomline"><span>Native desktop app · C++23 + SDL3</span><span>DEVELOPMENT PREVIEW</span></div>
      </div>
    </section>
    <CaseNotebook overview={overview} system={system} evidence={evidence} resources={resources} labels={["Overview", "How it works", "Evidence", "Code & downloads"]} />
    <nav className="case-next" aria-label="More projects"><a href="/work">All projects</a><a href="/projects/fluxion"><img className="project-mark" src="/logos/fluxion.png" width={38} height={38} alt="" loading="lazy" /><span>Explore another build<strong>Fluxion</strong></span></a></nav>
  </PageFrame>;
}
