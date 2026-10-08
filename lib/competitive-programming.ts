export const competitiveRepo = "https://github.com/michaelbawuah/Pro-Competitive-Programming";
export const competitiveCommit = "4682ac47891f0146e977fec3de752ac38f583110";
export const competitiveSource = `${competitiveRepo}/blob/${competitiveCommit}`;
export const competitiveProject = {
  slug: "pro-competitive-programming", name: "Pro Competitive Programming", type: "C++ algorithms & problem solving", category: "Algorithms", accent: "blue", number: "07",
  summary: "My solutions to 835 problems, shared to help other students learn.",
  description: "My C++ solutions to 835 problems from CSES, Codeforces, and AtCoder, with explanations, complexity analysis, and tests to help students prepare for competitions and technical interviews.",
  image: "/projects/pro-cp/graph.svg", imageAlt: "Dijkstra shortest-path diagram: the route from 1 through 3, 2, and 4 to 5 costs 8", stack: ["C++", "Python"], repo: competitiveRepo, live: "",
  evidence: "835 C++ solutions", evidenceLabel: "96 CSES · 114 Codeforces · 625 AtCoder",
  note: "Illustrative algorithm examples. Repository snapshot: October 8, 2026.",
  overview: "I worked through 835 problems from CSES, Codeforces, and AtCoder to sharpen my C++ and algorithmic problem-solving skills. I published my solutions on GitHub with the reasoning behind each approach, time and space complexity, and tests for the edge cases. What began as my own practice is now an open resource for students preparing for competitions and technical interviews, strengthening their algorithms coursework, or becoming more confident C++ programmers.",
  features: [
    { title: "Prepare with a purpose", text: "Practice problems across graph algorithms, dynamic programming, greedy methods, strings, and number theory, organized so students can work on the topics they need." },
    { title: "Learn the reasoning", text: "My notes explain why an approach works, what it costs, and where it can go wrong, helping students recognize the same idea in a new problem." },
    { title: "Run it. Test it. Build on it.", text: "Every solution compiles on its own. Students can run the tests, explore edge cases, and study reusable data structures as they develop their own implementations." },
  ],
  stages: [
    { title: "Try the problem", text: "Follow the link to the original problem, study the constraints, and attempt your own approach." },
    { title: "Study my reasoning", text: "Compare your approach with my explanation, including the key idea, complexity, and common mistakes." },
    { title: "Explore the C++", text: "Compile the solution, trace a small example, and connect the algorithm to the code." },
    { title: "Make the idea your own", text: "Add an edge case, try another implementation, and apply the technique to a new problem." },
  ],
  resources: [
    { label: "Browse all 835 solutions", href: competitiveRepo, kind: "source" },
    { label: "Problem & complexity index", href: `${competitiveSource}/docs/problems.md`, kind: "index" },
    { label: "Recorded verification", href: `${competitiveSource}/docs/verification.md`, kind: "evidence" },
    { label: "Reusable algorithm library", href: `${competitiveRepo}/tree/${competitiveCommit}/include/cp`, kind: "library" },
    { label: "Learning roadmap", href: `${competitiveSource}/docs/roadmap.md`, kind: "notes" },
    { label: "GitHub Actions runs", href: `${competitiveRepo}/actions/workflows/verify.yml`, kind: "CI" },
  ],
};
