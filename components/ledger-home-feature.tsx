import { ArrowUpRight } from "lucide-react";
import styles from "./ledger-home-feature.module.css";

export function LedgerHomeFeature() {
  return <section className={styles.feature} aria-labelledby="ledger-home-title">
    <div className={styles.copy}><span className="mono">NEW / C++23 SYSTEMS ENGINEERING</span><h2 id="ledger-home-title">Ledger.<br /><em>Inside the matching engine.</em></h2><p>An allocation-free order book, verified across 100M commands. Step through a match, explore the memory layout, and inspect the measured performance envelope.</p><div className={styles.stats}><span><strong>18.74M/s</strong> synthetic core replay</span><span><strong>271 ns</strong> median run p99</span></div><a href="/projects/ledger" className="button-primary">Explore Ledger <ArrowUpRight size={17} /></a></div>
    <a className={styles.visual} href="/projects/ledger" aria-label="Explore Ledger’s matching demo, architecture, and benchmark figures"><img src="/projects/ledger/cover.svg" width={1200} height={800} alt="Ledger illustration showing an eight-unit buy matching FIFO maker queues" loading="lazy" /></a>
  </section>;
}
