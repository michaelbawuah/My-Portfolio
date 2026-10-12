export const ledgerEvidenceCommit = "c0dbffd6a036feb27e225362a92df9792d8e844a";
export const ledgerEvidenceSource = `https://github.com/michaelbawuah/Ledger/blob/${ledgerEvidenceCommit}`;

export const ledgerFigureCategories = [
  "Core",
  "Workloads",
  "FOK",
  "Concurrency",
  "Strategy",
  "Mechanisms",
] as const;

export type LedgerFigureCategory = (typeof ledgerFigureCategories)[number];

export interface LedgerFigure {
  slug: string;
  src: string;
  title: string;
  category: LedgerFigureCategory;
  caption: string;
  alt: string;
  sourceUrl: string;
}

function figure(
  filename: string,
  title: string,
  category: LedgerFigureCategory,
  caption: string,
  alt: string,
): LedgerFigure {
  return {
    slug: filename.replace(/\.svg$/, ""),
    src: `/projects/ledger/figures/${filename}`,
    title,
    category,
    caption,
    alt,
    sourceUrl: `${ledgerEvidenceSource}/docs/figures/study/${filename}`,
  };
}

/** Sixteen captured-data figures and two explanatory diagrams, preserved verbatim. */
export const ledgerFigures: readonly LedgerFigure[] = [
  figure(
    "01-core-distribution.svg",
    "The complete latency distribution",
    "Core",
    "The bitmap engine reaches 18.74M commands/s and a 271 ns median run p99 in the retained core replay. Exact distributions show the tail beyond a single percentile; these are synthetic replays on a shared AMD EPYC host.",
    "Exact core latency cumulative distributions and survival curves for the reference, linear-search, and bitmap engines.",
  ),
  figure(
    "02-workload-envelope.svg",
    "Six workloads, six different envelopes",
    "Workloads",
    "Cancel-heavy flow reaches 27.442M commands/s; trade-storm flow reaches 10.169M. Each point is the median of nine per-run measurements. The bars show observed minimum–maximum runs, not confidence intervals.",
    "Throughput and diagnostic latency tails across balanced, cancel-heavy, trade-storm, replace-heavy, sparse FOK, and rejection-stress workloads.",
  ),
  figure(
    "03-action-latency.svg",
    "What an applied command costs",
    "Workloads",
    "Applied commands are grouped by action and workload using pooled exact diagnostic samples. Groups with fewer than 30 observations are masked. This separate observer pass explains behavior rather than supplying the headline throughput.",
    "Applied-command conditional latency percentiles grouped by command action, workload, and engine.",
  ),
  figure(
    "04-rejection-latency.svg",
    "Rejections have their own cost",
    "Workloads",
    "Rejected commands are separated from applied commands so inexpensive failures do not obscure expensive accepted work. The diagnostic observer runs outside the timed call but can affect the next command’s cache state.",
    "Rejected-command conditional latency percentiles by rejection outcome, workload, and engine, with low-count groups masked.",
  ),
  figure(
    "05-fill-conditioned-latency.svg",
    "More maker fills, a longer tail",
    "Workloads",
    "In bitmap trade-storm flow, the pooled zero-fill group has an 80 ns p99; commands filling exactly 64 makers have a 3,726 ns p99. One incoming order can therefore represent very different amounts of matching work.",
    "Diagnostic latency conditioned on observed maker-fill count, revealing longer latency tails for commands with more maker fills.",
  ),
  figure(
    "06-fill-level-heatmap.svg",
    "Orders filled and levels emptied",
    "Workloads",
    "Maker fills and emptied price levels measure different work: several FIFO orders can occupy one level. The joint distribution uses observed events, not an inferred count of internal scans.",
    "Joint distribution heatmaps of observed maker-fill counts and emptied price-level counts across measured workloads.",
  ),
  figure(
    "07-depth-scaling.svg",
    "A deeper book changes the envelope",
    "Workloads",
    "With the domain fixed at 65,536 ticks, bitmap throughput falls from 14.250M to 9.922M commands/s between 64 and 16,384 initial orders per side. The sweep also changes preload, capacity, and interactions, so it does not isolate a single cache mechanism.",
    "Fixed-domain depth sweep showing throughput and latency tails as initial orders per side increase from 64 to 16,384.",
  ),
  figure(
    "08-domain-scaling.svg",
    "Where the simpler reference wins",
    "FOK",
    "At one million price ticks and 64 initial orders per side, the ordered reference reaches 5.498M commands/s versus the bitmap engine’s 4.382M. A fixed-domain bitmap is not automatically the best representation for sparse liquidity.",
    "Sparse price-domain sweep in which the ordered reference overtakes the bitmap engine at the widest one-million-tick domain.",
  ),
  figure(
    "09-fok-controlled-ablation.svg",
    "Isolate the FOK preflight change",
    "FOK",
    "With storage and next-price lookup held constant, bitmap FOK preflight reaches a 77.924× median paired throughput ratio against retained linear preflight at one million ticks. This extreme synthetic case is a controlled comparison, not a universal speedup.",
    "Paired bitmap-versus-legacy FOK preflight throughput and latency ratios across six sparse price domains.",
  ),
  figure(
    "10-run-variation.svg",
    "Every retained run remains visible",
    "Workloads",
    "Run-by-run results expose variation instead of selecting a best capture. Workload studies use three seeds, three repeats, rotating engine order, and identical untimed preload.",
    "Individual throughput and diagnostic latency measurements for retained engine runs across six workloads.",
  ),
  figure(
    "11-book-depth-snapshots.svg",
    "The resting book, before and after",
    "Workloads",
    "Reference-engine snapshots show actual resting quantities at initial, midpoint, and final sequences. These untimed captures connect measurements to an evolving book rather than merely accepted and canceled commands.",
    "Bid and ask depth snapshots from the reference book at initial, midpoint, and final replay sequences.",
  ),
  figure(
    "12-book-state-trajectory.svg",
    "Trace state through the replay",
    "Workloads",
    "Live orders, resting quantity, best prices, and cumulative trades are recorded at deterministic boundaries. These state trajectories are explanatory captures outside the timed matching calls.",
    "Deterministic replay trajectories for live orders, resting quantity, best bid and ask, and cumulative trade count.",
  ),
  figure(
    "13-measured-command-mix.svg",
    "Check what the workload really does",
    "Workloads",
    "Trade-storm input is 98.511% limit commands and 1.489% markets; rejection stress rejects 80.046% of commands. Actual command and outcome proportions explain why a workload label alone is insufficient.",
    "Measured command-action mix and applied-versus-rejected outcome proportions for each of six synthetic workload profiles.",
  ),
  figure(
    "14-queue-capacity-envelope.svg",
    "Queue capacity moves the latency boundary",
    "Concurrency",
    "Zero-clock throughput and sampled enqueue-to-processing latency come from separate captures. With 64 consumer work rounds, a 4,096-slot queue has a 2.748 ms median p99: pipeline waiting has a different boundary from core matching time.",
    "Lock-free SPSC queue throughput and separately sampled end-to-end latency for capacities 8, 64, 512, and 4,096 with two consumer-work settings.",
  ),
  figure(
    "15-queue-backpressure.svg",
    "Observe producer and consumer pressure",
    "Concurrency",
    "Full and empty retry counts describe busy-spin attempts, not dropped orders or measured occupancy. Every retained queue capture produces and consumes its complete command count.",
    "Producer full-queue retries and consumer empty-queue retries across SPSC capacities and consumer-work settings.",
  ),
  figure(
    "16-strategy-accounting.svg",
    "Correct accounting includes a loss",
    "Strategy",
    "The seeded passive market-maker simulation ends at −17,386 tick-units of mark-to-market P&L and −20 inventory units. All 10,001 rows reconcile cash plus inventory times mid; this is accounting validation rather than profitable live trading.",
    "Captured passive market-maker inventory, cash, mid-price, and mark-to-market P&L through a seeded simulation that ends with a loss.",
  ),
  figure(
    "17-core-memory-contract.svg",
    "The allocation-free memory contract",
    "Mechanisms",
    "An explanatory diagram maps the bounded price domain, pooled order slots, intrusive FIFO links, ID index, and caller-owned report buffer. It describes the design; it is not a performance measurement.",
    "Explanatory memory diagram showing bounded price levels, fixed order storage, intrusive FIFO links, ID lookup, occupancy bitmap, and output-buffer ownership.",
  ),
  figure(
    "18-fifo-worked-trade.svg",
    "One exact FIFO match, step by step",
    "Mechanisms",
    "A buy IOC for eight units meets asks A4, B6, and C3 at 100 ticks. A fills first, then four units of B; B2 and C3 remain. This illustrative example emits two trades and seven events, with no price level emptied.",
    "Illustrative exact FIFO trade: a buy IOC for eight units fills maker A’s four units then four of maker B’s six; B retains two units ahead of C’s three.",
  ),
];
