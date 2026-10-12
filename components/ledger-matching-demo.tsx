"use client";

import { useId, useState } from "react";
import styles from "./ledger-matching-demo.module.css";

const steps = [
  {
    name: "Resting book",
    title: "Three makers. One price. A strict queue.",
    explanation:
      "A, B, and C offer 13 units at 100 ticks. A arrived first, so it has priority. The best bid rests one tick below at 99.",
    executed: 0,
    depth: 13,
  },
  {
    name: "Order arrives",
    title: "A buy order crosses the spread.",
    explanation:
      "An immediate-or-cancel buy requests 8 units with a limit of 100 ticks. It can trade at the best ask, beginning with maker A.",
    executed: 0,
    depth: 13,
  },
  {
    name: "First fill",
    title: "A fills first. B moves to the front.",
    explanation:
      "The buyer takes all 4 units from A at 100 ticks. A leaves the queue. The incoming order still needs 4 units; B retains priority over C.",
    executed: 4,
    depth: 9,
  },
  {
    name: "Second fill",
    title: "B fills partially. C waits.",
    explanation:
      "The buyer takes 4 of B’s 6 units at 100 ticks. B’s remaining 2 units stay ahead of C’s 3. All 8 requested units have traded.",
    executed: 8,
    depth: 5,
  },
  {
    name: "Complete",
    title: "Two fills. Five units still offered.",
    explanation:
      "The IOC order completes without resting. B remains first with 2 units, followed by C with 3. The ask price stays at 100 because its queue is still nonempty.",
    executed: 8,
    depth: 5,
  },
] as const;

const initialMakers = [
  { name: "A", quantity: 4 },
  { name: "B", quantity: 6 },
  { name: "C", quantity: 3 },
] as const;

function DirectionArrow() {
  return (
    <svg viewBox="0 0 48 24" aria-hidden="true" focusable="false">
      <path d="M2 12h40M34 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LedgerMatchingDemo() {
  const [stepIndex, setStepIndex] = useState(0);
  const id = useId();
  const step = steps[stepIndex];
  const makers = initialMakers
    .filter((maker) => maker.name !== "A" || stepIndex < 2)
    .map((maker) => ({
      ...maker,
      quantity: maker.name === "B" && stepIndex >= 3 ? 2 : maker.quantity,
    }));
  const activeMaker = stepIndex === 1 ? "A" : stepIndex === 2 ? "B" : null;
  const tradeCount = stepIndex >= 3 ? 2 : stepIndex >= 2 ? 1 : 0;
  const incomingStatus = stepIndex === 0 ? "Ready to submit" : stepIndex >= 4 ? "Complete" : step.executed === 8 ? "Fully filled" : "Matching";

  return (
    <div className={styles.demo} aria-labelledby={`${id}-heading`}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Illustrative matching replay</p>
          <h3 id={`${id}-heading`}>Follow eight units through the book.</h3>
        </div>
        <span className={styles.counter}>Step {stepIndex + 1} / {steps.length}</span>
      </div>

      <ol className={styles.steps} aria-label="Matching replay steps">
        {steps.map((item, index) => (
          <li key={item.name}>
            <button
              type="button"
              onClick={() => setStepIndex(index)}
              aria-current={index === stepIndex ? "step" : undefined}
              aria-label={`Show step ${index + 1}: ${item.name}`}
              className={index === stepIndex ? styles.selectedStep : index < stepIndex ? styles.completedStep : ""}
            >
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              {item.name}
            </button>
          </li>
        ))}
      </ol>

      <div className={styles.scene}>
        <section className={`${styles.ticket} ${stepIndex > 0 ? styles.ticketActive : ""}`} aria-label="Incoming buy order">
          <div className={styles.panelHeading}>
            <span className={styles.buyLabel}>Buy</span>
            <span className={styles.protocol}>IOC</span>
          </div>
          <div className={styles.ticketPrice}>8 <span>units</span></div>
          <p className={styles.limit}>Limit <strong>100</strong> ticks</p>
          <div className={styles.fillMeter} aria-hidden="true">
            <span style={{ width: `${(step.executed / 8) * 100}%` }} />
          </div>
          <dl className={styles.ticketStats}>
            <div><dt>Executed</dt><dd>{step.executed} / 8</dd></div>
            <div><dt>Remaining</dt><dd>{8 - step.executed}</dd></div>
          </dl>
          <span className={styles.status}>{incomingStatus}</span>
        </section>

        <div className={`${styles.direction} ${stepIndex === 1 || stepIndex === 2 ? styles.directionActive : ""}`}>
          <DirectionArrow />
          <span>{stepIndex === 0 ? "Submit" : stepIndex >= 3 ? "8 units filled" : "Match FIFO"}</span>
        </div>

        <section className={styles.book} aria-label="Resting order book">
          <div className={styles.bookHeading}>
            <span>Resting book</span>
            <span>Price → time priority</span>
          </div>
          <div className={styles.priceLevel}>
            <div className={styles.priceTag}>
              <span>Best ask</span>
              <strong>100</strong>
              <span>ticks</span>
            </div>
            <div className={styles.levelQueue}>
              <div className={styles.queueHeading}>
                <span>Earlier arrival → later arrival</span>
                <strong>{step.depth} units</strong>
              </div>
              <ol className={styles.queue} aria-label="Ask queue in matching priority order">
                {makers.map((maker, index) => (
                  <li key={maker.name} className={`${styles.maker} ${activeMaker === maker.name ? styles.activeMaker : ""}`}>
                    <span className={styles.queuePosition}>Queue {index + 1}</span>
                    <span className={styles.makerName}>Maker {maker.name}</span>
                    <span className={styles.quantity}><strong>{maker.quantity}</strong> units</span>
                    {activeMaker === maker.name && <span className={styles.nextFill}>Next to fill</span>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className={styles.spread}><span />1 tick spread<span /></div>
          <div className={`${styles.priceLevel} ${styles.bidLevel}`}>
            <div className={styles.priceTag}>
              <span>Best bid</span>
              <strong>99</strong>
              <span>ticks</span>
            </div>
            <div className={styles.bidQueue}>
              <span className={styles.bidMaker}>Maker D</span>
              <span><strong>5</strong> units</span>
              <span className={styles.unchanged}>Resting</span>
            </div>
          </div>
        </section>
      </div>

      <div className={styles.readout}>
        <div className={styles.explanation} role="status" aria-live="polite" aria-atomic="true">
          <h4>{step.title}</h4>
          <p>{step.explanation}</p>
        </div>
        <section className={styles.tape} aria-label="Trades produced by this replay">
          <div className={styles.tapeHeading}><span>Trade tape</span><span>{tradeCount} {tradeCount === 1 ? "fill" : "fills"}</span></div>
          {tradeCount === 0 ? <p className={styles.emptyTape}>No trades yet.</p> : (
            <ol>
              <li><span>01 · Maker A</span><strong>4 @ 100</strong></li>
              {tradeCount === 2 && <li><span>02 · Maker B</span><strong>4 @ 100</strong></li>}
            </ol>
          )}
          <p className={styles.tapeNote}>Quantity @ price in integer ticks</p>
        </section>
      </div>

      <div className={styles.controls}>
        <button type="button" onClick={() => setStepIndex(0)} disabled={stepIndex === 0} className={styles.reset} aria-label="Reset matching replay to the resting book">Reset replay</button>
        <div>
          <button type="button" onClick={() => setStepIndex((index) => Math.max(0, index - 1))} disabled={stepIndex === 0} aria-label="Show previous matching step">← Back</button>
          <button type="button" onClick={() => setStepIndex((index) => Math.min(steps.length - 1, index + 1))} disabled={stepIndex === steps.length - 1} className={styles.next} aria-label="Show next matching step">Next step →</button>
        </div>
      </div>
    </div>
  );
}
