"use client";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

const PourButton = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<"a">>(function PourButton({ href, children, className = "", ...rest }, ref) {
  const external = /^https?:\/\//.test(href || "");
  return <a {...rest} ref={ref} href={href} draggable={false} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={`pour ${className}`}>
    <span className="pour__liquid" aria-hidden="true">
      {Array.from({ length: 5 }, (_, k) => <i className="pour__blob" key={k}/>)}
      <i className="pour__drop"/>{Array.from({ length: 3 }, (_, k) => <i className="pour__splash" key={k}/>)}
    </span>
    <span className="pour__label">{children}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
  </a>;
});
export default PourButton;
