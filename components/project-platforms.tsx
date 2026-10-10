import styles from "./project-platforms.module.css";

const icons: Record<string, string> = {macOS: "/tech/apple.svg", Linux: "/tech/linux.svg", Windows: "/tech/windows.svg"};

export function ProjectPlatforms({platforms, compact = false}: {platforms?: readonly string[]; compact?: boolean}) {
  if (!platforms?.length) return null;
  return <ul className={`${styles.platforms} ${compact ? styles.compact : ""}`} aria-label="Supported desktop platforms">
    {platforms.map(platform => <li key={platform}>{icons[platform] ? <img src={icons[platform]} width={28} height={28} alt="" /> : null}<span>{platform}</span></li>)}
  </ul>;
}
