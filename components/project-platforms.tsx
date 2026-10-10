import styles from "./project-platforms.module.css";

export function ProjectPlatforms({platforms, compact = false}: {platforms?: readonly string[]; compact?: boolean}) {
  if (!platforms?.length) return null;
  return <ul className={`${styles.platforms} ${compact ? styles.compact : ""}`} aria-label="Supported desktop platforms">
    {platforms.map(platform => <li key={platform}>{platform}</li>)}
  </ul>;
}
