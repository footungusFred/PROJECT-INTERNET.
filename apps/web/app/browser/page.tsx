"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Globe2, RotateCw, Search } from "lucide-react";

type PageResult = { address: { hostname: string; path: string }; site: { title: string; description: string }; page: { title: string; description: string; content: unknown } };
type Entry = { address: string; kind: "internal" | "external"; url: string; data?: PageResult; error?: string };

function normalize(input: string): Entry {
  const value = input.trim();
  if (!value) throw new Error("Enter an address first.");
  const bare = value.replace(/^https?:\/\//i, "").split(/[/?#]/)[0].toLowerCase();
  if (/^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?\.(net|web|world)$/.test(bare)) {
    const url = new URL(value.startsWith("/") ? value : "https://" + value);
    return { address: value, kind: "internal", url: url.pathname + url.search };
  }
  const url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : "https://" + value);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only web addresses (http/https) are supported.");
  return { address: url.hostname + url.pathname, kind: "external", url: url.toString() };
}

export default function BrowserPage() {
  const [address, setAddress] = useState("");
  const [entry, setEntry] = useState<Entry | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Entry[]>([]);
  const [index, setIndex] = useState(-1);

  async function visit(raw: string, addHistory = true) {
    setBusy(true); setMessage("");
    try {
      const next = normalize(raw);
      if (next.kind === "internal") {
        const parsed = new URL(next.url, window.location.origin);
        const host = raw.trim().replace(/^https?:\/\//i, "").split(/[/?#]/)[0].toLowerCase();
        const response = await fetch(`/api/v1/browser/resolve?hostname=${encodeURIComponent(host)}&path=${encodeURIComponent(parsed.pathname)}`);
        const body = await response.json();
        if (!response.ok) throw new Error(body?.error?.message || "That internal page could not be found.");
        next.data = body as PageResult;
      }
      setEntry(next); setAddress(next.address);
      if (addHistory) { const items = history.slice(0, index + 1); items.push(next); setHistory(items); setIndex(items.length - 1); }
    } catch (error) { setEntry(null); setMessage(error instanceof Error ? error.message : "Could not open that address."); }
    finally { setBusy(false); }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get("address");
    if (initial) void visit(initial);
  }, []);

  function submit(event: FormEvent) { event.preventDefault(); void visit(address); }
  function move(delta: number) { const next = index + delta; if (next < 0 || next >= history.length) return; setIndex(next); const item = history[next]; setEntry(item); setAddress(item.address); setMessage(""); }

  return <main className="standalone-browser">
    <header className="browser-appbar"><a href="/" className="browser-brand"><span className="mark"><Globe2 size={17}/></span> PROJECT INTERNET <span className="browser-label">BROWSER</span></a><span className="browser-appbar-note">A window into the little web</span></header>
    <section className="browser-window">
      <div className="browser-toolbar">
        <div className="browser-controls">
          <button aria-label="Back" disabled={index <= 0} onClick={() => move(-1)}><ArrowLeft size={16}/></button>
          <button aria-label="Forward" disabled={index >= history.length - 1} onClick={() => move(1)}><ArrowRight size={16}/></button>
          <button aria-label="Reload" disabled={!entry || busy} onClick={() => entry && void visit(entry.address, false)}><RotateCw size={15}/></button>
        </div>
        <form className="address-form" onSubmit={submit}><Search size={15}/><input aria-label="Address" placeholder="Try toaster.net or wikipedia.org" value={address} onChange={e => setAddress(e.target.value)}/><button type="submit" disabled={busy}>{busy ? "Opening…" : "Go"} <ArrowRight size={14}/></button></form>
      </div>
      <div className="browser-content">
        {!entry && !message && <div className="browser-welcome"><div className="empty-symbol"><Globe2 size={29}/></div><p className="eyebrow">YOUR WINDOW TO THE WEB</p><h1>Where to<br/><em>next?</em></h1><p>Visit a PROJECT INTERNET address, or enter a regular website address.</p><div className="browser-examples"><button onClick={() => {setAddress("wikipedia.org");void visit("wikipedia.org")}}>wikipedia.org ↗</button><button onClick={() => {setAddress("example.com");void visit("example.com")}}>example.com ↗</button><button onClick={() => {setAddress("toaster.net");void visit("toaster.net")}}>toaster.net ↗</button></div></div>}
        {message && <div className="browser-message"><p className="eyebrow">COULD NOT OPEN ADDRESS</p><h2>That place didn’t load.</h2><p>{message}</p><button onClick={() => void visit(address)}>Try again</button></div>}
        {entry?.kind === "external" && <div className="external-view"><div className="external-warning"><span>PUBLIC WEB</span><a href={entry.url} target="_blank" rel="noreferrer">Open in your regular browser <ExternalLink size={13}/></a></div><iframe key={entry.url} title={entry.address} src={entry.url} referrerPolicy="no-referrer" sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" onError={() => setMessage("This website does not allow itself to be displayed inside another page. Use the external link above to open it directly.")}/><p className="frame-note">Some public websites block embedded viewing. If the page stays blank, use “Open in your regular browser”.</p></div>}
        {entry?.kind === "internal" && entry.data && <article className="internal-view"><p className="eyebrow">PROJECT INTERNET / INTERNAL SITE</p><span className="internal-host">{entry.data.address.hostname}{entry.data.address.path}</span><h1>{entry.data.page.title || entry.data.site.title}</h1><p className="internal-description">{entry.data.page.description || entry.data.site.description}</p><div className="internal-rule"/><h2>{entry.data.site.title}</h2><p>{entry.data.site.description}</p><pre>{typeof entry.data.page.content === "string" ? entry.data.page.content : JSON.stringify(entry.data.page.content, null, 2)}</pre></article>}
      </div>
      <footer className="browser-footer"><span><i className={entry ? "status-dot live" : "status-dot"}/>{entry ? (entry.kind === "internal" ? "INTERNAL WEB" : "PUBLIC WEB") : "READY"}</span><span>PROJECT INTERNET · BROWSER PREVIEW</span></footer>
    </section>
    <style jsx>{`
      .standalone-browser{min-height:100vh;background:#f1f2ee;padding:0 5.5% 5%;color:#171917}
      .browser-appbar{height:72px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #dfe3dc}
      .browser-brand{display:flex;align-items:center;gap:10px;font-size:11px;font-weight:700;letter-spacing:.12em}
      .browser-label{font-size:8px;font-weight:500;color:#718071;border-left:1px solid #cbd1c8;padding-left:10px}
      .browser-appbar-note{font-size:11px;color:#7a8179}
      .browser-window{max-width:1200px;margin:34px auto 0;border:1px solid #d9ded6;background:#fbfbf9;min-height:calc(100vh - 140px);display:flex;flex-direction:column}
      .browser-toolbar{display:flex;gap:16px;align-items:center;padding:12px 16px;border-bottom:1px solid #e4e6e1}
      .browser-controls{display:flex;gap:3px}.browser-controls button{width:30px;height:30px;border:0;background:transparent;color:#586158;display:grid;place-items:center}.browser-controls button:disabled{opacity:.25}
      .address-form{height:38px;border:1px solid #dfe3dc;background:#f4f5f1;display:flex;align-items:center;gap:9px;padding:0 10px;flex:1;color:#778077}
      .address-form input{border:0;outline:0;background:transparent;min-width:0;flex:1;font-size:12px;color:#202620}
      .address-form button{height:28px;border:0;background:#526b58;color:white;padding:0 12px;display:flex;align-items:center;gap:8px;font-size:11px}
      .browser-content{position:relative;flex:1;min-height:570px;display:grid;place-items:center}
      .browser-welcome{text-align:center;padding:60px 20px}.empty-symbol{width:56px;height:56px;border:1px solid #d8ded5;border-radius:50%;display:grid;place-items:center;margin:0 auto 25px;color:#607b64}
      .eyebrow{font-size:9px;letter-spacing:.16em;font-weight:700;color:#697269;margin:0 0 17px}
      .browser-welcome h1{font-size:clamp(56px,8vw,88px);line-height:.92;letter-spacing:-.075em;font-weight:500;margin:0 0 20px}.browser-welcome h1 em{font-family:Georgia,serif;font-weight:400}
      .browser-welcome>p:not(.eyebrow){font-size:13px;color:#70786f;line-height:1.7}
      .browser-examples{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:25px}.browser-examples button,.browser-message button{border:1px solid #dce1d9;background:#f5f6f2;padding:10px 13px;font-size:11px;color:#485649}
      .browser-message{text-align:center;padding:40px}.browser-message h2{font-size:32px;letter-spacing:-.05em;font-weight:500;margin:0 0 10px}.browser-message p:not(.eyebrow){font-size:13px;color:#717970}
      .external-view{position:absolute;inset:0;display:flex;flex-direction:column}.external-warning{height:39px;border-bottom:1px solid #e5e7e2;display:flex;align-items:center;justify-content:space-between;padding:0 15px;font-size:8px;letter-spacing:.12em;color:#758074}.external-warning a{display:flex;align-items:center;gap:6px;font-size:10px;letter-spacing:0;color:#506b56}
      .external-view iframe{border:0;width:100%;flex:1;min-height:480px;background:white}.frame-note{margin:0;padding:9px 14px;border-top:1px solid #e5e7e2;font-size:10px;color:#858c83}
      .internal-view{width:min(760px,86%);padding:60px 0;align-self:start}.internal-host{font:11px ui-monospace,monospace;color:#687368}.internal-view h1{font-size:clamp(40px,6vw,70px);line-height:1;letter-spacing:-.07em;font-weight:500;margin:20px 0}.internal-description,.internal-view>p{font-size:13px;line-height:1.8;color:#6b746b}.internal-rule{border-top:1px solid #e2e6df;margin:35px 0}.internal-view h2{font:26px Georgia,serif}.internal-view pre{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.8 ui-monospace,monospace;background:#f3f4f0;padding:20px;margin-top:28px}
      .browser-footer{border-top:1px solid #e4e6e1;padding:12px 16px;display:flex;justify-content:space-between;color:#899087;font-size:8px;letter-spacing:.12em}.browser-footer span:first-child{display:flex;align-items:center;gap:7px}.status-dot{width:6px;height:6px;border-radius:50%;background:#b38c5e}.status-dot.live{background:#648568}
      @media(max-width:650px){.standalone-browser{padding:0 3% 3%}.browser-appbar-note{display:none}.browser-window{margin-top:18px;min-height:calc(100vh - 105px)}.browser-toolbar{flex-wrap:wrap}.browser-controls{order:0}.address-form{order:1;flex-basis:100%}.browser-content{min-height:480px}.browser-footer{font-size:7px}.internal-view{width:88%}}
    `}</style>
  </main>;
}
