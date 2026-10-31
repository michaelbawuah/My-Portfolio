import type { ShowcaseProject } from "@/lib/project-showcase";

export const ledgerRepo = "https://github.com/michaelbawuah/Ledger";
export const ledgerCommit = "c0dbffd6a036feb27e225362a92df9792d8e844a";
export const ledgerSource = `${ledgerRepo}/blob/${ledgerCommit}`;
export const ledgerCI = `${ledgerRepo}/actions/runs/38197990587`;
export const ledgerStudy = `${ledgerSource}/docs/performance-study.md`;

export const compilerPilotCommit = "574b9813ca827f0b0a44ede0d14aa9b8b0fdfda8";
export const compilerPilotSource = `${ledgerRepo}/blob/${compilerPilotCommit}`;
export const compilerPilotReadme = `${compilerPilotSource}/tools/compilerpilot/README.md`;
export const compilerPilotPass = `${compilerPilotSource}/tools/compilerpilot/llvm/LedgerLoadElim.cpp`;
export const compilerPilotReview = `${compilerPilotSource}/tools/compilerpilot/results/llvm-pass/llvm18-20261030-01-review.md`;
export const compilerPilotDiff = `${compilerPilotSource}/tools/compilerpilot/results/llvm-pass/llvm18-20261030-01/ir-inspection/FastBook-process.diff`;
export const compilerPilotCI = `${ledgerRepo}/actions/runs/41147862466`;

export const ledgerProject: ShowcaseProject = {
  slug: "ledger", name: "Ledger", type: "C++23 / limit order book", category: "Systems",
  accent: "blue", number: "", logo: "/projects/ledger/card-logo.svg",
  summary: "Match orders. Measure every trade-off.",
  description: "I built an allocation-free C++23 matching engine with an independent reference and reproducible measurements, then extended it with CompilerPilot and an authored LLVM 18 optimization pass.",
  image: "/projects/ledger/cover.svg",
  imageAlt: "Illustrated Ledger order book, showing bid and ask queues, the matching engine, and execution reports",
  stack: ["C++", "Python", "LLVM", "CMake"], repo: ledgerRepo, live: "",
  evidence: "18.74M synthetic commands/s · 271 ns p99",
  evidenceLabel: "Same-host core replay · 100M differential commands",
  note: "The cover is an explanatory illustration. Benchmark figures show retained synthetic measurements from the documented AMD EPYC virtual host.",
  overview: "Ledger models the execution core of a single instrument: best price, then the oldest maker. I built bounded storage, an independent STL oracle and reproducible measurements. CompilerPilot adds typed compiler tuning and an authored LLVM 18 pass tested against the same engine contract.",
  features: [
    { title: "Deterministic matching", text: "Limit and market orders, partial fills, cancel-replace, and GTC/IOC/FOK follow a documented price-time contract." },
    { title: "Bounded hot path", text: "A fixed order arena, intrusive FIFO queues, an ID index, and occupancy bitmaps avoid heap allocation during processing." },
    { title: "Evidence you can inspect", text: "100M differential commands, passing CI, exact latency frequencies, and 18 figures document behavior and measured trade-offs." },
    { title: "CompilerPilot & LLVM", text: "Typed compiler choices and a MemorySSA-based LLVM 18 pass, with IR regression tests and three pipelines checked against the matching-engine oracle." },
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
    { label: "Explore CompilerPilot", href: compilerPilotReadme, kind: "compiler tooling" },
    { label: "Read the authored LLVM pass", href: compilerPilotPass, kind: "LLVM pass" },
    { label: "Inspect the audited pipeline experiment", href: compilerPilotReview, kind: "audit" },
  ],
};
