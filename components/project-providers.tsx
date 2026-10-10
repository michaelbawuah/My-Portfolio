import styles from "./project-platforms.module.css";

const icons: Record<string, string> = {OpenAI: "/tech/openai.png", Claude: "/tech/claude.svg", Gemini: "/tech/googlegemini.svg"};

export function ProjectProviders({providers, compact = false}: {providers?: readonly string[]; compact?: boolean}) {
  if (!providers?.length) return null;
  return <ul className={`${styles.platforms} ${compact ? styles.compact : ""}`} aria-label="AI providers">
    {providers.map(provider => <li key={provider}>{icons[provider] ? <img src={icons[provider]} width={28} height={28} alt="" /> : null}<span>{provider}</span></li>)}
  </ul>;
}
