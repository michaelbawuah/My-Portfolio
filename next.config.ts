import type { NextConfig } from "next";

// Preserve Vinext's default crawler list when adding Googlebot. Blocking
// metadata keeps internal streaming keys out of the HTML Google crawls.
const defaultHtmlLimitedBots = String.raw`(?:^|[^\w-])[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|meta-externalagent|meta-externalfetcher|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight`;

const nextConfig: NextConfig = {
  htmlLimitedBots: new RegExp(`${defaultHtmlLimitedBots}|Googlebot`, "i"),
  async redirects() {
    return [
      {
        // Recover the exact metadata artifact reported in Search Console.
        source: "/projects/:legacy(modelforge:164k2g0)",
        destination: "/projects/modelforge",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
