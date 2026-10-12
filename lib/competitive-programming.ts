export const competitiveRepo = "https://github.com/michaelbawuah/Pro-Competitive-Programming";
export const competitiveCommit = "350e7e758312f51b19f4a94dce4132f7ab27a2c1";
export const competitiveSource = `${competitiveRepo}/blob/${competitiveCommit}`;
export const competitiveProject = {
  slug: "pro-competitive-programming", name: "Pro Competitive Programming", type: "C++ algorithm reference library", category: "Algorithms", accent: "blue", number: "07",
  summary: "835 verified C++ reference implementations with explanations, complexity analysis, and reproducible tests.",
  description: "A maintained C++ algorithm reference collection spanning 835 implementations from CSES, Codeforces, and AtCoder, with explanations, complexity analysis, and reproducible verification.",
  image: "/projects/pro-cp/graph.svg", imageAlt: "Dijkstra shortest-path diagram: the route from 1 through 3, 2, and 4 to 5 costs 8", stack: ["C++", "Python"], repo: competitiveRepo, live: "",
  evidence: "835 verified C++ implementations", evidenceLabel: "96 CSES · 114 Codeforces · 625 AtCoder",
  note: "Illustrative algorithm examples. Repository snapshot: October 11, 2026.",
  overview: "I maintain a C++ algorithm reference collection spanning 835 implementations from CSES, Codeforces, and AtCoder. Each entry connects the original problem to an implementation, explanation, time and space complexity, and local verification. The repository also includes reusable data structures, stress tests, boundary regressions, semantic checkers, and a learning roadmap for students preparing for competitions, coursework, and technical interviews.",
  features: [
    { title: "Prepare with a purpose", text: "Practice problems across graph algorithms, dynamic programming, greedy methods, strings, and number theory, organized so students can work on the topics they need." },
    { title: "Learn the reasoning", text: "The notes explain why an approach works, what it costs, and where it can go wrong, helping students recognize the same idea in a new problem." },
    { title: "Run it. Test it. Build on it.", text: "Every reference implementation compiles independently. Students can run tests, explore edge cases, and study reusable data structures as they develop their own implementations." },
  ],
  stages: [
    { title: "Try the problem", text: "Follow the link to the original problem, study the constraints, and attempt your own approach." },
    { title: "Study the reasoning", text: "Compare your approach with the explanation, including the key idea, complexity, and common mistakes." },
    { title: "Explore the C++", text: "Compile the solution, trace a small example, and connect the algorithm to the code." },
    { title: "Make the idea your own", text: "Add an edge case, try another implementation, and apply the technique to a new problem." },
  ],
  resources: [
    { label: "Browse all 835 implementations", href: competitiveRepo, kind: "source" },
    { label: "Problem & complexity index", href: `${competitiveSource}/docs/problems.md`, kind: "index" },
    { label: "Recorded verification", href: `${competitiveSource}/docs/verification.md`, kind: "evidence" },
    { label: "Reusable algorithm library", href: `${competitiveRepo}/tree/${competitiveCommit}/include/cp`, kind: "library" },
    { label: "Learning roadmap", href: `${competitiveSource}/docs/roadmap.md`, kind: "notes" },
    { label: "GitHub Actions runs", href: `${competitiveRepo}/actions/workflows/verify.yml`, kind: "CI" },
  ],
};
