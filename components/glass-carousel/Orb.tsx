import { memo, type CSSProperties } from "react";

export type OrbVariant = "core" | "ring" | "twin" | "liquid" | "lattice";
export type OrbStyle = { variant: OrbVariant; color: string };

/* One orb family per category. Override per project with `project.orb`. */
export const CATEGORY_ORBS: Record<string, OrbStyle> = {
  "AI & ML":       { variant: "core",    color: "var(--gc-teal)" },
  Systems:         { variant: "ring",    color: "var(--gc-amber)" },
  Research:        { variant: "twin",    color: "var(--gc-cobalt)" },
  Collaboration:   { variant: "liquid",  color: "var(--gc-coral)" },
  Algorithms:      { variant: "lattice", color: "var(--gc-lime)" },
};

export function orbFor(project: { category: string; orb?: Partial<OrbStyle> }): OrbStyle {
  return { ...(CATEGORY_ORBS[project.category] || CATEGORY_ORBS["AI & ML"]), ...(project.orb || {}) };
}

/**
 * <Orb variant="ring" color="var(--gc-amber)" size={84} />
 * variants: core | ring | twin | liquid | lattice
 * Purely decorative: always aria-hidden.
 */
type Props = { variant?: OrbVariant; color?: string; size?: number | string; className?: string; style?: CSSProperties };
function Orb({ variant = "core", color = "var(--gc-teal)", size = 84, className = "", style }: Props) {
  const vars = { "--orb": color, "--orb-size": typeof size === "number" ? `${size}px` : size, ...style } as CSSProperties;
  return (
    <span className={`gc-orb gc-orb--${variant} ${className}`} style={vars} aria-hidden="true">
      {variant === "core" && (
        <>
          <span className="gc-orb__body" />
          <span className="gc-orb__core" />
          <span className="gc-orb__sheen" />
        </>
      )}

      {variant === "ring" && (
        <span className="gc-orb__space">
          <span className="gc-orb__body" />
          <span className="gc-orb__plane">
            <span className="gc-orb__ring" />
            <span className="gc-orb__spin"><span className="gc-orb__moon" /></span>
          </span>
        </span>
      )}

      {variant === "twin" && (
        <span className="gc-orb__space">
          <span className="gc-orb__plane gc-orb__plane--twin">
            <span className="gc-orb__spin gc-orb__spin--slow">
              <span className="gc-orb__body gc-orb__body--a" />
              <span className="gc-orb__body gc-orb__body--b" />
            </span>
          </span>
        </span>
      )}

      {variant === "liquid" && (
        <span className="gc-orb__goo">
          <span className="gc-orb__blob" />
          <span className="gc-orb__drop" />
        </span>
      )}

      {variant === "lattice" && (
        <>
          <span className="gc-orb__body" />
          <span className="gc-orb__grid" />
          <span className="gc-orb__node gc-orb__node--1" />
          <span className="gc-orb__node gc-orb__node--2" />
          <span className="gc-orb__node gc-orb__node--3" />
          <span className="gc-orb__sheen" />
        </>
      )}
    </span>
  );
}

export default memo(Orb);
