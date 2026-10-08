import type { ComponentProps } from "react";

// Keep page navigation native so a client-router failure cannot consume a click.
// This also lets the browser handle fragment targets, modified clicks, and history.
export function DocumentLink(props: ComponentProps<"a">) {
  return <a {...props} />;
}
