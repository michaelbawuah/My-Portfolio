"use client";

import { useId, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp, Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ledgerEvidenceSource,
  ledgerFigureCategories,
  ledgerFigures,
  type LedgerFigure,
  type LedgerFigureCategory,
} from "@/lib/ledger-figures";
import styles from "./ledger-evidence-gallery.module.css";

type Metric = "throughput" | "p99";
type FigureFilter = "All" | LedgerFigureCategory;

const engines = [
  { name: "STL reference", kind: "reference", throughput: 8.25, p99: 481 },
  { name: "Fast linear", kind: "linear", throughput: 18.67, p99: 301 },
  { name: "Fast bitmap", kind: "bitmap", throughput: 18.74, p99: 271 },
] as const;

/** A compact view of the same-host core packet; no derived or simulated values. */
export function LedgerBenchmarkCompare() {
  const [metric, setMetric] = useState<Metric>("throughput");
  const noteId = useId();
  const throughput = metric === "throughput";
  const ceiling = throughput ? 20 : 500;

  return (
    <div className={styles.benchmark}>
      <div className={styles.benchmarkHeading}>
        <div>
          <span className={styles.eyebrow}>CORE REPLAY / SAME HOST</span>
          <h3>Compare the implementations.</h3>
        </div>
        <div className={styles.metricSwitch} role="group" aria-label="Benchmark metric">
          <button type="button" aria-pressed={throughput} onClick={() => setMetric("throughput")}>
            Throughput
          </button>
          <button type="button" aria-pressed={!throughput} onClick={() => setMetric("p99")}>
            p99 latency
          </button>
        </div>
      </div>
      <div className={styles.chartContext}>
        <span>{throughput ? "Million commands / second" : "Nanoseconds / command"}</span>
        <strong>{throughput ? "Higher is better" : "Lower is better"}</strong>
      </div>
      <dl className={styles.engineRows} aria-describedby={noteId}>
        {engines.map((engine) => (
          <div className={styles.engineRow} key={engine.kind} data-engine={engine.kind}>
            <dt>{engine.name}</dt>
            <dd>
              <span className={styles.barTrack} aria-hidden="true">
                <span className={styles.barFill} style={{ width: `${engine[metric] / ceiling * 100}%` }} />
              </span>
              <span className={styles.barValue}>
                {throughput ? engine.throughput.toFixed(2) : engine.p99}
                <small>{throughput ? "M/s" : "ns"}</small>
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <div className={styles.chartScale} aria-hidden="true">
        <span>0</span><span>{ceiling} {throughput ? "M/s" : "ns"}</span>
      </div>
      <p className={styles.benchmarkNote} id={noteId}>
        Medians across five runs of the same one-million-command replay on an AMD EPYC 9V74
        shared host. Throughput uses whole-batch timing; p99 is the median of the five
        per-run percentiles and includes clock overhead. C++23 · GCC 13.3 · CPU 0.
      </p>
      <a className={styles.sourceLink} href={`${ledgerEvidenceSource}/bench/results/core-v2/summary.json`} target="_blank" rel="noopener noreferrer">
        Inspect the captured core packet <ArrowUpRight size={15} aria-hidden="true" />
      </a>
    </div>
  );
}

/** Original retained figures, with captions and an accessible full-size viewer. */
export function LedgerEvidenceGallery() {
  const [filter, setFilter] = useState<FigureFilter>("All");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<LedgerFigure | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const gridId = useId();
  const filtered = ledgerFigures.filter((figure) => filter === "All" || figure.category === filter);
  const visible = expanded ? filtered : filtered.slice(0, 4);

  function changeFilter(next: FigureFilter) {
    setFilter(next);
    setExpanded(false);
  }

  return (
    <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
      <div className={styles.gallery}>
        <div className={styles.galleryHeading}>
          <div>
            <span className={styles.eyebrow}>OPEN THE EVIDENCE</span>
            <h3>Every figure tells a part of the story.</h3>
          </div>
          <p>16 measured figures. 2 mechanism diagrams. All preserved from the repository.</p>
        </div>
        <div className={styles.filters} role="group" aria-label="Filter Ledger figures">
          {(["All", ...ledgerFigureCategories] as const).map((category) => {
            const count = category === "All" ? ledgerFigures.length : ledgerFigures.filter((figure) => figure.category === category).length;
            return (
              <button
                type="button"
                key={category}
                aria-pressed={filter === category}
                aria-controls={gridId}
                aria-label={`${category === "All" ? "All" : category} figures, ${count} available`}
                onClick={() => changeFilter(category)}
              >
                {category}<span aria-hidden="true">{count}</span>
              </button>
            );
          })}
        </div>
        <p className={styles.galleryCount} aria-live="polite">
          Showing {visible.length} of {filtered.length} {filter === "All" ? "figures" : `${filter.toLowerCase()} figures`}. Select a figure to read it at full size.
        </p>
        <div className={styles.figureGrid} id={gridId}>
          {visible.map((figure) => (
            <figure className={styles.figureCard} key={figure.slug}>
              <button
                type="button"
                className={styles.figurePreview}
                aria-label={`Enlarge ${figure.title}`}
                aria-haspopup="dialog"
                onClick={(event) => { trigger.current = event.currentTarget; setSelected(figure); }}
              >
                <img src={figure.src} alt={figure.alt} width={1200} height={700} loading="lazy" decoding="async" />
                <span className={styles.enlargeHint}><Maximize2 size={15} aria-hidden="true" />Read full size</span>
              </button>
              <figcaption>
                <span className={styles.figureCategory}>{figure.category}</span>
                <h4>{figure.title}</h4>
                <p>{figure.caption}</p>
                <a className={styles.sourceLink} href={figure.sourceUrl} target="_blank" rel="noopener noreferrer">
                  Original figure <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
        {filtered.length > 4 && (
          <div className={styles.expandRow}>
            <button type="button" aria-expanded={expanded} aria-controls={gridId} onClick={() => setExpanded((value) => !value)}>
              {expanded ? "Show fewer figures" : `Explore all ${filtered.length} figures`}
              {expanded ? <ChevronUp size={17} aria-hidden="true" /> : <ChevronDown size={17} aria-hidden="true" />}
            </button>
            <span>{filter === "All" ? "Or choose a topic above." : "Every retained figure in this topic."}</span>
          </div>
        )}
      </div>
      <DialogContent
        className={styles.figureDialog}
        data-lenis-prevent
        onCloseAutoFocus={(event) => { event.preventDefault(); trigger.current?.focus(); }}
      >
        {selected && <>
          <div className={styles.dialogHeading}>
            <span className={styles.eyebrow}>{selected.category} / ORIGINAL FIGURE</span>
            <DialogTitle className={styles.dialogTitle}>{selected.title}</DialogTitle>
            <DialogDescription className={styles.dialogDescription}>{selected.caption}</DialogDescription>
          </div>
          <div className={styles.zoomViewport} tabIndex={0} role="region" aria-label={`${selected.title}, scrollable full-size figure`}>
            <img src={selected.src} alt={selected.alt} className={styles.zoomImage} />
          </div>
          <div className={styles.dialogFooter}>
            <p>Scroll inside the figure on small screens.</p>
            <a className={styles.sourceLink} href={selected.src} target="_blank" rel="noopener noreferrer">Open SVG <ArrowUpRight size={15} aria-hidden="true" /></a>
            <a className={styles.sourceLink} href={selected.sourceUrl} target="_blank" rel="noopener noreferrer">Repository source <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
        </>}
      </DialogContent>
    </Dialog>
  );
}
