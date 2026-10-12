import type { ShowcaseProject } from "@/lib/project-showcase";

export const ledgerRepo = "https://github.com/michaelbawuah/Ledger";
export const ledgerCommit = "c0dbffd6a036feb27e225362a92df9792d8e844a";
export const ledgerSource = `${ledgerRepo}/blob/${ledgerCommit}`;
export const ledgerCI = `${ledgerRepo}/actions/runs/38197990587`;
export const ledgerStudy = `${ledgerSource}/docs/performance-study.md`;

export const ledgerProject: ShowcaseProject = {
  slug: "ledger", name: "Ledger", type: "C++23 / limit order book", category: "Systems",
  accent: "blue", number: "", logo: "/projects/ledger/card-logo.svg",
  summary: "Match orders. Measure every trade-off.",
  description: "I built an allocation-free C++23 limit order book and matching engine, then tested it against an independent reference. Explore price-time matching, memory layout, a two-thread feed adapter, and the experiments behind its performance.",
  image: "/projects/ledger/cover.svg",
  imageAlt: "Illustrated Ledger order book, showing bid and ask queues, the matching engine, and execution reports",
  stack: ["C++", "Python", "CMake"], repo: ledgerRepo, live: "",
  evidence: "18.74M synthetic commands/s · 271 ns p99",
  evidenceLabel: "Same-host core replay · 100M differential commands",
  note: "The cover is an explanatory illustration. Benchmark figures show retained synthetic measurements from the documented AMD EPYC virtual host.",
  overview: "Ledger models the execution core of a single instrument. Incoming orders match the best available price, then the oldest maker at that price. I designed bounded storage and explicit failure behavior, built a separate STL reference, and recorded both favorable and unfavorable performance results.",
  features: [
    { title: "Deterministic matching", text: "Limit and market orders, partial fills, cancel-replace, and GTC/IOC/FOK follow a documented price-time contract." },
    { title: "Bounded hot path", text: "A fixed order arena, intrusive FIFO queues, an ID index, and occupancy bitmaps avoid heap allocation during processing." },
    { title: "Evidence you can inspect", text: "100M differential commands, passing CI, exact latency frequencies, and 18 figures document behavior and measured trade-offs." },
  ],
  stages: [
    { title: "Decode the command", text: "A versioned little-endian feed validates framing before the engine checks order semantics." },
    { title: "Admit or reject", text: "The book checks output capacity and validates the command; FOK liquidity is checked before mutation." },
    { title: "Match price, then time", text: "Cached best quotes and occupied-price bitmaps find eligible levels; intrusive FIFO queues preserve maker priority." },
    { title: "Publish the result", text: "Caller-owned reports record trades, fills, cancellation, expiry, and explicit rejects; the caller drains each batch." },
  ],
  resources: [
    { label: "Explore the source", href: ledgerRepo, kind: "source" },
    { label: "Read the performance study", href: ledgerStudy, kind: "measurements" },
    { label: "Inspect the passing CI run", href: ledgerCI, kind: "verification" },
    { label: "Reproduce and audit the figures", href: `${ledgerSource}/docs/reproducibility.md`, kind: "reproduce" },
    { label: "Order and event semantics", href: `${ledgerSource}/docs/semantics.md`, kind: "contract" },
    { label: "Raw core measurement packet", href: `${ledgerSource}/bench/results/core-v2/summary.json`, kind: "raw data" },
  ],
};
