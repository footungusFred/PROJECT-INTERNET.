"use client";

import { ArrowDownRight, ArrowLeft, ArrowRight, Compass, Globe2, RotateCw, Search } from "lucide-react";
import { useEffect, useState } from "react";

type Health = "checking" | "connected" | "unavailable";\ntype ResolvedPage = { address: { hostname: string; path: string }; site: { title: string; description: string }; page: { title: string; description: string; content: unknown } };

const sites = [
  { name: "fieldnotes.net", label: "A small collection of observations", x: "7%", y: "17%" },
  { name: "catplanet.web", label: "A place for curious creatures", x: "53%", y: "5%" },
  { name: "toaster.net", label: "Personal projects & experiments", x: "66%", y: "56%" },
  { name: "softsignal.world", label: "Notes from the other side", x: "18%", y: "66%" },
];

export default function Home() {
  const [health, setHealth] = useState<Health>("checking");
  const [address, setAddress] = useState("");
  const [notice, setNotice] = useState("");\n  const [resolved, setResolved] = useState<ResolvedPage | null>(null);\n  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    fetch("/api/v1/health", { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("API unavailable"); return response.json(); })
      .then((data: { status?: string }) => setHealth(data.status === "ok" ? "connected" : "unavailable"))
      .catch(() => setHealth("unavailable"))
      .finally(() => window.clearTimeout(timeout));
    return () => { controller.abort(); window.clearTimeout(timeout); };
  }, []);

  function openAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!address.trim()) return;
    setNotice(`Internal address resolution is coming in a later milestone. “${address.trim()}” has not been opened.`);
  }

  return (
    <main>
      <header className="topbar">
        <a className="wordmark" href="/" aria-label="Project Internet home"><span className="mark"><Globe2 size={17} strokeWidth={1.7} /></span> PROJECT INTERNET</a>
        <nav aria-label="Main navigation"><a href="#how">The idea</a><a href="#browser">Explore</a><a className="nav-cta" href="#browser">Enter the internet <ArrowDownRight size={15} /></a></nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> AN INTERNET MADE BY ITS USERS</p>
          <h1>A little internet.<br /><em>Infinite</em> corners.</h1>
          <p className="intro">A place to make a website, give it an address, and find your way into the strange and wonderful things other people make.</p>
          <a className="text-link" href="#browser">Take a look around <ArrowDownRight size={17} /></a>
        </div>
        <div className="network" aria-label="Illustration of fictional websites connected together">
          <div className="network-top"><span>AN OPEN, GROWING WEB</span><span>FIG. 001</span></div>
          <svg className="connections" viewBox="0 0 600 420" role="img" aria-label="Lines connecting example website addresses">
            <path d="M95 108 C180 90 210 170 300 150 S440 70 510 105" />
            <path d="M95 108 C120 210 185 280 235 330 S390 270 430 250" />
            <path d="M300 150 C330 210 370 225 430 250" />
            <path d="M510 105 C520 170 470 210 430 250" />
            <path d="M235 330 C320 365 400 340 430 250" />
            <circle cx="95" cy="108" r="4"/><circle cx="300" cy="150" r="4"/><circle cx="510" cy="105" r="4"/><circle cx="235" cy="330" r="4"/><circle cx="430" cy="250" r="4"/>
          </svg>
          {sites.map((site, index) => <div className={`site site-${index + 1}`} key={site.name} style={{ left: site.x, top: site.y }}><span className="site-name">{site.name}</span><span className="site-label">{site.label}</span></div>)}
          <div className="network-foot"><span>Every address leads somewhere.</span><span>↗</span></div>
        </div>
        <div className="hero-index"><span>01 / THE SIMULATED WEB</span><span>SCROLL TO EXPLORE</span></div>
      </section>

      <section className="intro-band" id="how">
        <p className="eyebrow">NOT ANOTHER FEED</p>
        <div><h2>The web is more interesting<br />when <em>everyone</em> can make it.</h2><p>PROJECT INTERNET is a small, self-contained web. Its addresses are fictional, its sites are made by people, and the connections between them are real.</p></div>
      </section>

      <section className="browser-section" id="browser">
        <div className="section-heading"><div><p className="eyebrow">THE ENTRY POINT</p><h2>Go somewhere.</h2></div><span className="section-note">A browser for a web<br />that’s still being made.</span></div>
        <div className="browser">
          <div className="browser-toolbar">
            <div className="browser-controls"><button aria-label="Back" disabled><ArrowLeft size={16}/></button><button aria-label="Forward" disabled><ArrowRight size={16}/></button><button aria-label="Reload" onClick={() => setNotice("This preview has no page to reload yet.")}><RotateCw size={15}/></button></div>
            <form className="address-form" onSubmit={openAddress}><Search size={15}/><input aria-label="Internal address" placeholder="Enter a fictional address, e.g. toaster.net" value={address} onChange={(event) => setAddress(event.target.value)} /><button type="submit" disabled={busy}>{busy ? "Opening…" : "Go"} <ArrowDownRight size={14}/></button></form>
            <span className="browser-status"><i className={health === "connected" ? "status-dot live" : "status-dot"} />{health === "checking" ? "CONNECTING" : health === "connected" ? "API CONNECTED" : "API OFFLINE"}</span>
          </div>
          <div className="browser-empty">
            <div className="empty-index">INTERNET / 000</div>
            <div className="empty-main"><div className="empty-symbol"><Globe2 size={28} strokeWidth={1.2}/></div><p className="eyebrow">NOTHING HERE. YET.</p><h3>This part of the<br/><em>internet is unwritten.</em></h3><p className="empty-description">The browser is ready. The websites come next.</p></div>
            <div className="empty-bottom"><span>INTERNAL WEB PREVIEW</span><span>DOMAIN RESOLUTION — NOT YET AVAILABLE</span></div>
          </div>
          {notice && <p className="browser-notice" role="status">{notice}</p>}
        </div>
      </section>

      <footer><a className="wordmark" href="/"><span className="mark"><Globe2 size={16}/></span> PROJECT INTERNET</a><span>A small web, made together.</span><a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>BACK TO TOP ↑</a></footer>
    </main>
  );
}
