import type { ShowcaseProject } from "@/lib/project-showcase";

export const gatehavenRepo = "https://github.com/michaelbawuah/Gatehaven";
export const gatehavenSource = `${gatehavenRepo}/blob/4f91d0f6e1af19b68e901042bf0677b4135c6608`;
export const gatehavenRelease = `${gatehavenRepo}/releases/tag/v0.5.0-preview.1`;
export const gatehavenCI = `${gatehavenRepo}/actions/runs/38036451768`;
export const gatehavenDemo = "/projects/gatehaven/gameplay-demo.mp4";

export const gatehavenProject: ShowcaseProject = {
  slug: "gatehaven",
  name: "Gatehaven",
  type: "C++23 / SDL3 circuit game",
  platforms: ["macOS", "Linux", "Windows"],
  category: "Systems",
  accent: "green",
  number: "",
  logo: "/logos/gatehaven.svg",
  summary: "Build circuits. Bring logic to life.",
  description: "I engineered Gatehaven, a cross-platform circuit simulator game in C++23 and SDL3, and shipped native x64 and ARM64 previews for macOS, Linux, and Windows. Build circuits, change inputs, and trace each signal one tick at a time.",
  image: "/projects/gatehaven/desktop.png",
  imageAlt: "Gatehaven’s circuit editor showing a powered AND gate and a wire crossing with independent horizontal and vertical signals",
  stack: ["C++", "Python"],
  repo: gatehavenRepo,
  live: "",
  evidence: "macOS · Linux · Windows",
  evidenceLabel: "x64 / ARM64 previews · 18-job CI pipeline",
  note: "Actual Gatehaven screenshots and a scripted gameplay recording from the published development preview.",
  overview: "I built Gatehaven to make digital logic something you can experiment with. Draw a wire, connect a gate, change an input, and follow the result one tick at a time. Underneath the editor, I wrote a simulation core that runs independently of the window, so the same circuit rules can be tested without opening the app.",
  features: [
    { title: "Build and experiment", text: "Connect gates, relays, crossings, and interactive screens. Start with a built-in lesson or draw a circuit of your own." },
    { title: "Follow every change", text: "Run, pause, step, and reset. Watch powered paths change while horizontal and vertical crossing channels stay independent." },
    { title: "Keep your work", text: "Undo and redo edits, save native circuit files, recover abandoned sessions, and share selections between app windows." },
  ],
  stages: [
    { title: "Draw a circuit", text: "The editor stores occupied cells in a sparse grid. Drawing, moving, and pasting commit as undoable changes." },
    { title: "Compile the circuit graph", text: "A circuit revision becomes an indexed graph of nodes and conductive components. Crossing wires retain separate axes." },
    { title: "Advance a tick", text: "Controls read the previous tick’s power, then the engine propagates through the resulting connections. Reusable buffers avoid rebuilding temporary state each step." },
    { title: "See the result", text: "SDL3 renders the visible circuit and its signals. Settled circuits can skip propagation until an edit, reset, or live endpoint wakes them." },
  ],
  resources: [
    { label: "Download the desktop preview", href: gatehavenRelease, kind: "release" },
    { label: "Source code", href: gatehavenRepo, kind: "source" },
    { label: "Architecture and design decisions", href: `${gatehavenSource}/docs/architecture.md`, kind: "engineering" },
    { label: "Verification record", href: `${gatehavenSource}/docs/verification.md`, kind: "evidence" },
    { label: "Published candidate CI run", href: gatehavenCI, kind: "tests" },
    { label: "Circuit editor manual", href: `${gatehavenSource}/docs/manual.md`, kind: "guide" },
  ],
};
