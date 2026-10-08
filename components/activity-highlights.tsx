import { DocumentLink as Link } from "@/components/document-link";

export function ActivityHighlights({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`activity-highlights${compact ? " activity-highlights-compact" : ""}`} aria-labelledby="activity-highlights-title">
      <div className="activity-highlights-copy">
        <span className="mono">RESEARCH & IMPACT</span>
        <h2 id="activity-highlights-title">Where it started.<br /><em>What it shaped.</em></h2>
        <p>Assistive robotics, a team at Opoku Ware School, and community work across Ghana and beyond.</p>
        <Link href="/about/impact" className="text-link">Explore research & impact</Link>
      </div>
      <dl className="activity-highlight-metrics">
        <div><dt>3</dt><dd>assistive & embedded research studies</dd></div>
        <div><dt>8 / 9</dt><dd>robotics competitions won</dd></div>
        <div><dt>≈700</dt><dd>hours of community service</dd></div>
      </dl>
    </section>
  );
}
