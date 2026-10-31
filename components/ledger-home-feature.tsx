import { ArrowUpRight } from "lucide-react";
import styles from "./ledger-home-feature.module.css";
import { LiquidButton } from "@/components/glass/liquid-button";

export function LedgerHomeFeature() {
  return <section className={`${styles.feature} glass-feature`} aria-labelledby="ledger-home-title">
    <div className={styles.copy}><span className="mono">C++23 SYSTEMS / LLVM COMPILER WORK</span><h2 id="ledger-home-title">Ledger.<br /><em>Inside the matching engine.</em></h2><p>An allocation-free order book, verified across 100M commands. Explore price-time matching, memory layout, and CompilerPilot—compiler tooling with an authored LLVM 18 optimization pass.</p><div className={styles.stats}><span><strong>18.74M/s</strong> synthetic core replay</span><span><strong>271 ns</strong> median run p99</span></div><LiquidButton href="/projects/ledger" icon={<ArrowUpRight size={17} aria-hidden="true"/>}>Explore Ledger</LiquidButton></div>
    <a className={styles.visual} href="/projects/ledger" aria-label="Explore Ledger’s matching demo, architecture, and benchmark figures"><img src="/projects/ledger/cover.svg" width={1200} height={800} alt="Ledger illustration showing an eight-unit buy matching FIFO maker queues" loading="lazy" /></a>
  </section>;
}
