import {ContactComposer} from "@/components/contact-composer";
import {person} from "@/lib/portfolio";

export function LetsWorkTogether(){
 return <section className="work-together" id="lets-work-together" data-keyboard-scene="contact" aria-labelledby="work-together-heading">
  <div className="work-together-heading"><span className="mono">HAVE SOMETHING IN MIND?</span><h2 id="work-together-heading">LET’S WORK<br/><em>TOGETHER.</em></h2></div>
  <div className="work-together-grid">
   <div className="work-together-panel"><ContactComposer heading="Contact form"/><div className="work-together-email"><span>Prefer a direct conversation?</span><a href={`mailto:${person.email}`}>{person.email}</a></div></div>
   <div className="work-together-scene" data-keyboard-window aria-hidden="true"></div>
  </div>
 </section>;
}
