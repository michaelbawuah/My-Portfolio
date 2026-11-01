import LiquidButton from "@/components/glass-carousel/LiquidButton";
import { CaseVisual } from "@/components/case-visual";
import { ArrowDown, ArrowUpRight, Check, Code2, Cpu, GitBranch, Layers3, ShieldCheck } from "lucide-react";
import { PageFrame } from "@/components/portfolio-layout";
import { LedgerMatchingDemo } from "@/components/ledger-matching-demo";
import { LedgerBenchmarkCompare, LedgerEvidenceGallery } from "@/components/ledger-evidence-gallery";
import { ledgerProject as project, ledgerRepo, ledgerSource, ledgerCI, ledgerStudy, compilerPilotReadme, compilerPilotPass, compilerPilotReview, compilerPilotDiff, compilerPilotCI } from "@/lib/ledger";
import { pageMetadata } from "@/lib/seo";
import styles from "./ledger.module.css";

export const metadata = {
  ...pageMetadata("Ledger — Matching Engine & LLVM Compiler Work", project.description, "/projects/ledger"),
  openGraph: {
    title: "Ledger — Matching engine and LLVM compiler pass",
    description: project.description,
    url: "https://michaelbaffourawuah.com/projects/ledger",
    type: "website" as const,
    images: [{ url: "/projects/ledger/social-cover.png", width: 1200, height: 800, alt: project.imageAlt }],
  },
};

const sections = [
  ["matching", "01", "Matching"], ["architecture", "02", "Architecture"],
  ["performance", "03", "Performance"], ["verification", "04", "Verification"],
  ["pipeline", "05", "Feed & strategy"], ["compilerpilot", "06", "CompilerPilot"],
  ["figures", "07", "All figures"], ["source", "08", "Source"],
] as const;

function Chapter({ number, label, title, children }: { number: string; label: string; title: string; children: React.ReactNode }) {
  return <header className={styles.chapterHeading}><span className="mono">{number} / {label}</span><h2>{title}</h2><div>{children}</div></header>;
}

export default function LedgerPage() {
  const schema = {
    "@context": "https://schema.org", "@type": "SoftwareSourceCode", name: "Ledger",
    description: project.description, codeRepository: ledgerRepo, programmingLanguage: ["C++23", "Python", "LLVM IR"],
    url: "https://michaelbaffourawuah.com/projects/ledger",
    author: { "@type": "Person", name: "Michael Baffour Awuah", url: "https://michaelbaffourawuah.com" },
    runtimePlatform: "Bounded single-instrument matching core and synthetic replay tools",
  };
  return <PageFrame className={`case-shell accent-blue ${styles.shell}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <div className="case-breadcrumb"><a href="/work">All projects</a><span>/ Ledger</span><span className="mono">SYSTEMS / C++23</span></div>
    <section className={`case-hero ${styles.hero}`}>
      <div className="case-hero-copy">
        <div className="case-brandline"><img className="project-mark" src={project.logo} alt="" width={64} height={64} /><span className="mono">LIMIT ORDER BOOK / MATCHING ENGINE</span></div>
        <h1>Ledger<span>.</span></h1>
        <h2>Inside a low-latency<br />matching engine.</h2>
        <p>Orders arrive. Prices change. Priority must hold. I built Ledger to explore that execution core, then extended it with CompilerPilot and an authored LLVM optimization pass.</p>
        <div className={styles.tags}><span>C++23</span><span>Price-time priority</span><span>Allocation-free processing</span><span>LLVM 18 / MemorySSA</span></div>
        <div className="hero-actions"><LiquidButton href="#matching">Explore the engine <ArrowDown size={17} /></LiquidButton><LiquidButton href={ledgerRepo} target="_blank" rel="noopener noreferrer" variant="ghost"><Code2 size={17} /> GitHub source</LiquidButton></div>
      </div>
      <CaseVisual label="LEDGER / ENGINEERING MAP" src={project.image} alt={project.imageAlt} width={1200} height={800} caption={<span>Single instrument · Integer ticks · Explicit execution reports<br/>Explanatory illustration of the system.</span>}/>
    </section>
    <div className={styles.metrics} aria-label="Recorded Ledger results">
      <div><strong>18.74<span>M/s</span></strong><p>Synthetic core throughput</p><small>2.27× the STL reference</small></div>
      <div><strong>271<span> ns</span></strong><p>Median run p99</p><small>371 ns p99.9 · clock overhead included</small></div>
      <div><strong>100<span>M</span></strong><p>Differential commands</p><small>Four engine modes · zero mismatches</small></div>
      <div><strong>18<span> figures</span></strong><p>Design & measurement</p><small>16 measured figures + 2 mechanism diagrams</small></div>
    </div>
    <p className={styles.measurementNote}>Core metrics: 1M-command replay, seed 20261011, five runs, GCC 13.3 with <code>-O3 -DNDEBUG -march=native</code>, CPU 0 on an AMD EPYC 9V74 virtual host. Throughput and latency use separate passes. <a href={`${ledgerSource}/bench/results/core-v2/summary.json`} target="_blank" rel="noopener noreferrer">Inspect the packet <ArrowUpRight size={13} /></a></p>
    <nav className={styles.chapterNav} aria-label="Ledger case study chapters">{sections.map(([id, number, label]) => <a key={id} href={`#${id}`}><span>{number}</span>{label}</a>)}</nav>

    <section id="matching" className={styles.chapter}>
      <Chapter number="01" label="THE MATCHING RULE" title="Best price first. Oldest order next."><p>A limit order names a price boundary and a quantity. At an eligible price, the oldest resting order gets filled first. The trade executes at that maker’s price. Step through a small example to see partial fills and FIFO priority.</p></Chapter>
      <LedgerMatchingDemo />
      <div className={styles.rules}>
        <article><span className="mono">GTC</span><h3>Good till cancelled</h3><p>Any unmatched quantity can rest in the book and wait for another order.</p></article>
        <article><span className="mono">IOC</span><h3>Immediate or cancel</h3><p>Match available liquidity now; expire any residual instead of adding it to the queue.</p></article>
        <article><span className="mono">FOK</span><h3>Fill or kill</h3><p>Check all eligible liquidity first. If a complete fill is impossible, reject without changing book state.</p></article>
      </div>
      <p className={styles.inlineNote}>Ledger also supports market orders and cancel-replace. A valid replacement loses time priority; a rejected replacement preserves the original order. <a href={`${ledgerSource}/docs/semantics.md`} target="_blank" rel="noopener noreferrer">Read the complete contract.</a></p>
    </section>

    <section id="architecture" className={styles.chapter}>
      <Chapter number="02" label="MEMORY & OWNERSHIP" title="Allocate at startup. Reuse while matching."><p>Before processing, the engine reserves its price levels, order slots, and ID table; the caller supplies preallocated report storage. Slot indices connect orders into FIFO chains. A bitmap helps skip empty prices instead of examining every level.</p></Chapter>
      <figure className={styles.architecture}>
        <div className={styles.architectureTop}><span className="mono">CALLER</span><strong>Command + reusable report buffer</strong><span>Check report capacity before any mutation</span></div>
        <div className={styles.architectureArrow} aria-hidden="true"><ArrowDown size={24} /></div>
        <div className={styles.storageGrid}>
          <article><Layers3 size={24} /><span className="mono">PRICE LEVELS</span><h3>Flat level arrays</h3><p>Aggregate quantity, FIFO head and tail, cached best bid and ask.</p><small>Known-price access: O(1)</small></article>
          <article><Cpu size={24} /><span className="mono">ORDER STORAGE</span><h3>Fixed arena + free list</h3><p>Orders link through slot indices. Completed and cancelled slots return to the pool.</p><small>FIFO append and unlink: O(1)</small></article>
          <article><GitBranch size={24} /><span className="mono">LOOKUP & SEARCH</span><h3>ID index + bitmap</h3><p>Open addressing finds IDs. Occupancy words skip groups of 64 empty prices.</p><small>ID lookup: expected O(1)</small></article>
        </div>
        <div className={styles.architectureArrow} aria-hidden="true"><ArrowDown size={24} /></div>
        <div className={styles.architectureTop}><span className="mono">CALLER</span><strong>Drain execution reports</strong><span>Acceptance · trade · fill · cancel · expire · reject</span></div>
        <figcaption>Ownership and processing boundaries. Detailed memory contracts and a worked FIFO trade appear in the figure explorer below.</figcaption>
      </figure>
      <div className={styles.decisionGrid}>
        <article><h3>A deliberate resource boundary</h3><p>Processing performs no heap allocation, locking, I/O, or resizing. Startup and diagnostic snapshots may allocate. Pool capacity and the price range are configured bounds.</p></article>
        <article><h3>Failure before mutation</h3><p>An undersized caller buffer returns <code>OutputFull</code> without changing the book. FOK checks liquidity before execution, preserving atomic rejection.</p></article>
        <article><h3>Costs depend on the work</h3><p>Executing many makers takes more work. Cancelling can trigger a best-price search. Fixed arrays use memory proportional to the configured domain, including empty prices.</p></article>
      </div>
    </section>

    <section id="performance" className={styles.chapter}>
      <Chapter number="03" label="THE PERFORMANCE ENVELOPE" title="One fast replay is the starting point."><p>I measured the same commands against an independent STL reference and two fast search modes, then changed command mix, depth, and price sparsity. The broader study covers 51 configurations, 612 engine runs, and 28.44M diagnostic latency observations.</p></Chapter>
      <LedgerBenchmarkCompare />
      <div className={styles.findings}>
        <article><span className="mono">WORKLOAD SHAPE</span><h3>Fills drive the tail.</h3><p>Cancel-heavy traffic reaches 27.442M commands/s in the overview. Trade-storm throughput is 10.169M/s with a 1,933 ns diagnostic p99. A low median does not explain a large maker sweep.</p></article>
        <article><span className="mono">CONTROLLED FOK EXPERIMENT</span><h3>Skip empty prices.</h3><p>At a 1M-tick sparse domain, bitmap FOK preflight reaches a 77.924× median paired throughput ratio versus the retained linear FOK control. Both use the same bitmap next-price lookup.</p></article>
        <article><span className="mono">WHERE THE REFERENCE WINS</span><h3>Wide domains have a cost.</h3><p>In that widest sparse-domain workload, the STL reference reaches 5.498M commands/s versus the bitmap engine’s 4.382M/s. A dense price representation has a limit.</p></article>
      </div>
      <div className={styles.protocol}><span className="mono">READ THE MEASUREMENTS CORRECTLY</span><p>The 77.924× result compares a specific optimization with its legacy control. It is separate from the core replay’s 2.27× reference comparison. Conditional latency uses an observer pass that can affect later cache state. Run ranges are observed minima and maxima, not confidence intervals. These captures measure synthetic work on a shared virtual host.</p><a href={`${ledgerSource}/docs/study-methodology.md`} target="_blank" rel="noopener noreferrer">Measurement protocol <ArrowUpRight size={15} /></a></div>
    </section>

    <section id="verification" className={styles.chapter}>
      <Chapter number="04" label="CORRECTNESS BEFORE SPEED" title="Two implementations. One observable contract."><p>The independent reference uses maps, lists, and a hash index. It validates and matches orders with its own logic. Each randomized command goes to both engines, and the checker compares reports, statistics, quantities, and best prices.</p></Chapter>
      <div className={styles.verificationFlow} aria-label="Differential verification flow"><div><span className="mono">IDENTICAL INPUT</span><strong>Seeded command stream</strong></div><div className={styles.verificationBranches}><article><Cpu size={22} /><strong>Fast engine modes</strong><span>Fixed arena + level arrays + search</span></article><article><Code2 size={22} /><strong>Independent STL oracle</strong><span>Maps + lists + separate matching logic</span></article></div><div><ShieldCheck size={24} /><strong>Compare each result and every event field</strong><span>Full structural checks and snapshots at checkpoints</span></div></div>
      <div className={styles.testStats}><article><strong>209,631,029</strong><span>execution reports compared</span></article><article><strong>34,195,803</strong><span>trades compared</span></article><article><strong>24,500</strong><span>snapshot comparisons</span></article></div>
      <div className={styles.checks}>{["Named semantics: priority, partial fills, replace and resource failures", "Allocation counting over scoped hot-path calls", "ASan / UBSan memory and undefined-behavior checks", "Binary-feed fuzzing and malformed-input checks", "ThreadSanitizer and exact-sequence SPSC transfer checks"].map(item => <p key={item}><Check size={18} /><span>{item}</span></p>)}</div>
      <a className={styles.ci} href={ledgerCI} target="_blank" rel="noopener noreferrer"><span className={styles.ciDot} aria-hidden="true" /><strong>Published CI run: all nine runnable jobs passed</strong><span>Open the verification record <ArrowUpRight size={16} /></span></a>
      <p className={styles.inlineNote}>The 100M-command differential stream is a separate correctness experiment. Structural checks run at checkpoints; reports and observable invariants are checked after every command. The long CI differential job is manual-only.</p>
    </section>

    <section id="pipeline" className={styles.chapter}>
      <Chapter number="05" label="BEYOND THE MATCHING CALL" title="A feed handoff. An execution-accounted strategy."><p>I also built a bounded single-producer/single-consumer adapter and a synthetic market maker. They exercise sequencing, backpressure, and fill accounting around the single-threaded matching core.</p></Chapter>
      <div className={styles.pipeline}><article><span className="mono">THREAD 1 / PRODUCER</span><h3>Construct command</h3><p>Write a fixed queue slot. Publish the head with release ordering.</p></article><div className={styles.queue}><span className="mono">SPSC RING</span><div aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div><p>Full returns false.<br />Caller chooses backpressure.</p></div><article><span className="mono">THREAD 2 / CONSUMER</span><h3>Process & drain</h3><p>Acquire the published head. Read the command, match it, and drain reports.</p></article></div>
      <p className={styles.inlineNote}>Queue latency includes enqueue backpressure, queue wait, scheduling, and matching. It differs from core-only p99. The study retains 48 captures, 48M transferred commands, and 240,000 timestamp samples, with separate zero-clock throughput passes.</p>
      <div className={styles.strategy}><div><span className="mono">STRATEGY / SEED 42</span><h3>Account from executions,<br />then mark the inventory.</h3><p>Cash and inventory update from actual trade reports. Quotes respect an inventory cap of ±20 units. After each execution, the 10,000-step synthetic flow moves the mark in the aggressor’s direction, making fills adverse to the passive maker.</p><a href={`${ledgerSource}/docs/strategy.md`} target="_blank" rel="noopener noreferrer">Inspect the accounting rules <ArrowUpRight size={15} /></a></div><div className={styles.pnl}><span className="mono">FINAL MARK-TO-MARKET</span><strong>−17,386</strong><span>tick-units of P&amp;L</span><p>The retained trace shows a loss. Fees, exchange competition, and historical calibration are outside this simulation.</p></div></div>
      <div className={styles.scope}><h3>Current project boundary</h3><p>Ledger is an offline, bounded, single-instrument system. It has no live exchange connection. Stop orders, multi-instrument routing, ITCH, UDP publication, Python bindings, and durable recovery remain outside this version. The optional risk helper checks integer quantity, notional, and exposure limits; callers own reservations and admission sequencing.</p></div>
    </section>

    <section id="compilerpilot" className={`${styles.chapter} ${styles.compilerChapter}`}>
      <Chapter number="06" label="COMPILERPILOT / LLVM 18" title="A compiler pass inside the matching engine."><p>I extended Ledger with CompilerPilot, then wrote a C++ LLVM 18 pass that uses MemorySSA to prove when an integer reload can reuse an earlier value. I compared baseline, early and late pass pipelines against the same matching-engine oracle.</p></Chapter>
      <div className={styles.compilerGrid}>
        <article className={styles.compilerStory}>
          <span className="mono">FROM BUILD FLAGS TO LLVM IR</span>
          <h3>The engine is also my compiler test bed.</h3>
          <p>CompilerPilot lives in Ledger’s repository. Its typed GCC/Clang builds cover PGO and ThinLTO, with reproducible inputs and correctness gates. The authored LLVM plugin goes one layer deeper: it changes the compiler’s intermediate representation.</p>
          <p>MemorySSA tracks memory dependencies. My pass reuses a read only when the pointer, integer type and last possible write agree. It handles aliasing conservatively and skips calls, atomics, volatile reads and metadata contracts.</p>
          <a href={compilerPilotReadme} target="_blank" rel="noopener noreferrer">Explore CompilerPilot <ArrowUpRight size={16} /></a>
        </article>
        <figure className={styles.irProof} aria-labelledby="llvm-proof-title">
          <div className={styles.irProofHeader}><span className="mono">REAL IR / FastBook::process</span><strong id="llvm-proof-title">One redundant read removed.</strong></div>
          <div className={styles.irVersion}><span className="mono">BEFORE / READ AGAIN</span><pre><code>{`%73 = load i32, ptr %remaining107, align 4
store i32 %73, ptr %remaining192, align 4`}</code></pre></div>
          <div className={`${styles.irVersion} ${styles.irAfter}`}><span className="mono">AFTER / REUSE THE PROVEN VALUE</span><pre><code>{`store i32 %67, ptr %remaining192, align 4`}</code></pre></div>
          <figcaption>81 → 80 load instructions in this function before O2. The pass removes one read when placed early; it removes none after LLVM’s standard pipeline. <a href={compilerPilotDiff} target="_blank" rel="noopener noreferrer">Inspect the exact diff <ArrowUpRight size={13} /></a></figcaption>
        </figure>
      </div>
      <div className={styles.compilerEvidence} aria-label="LLVM pass correctness evidence">
        <article><strong>25</strong><span>Structural IR cases</span><small>Aliasing, barriers and analysis safety</small></article>
        <article><strong>4,096</strong><span>Execution values</span><small>Four checks each, before and after</small></article>
        <article><strong>100M</strong><span>Commands per pipeline</span><small>The same differential stream in all three</small></article>
        <article><strong>15</strong><span>CTest cases per pipeline</span><small>All passed on baseline, early and late</small></article>
      </div>
      <div className={styles.protocol}><span className="mono">IMPLEMENTATION & CORRECTNESS EVIDENCE</span><p>The transformed object is checked inside the linked library, then validated against the oracle. These compiler experiments have not established a runtime speedup or an agent-versus-search advantage. The core benchmark figures above remain a separate study.</p><div className={styles.compilerLinks}><a href={compilerPilotPass} target="_blank" rel="noopener noreferrer">Read the pass <ArrowUpRight size={15} /></a><a href={compilerPilotReview} target="_blank" rel="noopener noreferrer">Audit the experiment <ArrowUpRight size={15} /></a><a href={compilerPilotCI} target="_blank" rel="noopener noreferrer">Open LLVM CI <ArrowUpRight size={15} /></a></div></div>
    </section>

    <section id="figures" className={styles.chapter}>
      <Chapter number="07" label="THE COMPLETE FIGURE EXPLORER" title="Look closer. Follow the evidence."><p>Explore all 16 measured figures and both implementation diagrams. Filter by topic, open a figure at full size, and follow its source. Plotted data comes from retained packets with a hash manifest and an independent numerical audit.</p></Chapter>
      <LedgerEvidenceGallery />
    </section>

    <section id="source" className={styles.chapter}>
      <Chapter number="08" label="OPEN THE WORK" title="Read it. Run it. Reproduce it."><p>The code, semantic contract, measurement method, raw results, and audits are public. Core-study and CompilerPilot evidence links each pin their own source revision.</p></Chapter>
      <div className="resource-grid">{project.resources.map(resource => <a key={resource.href} href={resource.href} target="_blank" rel="noopener noreferrer"><span className="mono">{resource.kind}</span><strong>{resource.label}</strong><ArrowUpRight size={19} /></a>)}</div>
      <details className={styles.build}><summary>Build and run a synthetic replay</summary><p>Requires C++23, CMake 3.21+, and Ninja. GoogleTest is optional.</p><pre><code>{`cmake --preset release
cmake --build --preset release --parallel
ctest --preset release
build/release/ledger_generate --out orders.lob --commands 1000000 --seed 20261011
build/release/ledger_bench --input orders.lob --runs 5 --outdir bench/results/local`}</code></pre><p>This portable release preset is for trying the project. The recorded native measurements use the documented compiler flags and CPU affinity; follow the <a href={ledgerStudy} target="_blank" rel="noopener noreferrer">study</a> to reproduce that protocol.</p></details>
    </section>
    <nav className="case-next" aria-label="More projects"><a href="/work">All projects</a><a href="/projects/gatehaven"><img className="project-mark" src="/logos/gatehaven.svg" width={38} height={38} alt="" loading="lazy" /><span>Explore another C++ build<strong>Gatehaven</strong></span></a></nav>
  </PageFrame>;
}
