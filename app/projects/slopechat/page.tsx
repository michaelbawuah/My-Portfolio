import { MessageCircle, Users, Compass, Video, ShieldCheck, Heart } from "lucide-react";
import { PageFrame, TechStack } from "@/components/portfolio-layout";
import { CaseNotebook, PipelineExplorer } from "@/components/portfolio-interactions";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "SlopeChat — a project with a friend",
  "How Michael Baffour Awuah and a friend began SlopeChat: a student social video-chat app, with Michael contributing its UI/UX and frontend redesign.",
  "/projects/slopechat",
);

const benefits = [
  { icon: Users, title: "Find your people", text: "Starting university can mean rebuilding your social circle. SlopeChat offers another way to meet a fellow student, find a study buddy, or connect over a shared hobby while you are finding your place on campus." },
  { icon: Compass, title: "Meet beyond your routine", text: "Classes, clubs, and residence halls often shape who you meet. A conversation through SlopeChat can introduce you to someone outside those familiar groups." },
  { icon: MessageCircle, title: "Have a place to start", text: "A shared interest gives a first conversation something to build on. Music, hobbies, and everyday student life can turn an awkward introduction into a more natural exchange." },
  { icon: Heart, title: "Make room for connection", text: "The goal is a useful first hello: a new friendship, a shared interest, or simply a good conversation after a busy week. What happens next is up to the students." },
] as const;

const steps = [
  { title: "Verify your email", text: "Start with your university email and an email verification code. The current launch is for Cornell students, giving the community a clear starting point." },
  { title: "Pick your interests", text: "Choose from 16 interests across four groups, including making friends, study buddies, music, and gaming. Clear selection states show the interests you have chosen." },
  { title: "Get camera-ready", text: "Preview your camera and prepare your microphone before entering a conversation. Clear setup states help you understand what the app needs next." },
  { title: "Meet one-to-one", text: "Enter matching, then connect face-to-face with another student. The experience focuses on a conversation with a person, rather than another feed to scroll." },
] as const;

export default function SlopeChatPage() {
  const story = <>
    <div className="notebook-heading"><span className="mono">THE DAY WE DECIDED TO BUILD IT</span><h2>It started with the two of us.</h2></div>
    <div className="slopechat-origin"><p>One day, a friend and I sat down and decided to create SlopeChat. The idea was simple: university puts you around thousands of people, but meeting someone outside your usual circle still takes a first step. We wanted to make that step easier.</p><p>We chose to build around conversation. You verify your university email, choose your interests, and meet another student through a one-to-one video chat. The point is to create an opening for a real connection—something a profile or a crowded group chat does not always give you.</p><p>For me, the design had to feel approachable. A student should be able to arrive, understand the idea, and know what to do next. My contribution focused on that journey: the landing page, sign-in, interest selection, and the screens leading into a call.</p></div>
    <div className="section-heading slopechat-section-heading"><span className="mono">WHY IT MATTERS</span><h2>A smaller first step into campus life.</h2></div>
    <div className="slopechat-benefits">{benefits.map(({icon: Icon,title,text}) => <article key={title}><Icon size={25} aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>)}</div>
  </>;

  const app = <>
    <div className="notebook-heading"><span className="mono">THE STUDENT EXPERIENCE</span><h2>From an interest to a conversation.</h2><p>SlopeChat is a student social video-chat app. The current Cornell launch keeps the community focused while exploring a need students at many universities recognize: meeting people beyond the groups they already know.</p></div>
    <PipelineExplorer steps={steps} name="SlopeChat"/>
    <div className="slopechat-principles"><article><ShieldCheck size={25} aria-hidden="true"/><div><h3>A university community</h3><p>Email verification helps establish campus membership. It is a starting point for the community, rather than a guarantee about every person or conversation.</p></div></article><article><Video size={25} aria-hidden="true"/><div><h3>Conversation comes first</h3><p>Shared interests provide a starting point; a live video conversation lets students get to know each other in their own words.</p></div></article></div>
    <section className="built-with"><div className="section-heading"><span className="mono">THE PLATFORM</span><h2>The technology behind it.</h2></div><TechStack technologies={["TypeScript","React","Next.js","Supabase","WebRTC"]}/><p className="slopechat-tech-note">The app uses Next.js and React for the interface, Supabase for authentication and realtime coordination, and WebRTC for peer video. My work centered on the design and frontend experience.</p></section>
  </>;

  const contribution = <>
    <div className="notebook-heading"><span className="mono">MY PART IN THE PROJECT</span><h2>Building it together.</h2><p>I contributed the UI/UX and frontend redesign, working within the existing application and its authentication, matching, and video foundations.</p></div>
    <div className="slopechat-contributions"><article><span className="mono">FIRST IMPRESSION</span><h3>A welcoming landing page</h3><p>Integrated the supplied SlopeChat logo, red-and-white identity, and relatable video-call imagery into a clear introduction to the app.</p></article><article><span className="mono">THE JOURNEY</span><h3>One consistent experience</h3><p>Redesigned email sign-in, the interest picker, camera setup, matching, friends, and call screens so the experience feels connected from the first click.</p></article><article><span className="mono">THE DETAILS</span><h3>Responsive and considerate</h3><p>Refined mobile layouts, expanded the picker from eight ungrouped interests to 16 interests in four groups, added keyboard focus handling and reduced-motion support, and clarified sign-in errors.</p></article></div>
    <div className="slopechat-credit"><strong>Built through collaboration.</strong><p>SlopeChat is maintained by <a href="https://github.com/Beechamp2019" target="_blank" rel="noopener noreferrer">Beechamp2019</a>. My credited redesign contribution is included in the project’s main branch. The original authentication, matchmaking, and video systems are part of the existing platform.</p></div>
  </>;

  const visit = <>
    <div className="notebook-heading"><span className="mono">MEET BEYOND YOUR CIRCLE</span><h2>See the idea in action.</h2><p>Explore SlopeChat’s public landing page. The current student experience is for Cornell-verified accounts; the site explains who can join and when matching is available.</p></div>
    <div className="slopechat-visit"><img src="/logos/slopechat.png" width={1625} height={968} alt="SlopeChat — meet beyond your circle" loading="lazy"/><div><h3>A first hello can go a long way.</h3><p>A project we started together, built around a familiar part of university life: wanting to meet someone new.</p><a href="https://slopechat.com/" className="button-primary" target="_blank" rel="noopener noreferrer">Visit SlopeChat</a></div></div>
  </>;

  return <PageFrame className="slopechat-shell">
    <div className="case-breadcrumb"><a href="/work">All projects</a><span>/ SlopeChat</span><span className="mono">COLLABORATION</span></div>
    <section className="slopechat-hero"><div className="slopechat-hero-copy"><div className="slopechat-brandline"><img src="/logos/slopechat.png" width={1625} height={968} alt="SlopeChat logo" fetchPriority="high"/><span className="mono">BUILT WITH A FRIEND</span></div><h1>SlopeChat<span>.</span></h1><h2>A campus full of people.<br/>A conversation away.</h2><p>A student social app that helps people meet beyond their usual circle through shared interests and one-to-one video conversations.</p><div className="slopechat-tags"><span>UI/UX &amp; frontend developer</span><span>Student social video chat</span></div><a href="https://slopechat.com/" className="button-primary" target="_blank" rel="noopener noreferrer">Visit SlopeChat</a></div><figure className="slopechat-hero-visual"><div className="visual-toolbar"><span className="mono">SLOPECHAT / A FIRST HELLO</span><Video size={18} aria-hidden="true"/></div><img src="/projects/slopechat-video-call.webp" width={1400} height={788} alt="Illustrative photo of a woman waving during a video conversation, used on SlopeChat’s landing page" fetchPriority="high"/><figcaption>Illustrative photography from the app’s landing page. <a href="https://unsplash.com/photos/young-woman-waving-hello-while-video-chatting-on-laptop-qn7smNyVz64" target="_blank" rel="noopener noreferrer">Vitaly Gariev / Unsplash</a>.</figcaption></figure></section>
    <CaseNotebook labels={["Our story","The app","My contribution","Try it"]} overview={story} system={app} evidence={contribution} resources={visit}/>
    <nav className="case-next" aria-label="More projects"><a href="/work">Back to all projects</a><a href="/projects/navox">Explore NavoX</a></nav>
  </PageFrame>;
}
