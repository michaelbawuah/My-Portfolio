import { DocumentLink as Link } from "@/components/document-link";
import { ChevronDown, FlaskConical } from "lucide-react";
import { PageFrame, PageTitle } from "@/components/portfolio-layout";
import { activityChapters, type ActivityEntry } from "@/lib/activity";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Research & Impact — robotics, leadership & service",
  "Michael Baffour Awuah’s earlier engineering research, Oya Ghana internship, Springboard scholarship, Opoku Ware School robotics leadership, and community service.",
  "/about/impact",
);

function ActivityCard({ entry }: { entry: ActivityEntry }) {
  return (
    <article className="impact-entry" id={entry.id} aria-labelledby={`${entry.id}-title`}>
      <span className="impact-organization">{entry.organization}</span>
      <h3 id={`${entry.id}-title`}>{entry.title}</h3>
      <p className="impact-summary">{entry.summary}</p>
      <dl className="impact-metrics">
        {entry.metrics.map(metric => (
          <div key={metric.label}><dt>{metric.value}</dt><dd>{metric.label}</dd></div>
        ))}
      </dl>
      {entry.technologies ? (
        <ul className="impact-technologies" aria-label="Methods and technologies">
          {entry.technologies.map(technology => <li key={technology}>{technology}</li>)}
        </ul>
      ) : null}
      <details className="impact-details">
        <summary>{entry.detailLabel}<ChevronDown size={18} aria-hidden="true" /></summary>
        <div>
          {entry.paperTitle ? <p className="impact-paper-title"><strong>Research title</strong>{entry.paperTitle}</p> : null}
          <ul>{entry.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
        </div>
      </details>
    </article>
  );
}

export default function Impact() {
  return (
    <PageFrame className="impact-shell">
      <PageTitle kicker="MICHAEL BAFFOUR AWUAH · RESEARCH & IMPACT" title={<>Robotics, leadership<br />and <em>service.</em></>} description="At Opoku Ware School in Ghana, I led our robotics team in national and international competitions. My research explored assistive robots for people with disabilities. I also completed about 700 hours of community service and helped raise $15,000 for shelter construction and food support." />
      <nav className="impact-index" aria-label="Research and impact sections">
        {activityChapters.map(chapter => (
          <a href={`#${chapter.id}`} key={chapter.id}>{chapter.label}</a>
        ))}
      </nav>
      {activityChapters.map(chapter => (
        <section className="impact-chapter" id={chapter.id} key={chapter.id} aria-labelledby={`${chapter.id}-heading`}>
          <header className="impact-chapter-heading">

            <div><span className="mono">{chapter.label}</span><h2 id={`${chapter.id}-heading`}>{chapter.title}</h2><p>{chapter.introduction}</p></div>
          </header>
          <div className={`impact-entries${chapter.entries.length > 1 ? " impact-research-grid" : ""}`}>
            {chapter.entries.map(entry => <ActivityCard entry={entry} key={entry.id} />)}
          </div>
        </section>
      ))}
      <aside className="impact-current-research" aria-labelledby="current-research-title">
        <FlaskConical size={30} aria-hidden="true" />
        <div><span className="mono">RESEARCH AT CORNELL</span><h2 id="current-research-title">The questions keep evolving.</h2><p>My independent undergraduate research now explores the cost and quality of tool retrieval through ToolRet.</p><Link href="/research" className="text-link">Explore my current research</Link></div>
      </aside>
    </PageFrame>
  );
}
