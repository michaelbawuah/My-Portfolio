# 🚀 Sylvester Kpei's Portfolio

An interactive 3D developer portfolio featuring a fully interactive keyboard where each keycap reveals a different skill. Built with Next.js 16, TypeScript, and Spline 3D graphics.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kpeis695/personal-website)

## ✨ Features

- **Interactive 3D Keyboard** — Custom Spline keyboard where each keycap represents a skill, revealing titles and descriptions on hover/press
- **Smooth Animations** — GSAP + Motion library powered scroll, hover, and reveal animations
- **Space Theme** — Floating particles on a dark canvas for a cosmic vibe
- **Light & Dark Mode** — Full theme support
- **Responsive** — Works across all screen sizes
- **Contact Form** — Email delivery via Resend
- **Resume Page** — Google Drive hosted resume with preview

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS, Shadcn UI, Aceternity UI |
| **Animation** | GSAP, Motion |
| **3D** | Spline Runtime |
| **Email** | Resend |
| **Misc** | Lenis (smooth scroll), Zod, next-themes |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/kpeis695/personal-website.git
    cd personal-website
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Copy `.env.example` to `.env.local` and fill in the values:

    ```bash
    cp .env.example .env.local
    ```

    | Variable | Required | Description |
    |---|---|---|
    | `RESEND_API_KEY` | Yes | API key from [Resend](https://resend.com) for the contact form |
    | `NEXT_PUBLIC_WS_URL` | No | WebSocket server URL for realtime features (cursors, chat, presence) |
    | `UMAMI_DOMAIN` | No | Umami analytics script URL |
    | `UMAMI_SITE_ID` | No | Umami website ID |

4. **Run the development server:**

    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) and see the magic ✨

---

## 🎨 Customization

All personal info is centralized in [`src/data/config.ts`](src/data/config.ts):

```ts
const config = {
  title: "Your Name | Your Title",
  description: {
    long: "Your long description for SEO...",
    short: "Your short description...",
  },
  keywords: ["your", "keywords"],
  author: "Your Name",
  email: "you@example.com",
  site: "https://yoursite.com",

  // GitHub stars button in the header
  githubUsername: "your-github-username",
  githubRepo: "your-repo-name",

  social: {
    twitter: "https://x.com/you",
    linkedin: "https://linkedin.com/in/you",
    instagram: "https://instagram.com/you",
    facebook: "https://facebook.com/you",
    github: "https://github.com/you",
  },
};
```

Other files to customize:

| File | What to change |
|---|---|
| `src/data/projects.tsx` | Your projects, screenshots, descriptions, and tech stacks |
| `src/data/constants.ts` | Skills list (name, description, icon) and work experience |
| `public/assets/` | Your images, OG image, and project screenshots |

---

## ⌨️ Updating the 3D Keyboard Skills

The 3D keyboard keycaps are baked into a Spline file. To update the skills:

1. **Import** the `public/assets/skills-keyboard.spline` file into [Spline](https://spline.design/)
2. **Unhide** the keycap objects you want to edit
3. **Update** the logo images on each keycap to your new skill icons
4. **Rename** each keycap object to match the skill's `name` field in `src/data/constants.ts`
5. **Hide** all keycap objects again
6. **Export** the scene and overwrite `public/assets/skills-keyboard.spline`

---

## 🚀 Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kpeis695/personal-website)

This site is deployed on **Vercel**:

1. Push your code to GitHub
2. Connect the repository to [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Vercel handles the rest — automatic deployments on every push

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
