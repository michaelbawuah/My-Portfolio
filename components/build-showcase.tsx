"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Code2, Play, RotateCcw, Sparkles } from "lucide-react";
import { exampleValues, linearExample, prefixTrace } from "@/lib/build-examples";

const builds = [
  { slug: 'navox', name: 'NavoX', category: 'PERSONAL AI ASSISTANT', title: 'Your day has context.\nYour assistant should, too.', description: 'I’m building an assistant that connects the scattered parts of a day: email, calendar, coursework, and the actions that need a second look.', detail: 'Conversation → context → your approval.', stack: ['TypeScript', 'Python', 'Temporal'], image: '/projects/navox.jpg', imageAlt: 'NavoX sample workspace from the recorded project walkthrough', repo: 'https://github.com/michaelbawuah/NavoX', accent: 'blue' },
  { slug: 'fluxion', name: 'Fluxion', category: 'DEEP LEARNING FROM FIRST PRINCIPLES', title: 'I wanted to understand\nwhat happens underneath.', description: 'So I started with tensors and gradients, then built toward attention and a Transformer. Fluxion is where I take the abstractions apart and make them work myself.', detail: 'Tensors → autograd → neural networks.', stack: ['Python', 'NumPy', 'C++'], image: '/projects/fluxion-autograd.png', imageAlt: 'Fluxion automatic differentiation computation graph', repo: 'https://github.com/michaelbawuah/Fluxion', accent: 'violet' },
  { slug: 'pro-competitive-programming', name: 'Pro Competitive Programming', category: 'C++ / ALGORITHMS / PROBLEM SOLVING', title: 'The solution matters.\nSo does the reasoning.', description: '835 problems from CSES, Codeforces, and AtCoder. My C++ solutions, explanations, and tests are on GitHub for students who want to work through the ideas behind them.', detail: 'Try it. Trace it. Understand why it works.', stack: ['C++', 'CSES', 'Codeforces', 'AtCoder'], image: '/projects/pro-cp/fenwick.svg', imageAlt: 'A Fenwick tree prefix sum broken into smaller ranges', repo: 'https://github.com/michaelbawuah/Pro-Competitive-Programming', accent: 'mint' },
] as const;

function NavoXPreview() {
  const [run, setRun] = useState(0);
  return <div className="navox-preview">
    <div className="preview-app-bar"><span><img src="/logos/navox.png" alt="" width={26} height={26}/>NavoX</span><span className="preview-sample-label">ILLUSTRATIVE PREVIEW</span></div>
    <div className="navox-conversation" key={run}>
      <div className="navox-prompt demo-sequence">Help me plan my afternoon.</div>
      <div className="navox-response demo-sequence"><Sparkles size={19}/><p>Let’s give the important things some room.</p></div>
      <div className="navox-plan demo-sequence"><span className="preview-status-dot"/><div><strong>Design review</strong><span>Start with the meeting on your calendar.</span></div><span className="navox-source">Calendar</span></div>
      <div className="navox-plan demo-sequence"><span className="preview-status-dot violet"/><div><strong>Project feedback</strong><span>Leave time for the email waiting on you.</span></div><span className="navox-source">Email</span></div>
      <div className="navox-approval demo-sequence"><Check size={18}/><span>You review the next step before anything is sent.</span></div>
    </div>
    <div className="preview-app-footer"><button type="button" onClick={() => setRun(value => value + 1)}><RotateCcw size={15}/>Replay preview</button><a href="/projects/navox-walkthrough.mp4" target="_blank" rel="noopener noreferrer"><Play size={14}/>Recorded walkthrough</a></div>
  </div>;
}

function FluxionPreview() {
  const [backward, setBackward] = useState(false);
  const [x, setX] = useState(2);
  const result = linearExample(x, 3, 1);
  return <div className={`fluxion-preview ${backward ? 'is-backward' : ''}`}>
    <div className="preview-app-bar"><span><img src="/logos/fluxion.png" alt="" width={26} height={26}/>Fluxion</span><span className="preview-sample-label">AUTOGRAD EXAMPLE</span></div>
    <div className="tensor-expression"><code>y = x * w + b</code><span>{backward ? 'Follow the gradient back.' : 'Follow the values forward.'}</span></div>
    <svg className="gradient-graph" viewBox="0 0 520 250" role="img" aria-label={`For x ${x}, weight 3 and bias 1, y is ${result.output}. The gradients are ${result.dx} with respect to x, ${result.dw} with respect to weight, and ${result.db} with respect to bias.`}>
      <g className="gradient-traces" fill="none"><path pathLength="1" d="M115 60H155Q170 60 170 80V115H204M115 190H155Q170 190 170 175V135H204M264 125H332M362 65V95M392 125H435"/></g>
      <g className="gradient-node"><rect x="20" y="33" width="95" height="54" rx="12"/><rect x="20" y="163" width="95" height="54" rx="12"/><rect x="320" y="11" width="84" height="54" rx="12"/><circle cx="234" cy="125" r="30"/><circle cx="362" cy="125" r="30"/><rect className="gradient-output" x="435" y="97" width="75" height="56" rx="12"/></g>
      <g className="gradient-label"><text x="67" y="65">x = {x}</text><text x="67" y="195">w = 3</text><text x="362" y="43">b = 1</text><text x="234" y="132">×</text><text x="362" y="132">+</text><text x="472" y="132">{result.output}</text></g>
      <g className="gradient-derivatives" aria-hidden="true"><text x="67" y="112">∂y/∂x = {result.dx}</text><text x="67" y="243">∂y/∂w = {result.dw}</text><text x="362" y="184">∂y/∂b = 1</text></g>
    </svg>
    <div className="gradient-mobile-graph" role="img" aria-label={`y equals ${x} times 3 plus 1, which is ${result.output}. Gradients: x ${result.dx}, weight ${result.dw}, bias 1.`}>
      <div className="mobile-gradient-inputs"><span><small>INPUT</small>x = {x}<em>{backward ? `gradient ${result.dx}` : 'tensor'}</em></span><span><small>WEIGHT</small>w = 3<em>{backward ? `gradient ${result.dw}` : 'tensor'}</em></span><span><small>BIAS</small>b = 1<em>{backward ? 'gradient 1' : 'tensor'}</em></span></div>
      <div className="mobile-gradient-connector" aria-hidden="true"><ArrowDown size={22}/></div>
      <div className="mobile-gradient-result"><code>{x} × 3 + 1</code><ArrowRight size={19}/><strong>{result.output}</strong></div>
    </div>
    <div className="gradient-console" aria-live="polite"><span>{backward ? 'BACKWARD PASS' : 'FORWARD PASS'}</span><code>{backward ? `x.grad = ${result.dx}  ·  w.grad = ${result.dw}  ·  b.grad = 1` : `Tensor(${x}) × Tensor(3) + Tensor(1) → ${result.output}`}</code></div>
    <div className="preview-app-footer"><button type="button" onClick={() => setBackward(value => !value)}><Play size={14}/>{backward ? 'Show forward pass' : 'Run backward pass'}</button><button type="button" onClick={() => setX(value => value === 2 ? 4 : 2)}>Try x = {x === 2 ? 4 : 2}<ArrowRight size={14}/></button></div>
  </div>;
}

function AlgorithmPreview() {
  const [count, setCount] = useState(7);
  const [step, setStep] = useState(0);
  const { steps, total } = prefixTrace(exampleValues, count);
  const visited = steps.slice(0, step);
  const partial = visited.reduce((sum, item) => sum + item.value, 0);
  const complete = step === steps.length;
  return <div className="algorithm-preview">
    <div className="preview-app-bar"><span><Code2 size={22}/>Prefix sums</span><span className="preview-sample-label">TRY A FENWICK TREE</span></div>
    <div className="algorithm-intro"><strong>Small jumps. One sum.</strong><p>Choose where the prefix ends, then trace the query.</p></div>
    <div className="prefix-array" role="group" aria-label="Choose the prefix length">{exampleValues.map((value, index) => <button type="button" key={index} className={visited.some(item => index + 1 >= item.start && index + 1 <= item.index) ? 'is-visited' : ''} aria-label={`Sum the first ${index + 1} values`} aria-pressed={count === index + 1} onClick={() => {setCount(index + 1); setStep(0);}}><small>{index + 1}</small><strong>{value}</strong></button>)}</div>
    <div className="prefix-route" aria-label="Fenwick query path">{steps.map((item, index) => <span className={index < step ? 'is-visited' : ''} key={item.index}><strong>{item.index}</strong><small>+{item.value}</small><ArrowRight size={16}/></span>)}<span className={complete ? 'is-visited' : ''}><strong>0</strong><small>done</small></span></div>
    <div className="algorithm-code"><code>sum += tree[i];<br/><span>i -= i &amp; -i;</span></code><div aria-live="polite"><small>{complete ? `PREFIX(${count})` : 'RUNNING SUM'}</small><strong>{partial}<span>{complete ? <Check size={19}/> : ` / ${total}`}</span></strong></div></div>
    <div className="preview-app-footer"><button type="button" onClick={() => setStep(value => complete ? 0 : value + 1)}>{complete ? <RotateCcw size={15}/> : <Play size={14}/>} {complete ? 'Start again' : 'Trace next jump'}</button><span>{complete ? 'The highlighted ranges cover the prefix.' : 'Each jump clears the lowest set bit.'}</span></div>
  </div>;
}

export function BuildShowcase({ variant = 'home' }: { variant?: 'home' | 'work' }) {
  const [active, setActive] = useState(0);
  const [images, setImages] = useState<Record<string, boolean>>({});
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const compact = variant === 'home';

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let disposed = false;
    let revert = () => {};
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-in-view');
    }), { threshold: 0.2 });
    element.querySelectorAll('.build-chapter:not([hidden]) .build-visual').forEach(visual => observer.observe(visual));
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      revert = () => media.revert();
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const context = gsap.context(() => {
          element.querySelectorAll<HTMLElement>('.build-chapter:not([hidden])').forEach(chapter => {
            const visual = chapter.querySelector('.build-visual');
            gsap.fromTo(visual, { rotateY: -7, rotateX: 5, scale: 0.91, y: 44 }, {
              rotateY: 0, rotateX: 0, scale: 1, y: 0, ease: 'none',
              scrollTrigger: { trigger: chapter.querySelector('.build-art'), start: 'top 95%', end: 'top 38%', scrub: 0.6 },
            });
            const enter = gsap.fromTo(chapter.querySelectorAll('[data-build-reveal]'), { y: 35, opacity: 0.2 }, {
              y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: 'power3.out', paused: true, immediateRender: false, clearProps: 'opacity,transform',
            });
            ScrollTrigger.create({ trigger: chapter, start: 'top 87%', once: true, onEnter: () => { enter.play(); } });
          });
        }, element);
        return () => context.revert();
      });
      ScrollTrigger.refresh();
    }).catch(() => { revert(); });
    return () => { disposed = true; observer.disconnect(); revert(); };
  }, [active, compact]);

  function switchTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === 'ArrowRight' ? (index + 1) % builds.length : event.key === 'ArrowLeft' ? (index + builds.length - 1) % builds.length : event.key === 'Home' ? 0 : event.key === 'End' ? builds.length - 1 : null;
    if (next === null) return;
    event.preventDefault(); setActive(next); tabs.current[next]?.focus();
  }

  return <section ref={root} id={compact ? 'selected-builds' : 'featured-builds'} className={`build-showcase build-showcase-${variant}`} aria-labelledby={`${variant}-build-title`}>
    <header className="build-heading"><div><p className="eyebrow">OPEN THE HOOD</p><h2 id={`${variant}-build-title`}>A few things<br/><em>I’ve put myself into.</em></h2></div><p>Explore the idea.<br/>Try a little of what’s underneath.</p></header>
    {compact ? <div className="build-tabs" role="tablist" aria-label="Explore featured projects">{builds.map((build, index) => <button key={build.slug} ref={element => {tabs.current[index] = element;}} type="button" role="tab" id={`home-tab-${build.slug}`} aria-selected={active === index} aria-controls={`home-build-${build.slug}`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => switchTab(event, index)}>{index === 2 ? 'Competitive programming' : build.name}<ArrowUpRight size={16}/></button>)}</div> : <nav className="build-tabs" aria-label="Featured project chapters">{builds.map(build => <a key={build.slug} href={`#work-build-${build.slug}`}>{build.slug === 'pro-competitive-programming' ? 'Competitive programming' : build.name}<ArrowDown size={15}/></a>)}</nav>}
    <div className="build-chapters">{builds.map((build, index) => <article key={build.slug} id={`${variant}-build-${build.slug}`} role={compact ? 'tabpanel' : undefined} aria-labelledby={compact ? `home-tab-${build.slug}` : `${variant}-title-${build.slug}`} hidden={compact && active !== index} className={`build-chapter build-${build.accent}`}>
      <div className="build-copy"><p className="build-category" data-build-reveal>{build.category}</p><h3 id={`${variant}-title-${build.slug}`} data-build-reveal>{build.name}</h3><p className="build-statement" data-build-reveal>{build.title}</p><p className="build-description" data-build-reveal>{build.description}</p><p className="build-detail" data-build-reveal>{build.detail}</p><div className="build-stack" data-build-reveal>{build.stack.map(technology => <span key={technology}>{technology}</span>)}</div><div className="build-links" data-build-reveal><a href={`/projects/${build.slug}`} className="build-case-link">Inside the project <ArrowUpRight size={19}/></a><a href={build.repo} target="_blank" rel="noopener noreferrer" aria-label={`${build.name} source on GitHub`}><Code2 size={19}/>Source</a></div></div>
      <div className="build-art"><div className="build-visual"><div className="build-art-topline"><span>{images[build.slug] ? 'FROM THE PROJECT' : 'EXPLORE THE IDEA'}</span><span aria-hidden="true">✳</span></div>{images[build.slug] ? <a className="build-project-image" href={build.image} target="_blank" rel="noopener noreferrer"><img src={build.image} alt={build.imageAlt} width={1200} height={800}/><span>Open full-size image <ArrowUpRight size={15}/></span></a> : index === 0 ? <NavoXPreview/> : index === 1 ? <FluxionPreview/> : <AlgorithmPreview/>}<div className="build-art-caption"><p>{index === 0 ? 'Authored sample data. No account is connected.' : index === 1 ? 'A small, interactive explanation of automatic differentiation.' : 'A working prefix-sum example, with C++ logic.'}</p><button type="button" aria-pressed={!!images[build.slug]} onClick={() => setImages(value => ({...value, [build.slug]: !value[build.slug]}))}>{images[build.slug] ? 'Back to interaction' : 'View project image'}<ArrowUpRight size={14}/></button></div></div></div>
    </article>)}</div>
    {compact && <a href="/work" className="build-all-link">Explore all projects, systems &amp; research <ArrowUpRight size={22}/></a>}
  </section>;
}
