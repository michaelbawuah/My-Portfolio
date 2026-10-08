import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const { default: worker } = await import(pathToFileURL(resolve("dist/server/index.js")).href);
const origin = "https://michaelbaffourawuah.com";
const paths = ["/", "/about", "/research", "/about/impact", "/projects/toolret"];
const pages = new Map();
const pending = [];

for (const path of paths) {
  const response = await worker.fetch(new Request(origin + path), {}, {
    props: {},
    waitUntil: promise => pending.push(promise),
    passThroughOnException() {},
  });
  assert.equal(response.status, 200, `${path} must open as a full document`);
  assert.match(response.headers.get("content-type") ?? "", /text\/html/, path);
  pages.set(path, await response.text());
  console.log(`${path}: HTTP 200`);
}

function anchors(html) {
  return Array.from(html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g), match => ({
    href: match[1].replaceAll("&amp;", "&"),
    label: match[2].replace(/<[^>]*>/g, "").replaceAll("&amp;", "&").trim(),
  }));
}

const screenshotLinks = [
  { from: "/", label: "Explore research & impact", href: "/about/impact" },
  { from: "/about", label: "Explore research & impact", href: "/about/impact" },
  { from: "/research", label: "Explore the three research studies", href: "/about/impact#research" },
  { from: "/about/impact", label: "Explore my current research", href: "/research" },
];

for (const expected of screenshotLinks) {
  const link = anchors(pages.get(expected.from)).find(anchor => anchor.label === expected.label);
  assert.ok(link, `Missing link: ${expected.label}`);
  assert.equal(link.href, expected.href, expected.label);
}

const impactHtml = pages.get("/about/impact");
const ids = new Set(Array.from(impactHtml.matchAll(/<[^>]+\bid="([^"]+)"/g), match => match[1]));
const experienceLinks = anchors(pages.get("/about")).filter(anchor => anchor.label === "Read the full experience");
assert.equal(experienceLinks.length, 4, "All four earlier experiences must link to their entries");

for (const [path, html] of pages) {
  for (const link of anchors(html)) {
    if (link.href.startsWith("/about/impact") || (path === "/about/impact" && link.href.startsWith("#"))) {
      const target = new URL(link.href, origin + path);
      assert.equal(target.pathname, "/about/impact");
      if (target.hash) assert.ok(ids.has(decodeURIComponent(target.hash.slice(1))), `Missing section: ${link.href}`);
    }
  }
}

assert.match(impactHtml, /From curiosity/);
assert.match(impactHtml, /Assistive Robotic Dog/);
await Promise.allSettled(pending);
console.log("Activity links and every linked impact section resolve in the production build.");
