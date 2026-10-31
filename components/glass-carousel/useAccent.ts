"use client";
import { useEffect } from "react";

export default function useAccent(color?: string, on?: string) {
  useEffect(() => {
    const root = document.documentElement, meta = document.querySelector('meta[name="theme-color"]');
    const previous = { color: root.style.getPropertyValue("--acc"), on: root.style.getPropertyValue("--acc-on"), meta: meta?.getAttribute("content") };
    return () => {
      for (const [key, value] of [["--acc", previous.color], ["--acc-on", previous.on]]) {
        if (value) root.style.setProperty(key, value); else root.style.removeProperty(key);
      }
      if (previous.meta != null) meta?.setAttribute("content", previous.meta);
    };
  }, []);
  useEffect(() => {
    if (!color) return;
    const root = document.documentElement;
    root.style.setProperty("--acc", color);
    root.style.setProperty("--acc-on", on || "#04130f");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      // Resolve category tokens independently of the root's in-progress color transition.
      const probe = document.createElement("span");
      probe.style.color = color; probe.style.display = "none";
      document.body.appendChild(probe); meta.setAttribute("content", getComputedStyle(probe).color); probe.remove();
    }
  }, [color, on]);
}
