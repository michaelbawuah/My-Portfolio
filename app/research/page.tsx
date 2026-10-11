import { DocumentLink as Link } from "@/components/document-link";
import { pageMetadata } from "@/lib/seo";
import { PageFrame, PageTitle } from "@/components/portfolio-layout";
import { ProjectMark, ResearchComparison } from "@/components/portfolio-interactions";

export const metadata=pageMetadata(
  "Undergraduate research",
  "ToolRet selective reranking and Disclosure Drift quantitative ML research on SEC 10-K risk disclosures, point-in-time market data, and reproducible evaluation.",
  "/research"
);

export default function Research(){return <PageFrame>
  <PageTitle kicker="UNDERGRADUATE RESEARCH" title={<>Ask carefully.<br/><em>Measure honestly.</em></>} description="My research spans machine learning systems and quantitative finance: define the question, freeze the evaluation, and keep the evidence inspectable."/>

  <section className="research-feature">
    <div className="research-feature-copy">
      <div className="project-brand"><ProjectMark slug="toolret" name="ToolRet"/><div><span className="mono">RETRIEVAL / 2026</span><h2>ToolRet</h2></div></div>
      <h3>When does reranking earn its cost?</h3>
      <p>A learned router chooses when to run an expensive cross-encoder over a 37,292-tool catalog. Development, calibration, and confirmation are separated by relevant-tool components.</p>
      <div className="hero-actions"><Link href="/projects/toolret" className="button-primary">Explore the study</Link><a href="/documents/toolret-research-study.pdf" className="button-secondary" target="_blank" rel="noopener noreferrer">Read research PDF</a></div>
      <p className="scope-note">Undergraduate research at Cornell Engineering. This is an empirical study, not a peer-reviewed publication.</p>
    </div>
    <div className="research-result"><span className="mono">UNTOUCHED CONFIRMATION</span><strong>23.4<span>%</span></strong><h3>fewer cross-encoder calls</h3><ResearchComparison/><p className="scope-note">Predeclared tolerance: 0.01 nDCG@10 loss. Quality superiority was not established.</p></div>
  </section>

  <div className="research-method">
    <article><span className="mono">QUESTION</span><h3>Is every rerank useful?</h3><p>Compare always reranking with a conditional decision that uses first-stage retrieval signals.</p></article>
    <article><span className="mono">DESIGN</span><h3>Freeze before confirmation.</h3><p>Separate relevant-tool components across development, calibration, and 1,500 untouched confirmation queries.</p></article>
    <article><span className="mono">EVIDENCE</span><h3>Keep the result inspectable.</h3><p>Retain configurations, random controls, the report, and an independent numerical audit in the public repository.</p></article>
  </div>

  <section className="research-feature">
    <div className="research-feature-copy">
      <div className="project-brand"><div><span className="mono">QUANTITATIVE RESEARCH & MACHINE LEARNING / 2026</span><h2>Disclosure Drift</h2></div></div>
      <h3>Do changes in SEC 10-K risk disclosures improve out-of-sample return forecasts?</h3>
      <p>Engineered a point-in-time financial research pipeline spanning SEC filings, CRSP/Compustat market data, historical security identities, text features, and leakage-resistant temporal alignment.</p>
      <div className="hero-actions"><a href="https://github.com/michaelbawuah/Disclosure-drift" className="button-primary" target="_blank" rel="noopener noreferrer">Open research repository</a></div>
      <p className="scope-note">Ongoing undergraduate research. Development infrastructure and audits are complete at the recorded checkpoints; the final empirical evaluation remains separate from these engineering results.</p>
    </div>
    <div className="research-result"><span className="mono">DEVELOPMENT MARKET PIPELINE</span><strong>22.6<span>M+</span></strong><h3>daily equity records</h3><p className="scope-note">Requested-window market data covers all 3,103 expected trading sessions.</p></div>
  </section>

  <div className="research-method">
    <article><span className="mono">SEC TEXT</span><h3>215 filings. 180 annual comparisons.</h3><p>Extract and align annual risk-disclosure changes with point-in-time controls while preserving filing chronology and source evidence.</p></article>
    <article><span className="mono">MARKET DATA</span><h3>Reconcile identity before returns.</h3><p>Build CRSP/Compustat infrastructure for historical security identifiers, return calculations, and benchmark validation across 3,103 sessions.</p></article>
    <article><span className="mono">ML EVALUATION</span><h3>Make look-ahead bias testable.</h3><p>Use chronological splits, regression baselines, robustness checks, bootstrap inference, automated CI, and a full reproduction suite with 1,019 passing tests.</p></article>
  </div>

  <aside className="impact-current-research"><div><span className="mono">EARLIER ENGINEERING RESEARCH</span><h2>Assistive robotics & embedded systems.</h2><p>My research background also includes a robotic assistance dog, a voice-controlled vehicle with ultrasonic obstacle avoidance, and a fingerprint-based attendance system.</p><Link href="/about/impact#research" className="text-link">Explore the three research studies</Link></div></aside>
</PageFrame>;}
