import React, { useState, useRef, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// ── Icons (inline SVG for zero-dep) ────────────────────────────
const Icon = ({ d, size = 16, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d={d} />
  </svg>
);
const Icons = {
  logo:     "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  chat:     "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  search:   "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  notes:    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  plus:     "M12 5v14M5 12h14",
  send:     "M22 2L11 13 M22 2L15 22l-4-9-9-4 22-7z",
  settings: "M12 15A3 3 0 1 0 12 9a3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  chevrons: "M11 17l-5-5 5-5 M18 17l-5-5 5-5",
  chevronsR:"M7 17l5-5-5-5 M14 17l5-5-5-5",
  check:    "M20 6L9 17l-5-5",
  globe:    "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  save:     "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8",
  history:  "M12 8v4l3 3M3.05 11a9 9 0 1 1 .1 3",
  cpu:      "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
  zap:      "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  copy:     "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-4H8z M14 2v6h6",
  external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3",
};

// ── Simple markdown-ish renderer ───────────────────────────────
function renderContent(text) {
  if (!text) return null;
  const parts = [];
  const lines = text.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // Code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      parts.push(
        <pre key={i}>
          {lang && <span style={{ fontSize: 10, color: "var(--amber-500)", marginBottom: 6, display: "block" }}>{lang}</span>}
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
    } else if (line.startsWith("# ")) {
      parts.push(<h3 key={i} style={{ fontSize: 15, fontWeight: 700, color: "var(--amber-300)", marginBottom: 6, marginTop: 8 }}>{line.slice(2)}</h3>);
    } else if (line.startsWith("## ")) {
      parts.push(<h4 key={i} style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4, marginTop: 8 }}>{line.slice(3)}</h4>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      parts.push(
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 2 }}>
          <span style={{ color: "var(--amber-500)", flexShrink: 0 }}>▸</span>
          <span>{inlineFormat(line.slice(2))}</span>
        </div>
      );
    } else if (line.trim() === "") {
      parts.push(<div key={i} style={{ height: 6 }} />);
    } else {
      parts.push(<p key={i}>{inlineFormat(line)}</p>);
    }
    i++;
  }
  return parts;
}

function inlineFormat(text) {
  // bold **text**
  const parts = [];
  const re = /(\*\*(.+?)\*\*|`(.+?)`)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[0].startsWith("**")) parts.push(<strong key={m.index}>{m[2]}</strong>);
    else parts.push(<code key={m.index}>{m[3]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts;
}

// ── Data ───────────────────────────────────────────────────────
const PROVIDERS = [
  { id: "ollama", name: "Ollama", model: "llama3.1:8b", desc: "Local • GPU-accelerated", icon: "🦙" },
  { id: "llamacpp", name: "llama.cpp", model: "local-model", desc: "Local • GGUF runtime", icon: "⚡" },
];

const SUGGESTIONS = [
  "Summarize my local notes",
  "What can you help me with?",
  "Search for recent AI papers",
  "Write a Python script",
];

const DUMMY_HISTORY = [
  { id: 1, text: "Explain transformer attention" },
  { id: 2, text: "Debug my FastAPI routes" },
  { id: 3, text: "Search: local LLM benchmarks" },
];

// ── App ────────────────────────────────────────────────────────
export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [toolTab, setToolTab] = useState("search");
  const [provider, setProvider] = useState(PROVIDERS[0]);
  const [modelDropdown, setModelDropdown] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Notes state
  const [note, setNote] = useState("# Workspace notes\n\nLocal thoughts stay local.\n");
  const [saveState, setSaveState] = useState("idle"); // idle | saved | saving
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Backend status
  const [backendStatus, setBackendStatus] = useState("connecting"); // ok | error | connecting

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const saveTimerRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, busy]);

  // Check backend health
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${API}/health`, { signal: AbortSignal.timeout(3000) });
        setBackendStatus(res.ok ? "ok" : "error");
      } catch {
        setBackendStatus("error");
      }
    };
    check();
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, []);

  // Word/char count
  useEffect(() => {
    setCharCount(note.length);
    setWordCount(note.trim() ? note.trim().split(/\s+/).length : 0);
  }, [note]);

  // Auto-save notes
  const autoSave = useCallback(async (content) => {
    setSaveState("saving");
    try {
      await fetch(`${API}/api/workspace/notes/session.md`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "session.md", content }),
      });
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("idle");
    }
  }, []);

  const handleNoteChange = (e) => {
    setNote(e.target.value);
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => autoSave(e.target.value), 1800);
  };

  // Send message
  const send = useCallback(async (text) => {
    const content = (text || input).trim();
    if (!content || busy) return;
    setInput("");
    const userMsg = { role: "user", content };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setBusy(true);
    setStreamingContent("");

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, provider: provider.id }),
      });
      const data = await res.json();
      const reply = data.content || data.detail || "No response.";

      // Simulate streaming for local models
      let displayed = "";
      for (let i = 0; i < reply.length; i++) {
        displayed += reply[i];
        setStreamingContent(displayed);
        await new Promise(r => setTimeout(r, Math.random() * 8 + 2));
      }
      setStreamingContent("");
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Connection error: ${err.message}. Is your backend running at ${API}?`,
      }]);
    } finally {
      setBusy(false);
    }
  }, [input, messages, busy, provider]);

  // Keyboard handler
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  // Search
  const runSearch = async () => {
    if (!searchQuery.trim() || searching) return;
    setSearching(true);
    setSearchResults([]);
    try {
      const res = await fetch(`${API}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, limit: 8 }),
      });
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter") runSearch();
  };

  // New chat
  const newChat = () => {
    setMessages([]);
    setStreamingContent("");
    setBusy(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const statusColor = { ok: "var(--teal-400)", error: "#e24b4a", connecting: "var(--amber-400)" }[backendStatus];

  return (
    <div className={`app-shell${sidebarCollapsed ? " sidebar-collapsed" : ""}`}>
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-logo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d={Icons.logo} />
            </svg>
          </div>
          <div>
            <div className="brand-name">Nexus</div>
            <div className="brand-tag">Local AI</div>
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(v => !v)} title="Toggle sidebar">
            <Icon d={sidebarCollapsed ? Icons.chevronsR : Icons.chevrons} size={14} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item${activeTab === "chat" ? " active" : ""}`} onClick={() => setActiveTab("chat")}>
            <Icon d={Icons.chat} size={16} />
            <span className="nav-label">Chat</span>
          </button>
          <button className={`nav-item${activeTab === "search" ? " active" : ""}`}
            onClick={() => { setActiveTab("chat"); setToolTab("search"); }}>
            <Icon d={Icons.search} size={16} />
            <span className="nav-label">Search</span>
          </button>
          <button className={`nav-item${activeTab === "notes" ? " active" : ""}`}
            onClick={() => { setActiveTab("chat"); setToolTab("notes"); }}>
            <Icon d={Icons.notes} size={16} />
            <span className="nav-label">Notes</span>
          </button>
        </nav>

        <div className="sidebar-section">
          <div className="section-title">Recent chats</div>
          <div className="history-list">
            {DUMMY_HISTORY.map(h => (
              <div key={h.id} className="history-item" onClick={() => inputRef.current?.focus()}>
                <Icon d={Icons.history} size={13} />
                <span className="history-item-text">{h.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="new-chat-btn" onClick={newChat}>
            <Icon d={Icons.plus} size={14} />
            <span>New chat</span>
          </button>
        </div>
      </aside>

      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-title">
          {activeTab === "chat" ? "Chat workspace" : activeTab}
        </div>
        <div className="header-sep" />

        <div className="model-picker">
          <button className="provider-badge" onClick={() => setModelDropdown(v => !v)}>
            <span className={`provider-dot${backendStatus !== "ok" ? " offline" : ""}`} />
            <span>{provider.name}</span>
            <span style={{ color: "var(--text-muted)", fontSize: 11 }}>· {provider.model}</span>
            <Icon d="M6 9l6 6 6-6" size={12} />
          </button>

          <div className={`model-dropdown${modelDropdown ? " open" : ""}`}>
            {PROVIDERS.map(p => (
              <div key={p.id} className={`model-option${provider.id === p.id ? " active" : ""}`}
                onClick={() => { setProvider(p); setModelDropdown(false); }}>
                <div className="model-icon">{p.icon}</div>
                <div className="model-info">
                  <div className="model-name">{p.name} — {p.model}</div>
                  <div className="model-desc">{p.desc}</div>
                </div>
                {provider.id === p.id && <Icon d={Icons.check} size={13} className="model-check" style={{ color: "var(--teal-400)" }} />}
              </div>
            ))}
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-btn" title="Settings">
            <Icon d={Icons.settings} size={15} />
          </button>
        </div>
      </header>

      {/* ── Main area ── */}
      <main className="main-area">
        {/* Chat pane */}
        <div className="chat-pane">
          <div className="messages-area" onClick={() => setModelDropdown(false)}>
            {messages.length === 0 && !busy && (
              <div className="chat-empty">
                <div className="chat-empty-logo">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round">
                    <path d={Icons.zap} />
                  </svg>
                </div>
                <h2>Nexus is ready</h2>
                <p>Your private, local AI workspace. No cloud, no tracking — just your model, your data.</p>
                <div className="suggestion-chips">
                  {SUGGESTIONS.map(s => (
                    <button key={s} className="chip" onClick={() => send(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className="message-group">
                <div className={`message-role ${msg.role}`}>
                  {msg.role === "assistant" ? `${provider.icon} ${provider.name}` : "You"}
                </div>
                <div className={`message ${msg.role}`}>
                  {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
                </div>
              </div>
            ))}

            {busy && !streamingContent && (
              <div className="thinking">
                <div className="thinking-dots">
                  <div className="thinking-dot" />
                  <div className="thinking-dot" />
                  <div className="thinking-dot" />
                </div>
                <span className="thinking-text">{provider.name} is thinking…</span>
              </div>
            )}

            {streamingContent && (
              <div className="message-group">
                <div className="message-role assistant">{provider.icon} {provider.name}</div>
                <div className="message assistant streaming">
                  {renderContent(streamingContent)}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="composer-area">
            <div className="composer-bar">
              <textarea
                ref={inputRef}
                className="composer-input"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask your local model… (Enter to send, Shift+Enter for newline)"
                rows={1}
                disabled={busy}
                autoFocus
              />
              <div className="composer-actions">
                <button className={`send-btn`} onClick={() => send()} disabled={busy || !input.trim()} title="Send (Enter)">
                  <Icon d={Icons.send} size={14} />
                </button>
              </div>
            </div>
            <div className="composer-hint">
              <kbd>Enter</kbd> send · <kbd>Shift+Enter</kbd> newline · <kbd>/</kbd> commands
            </div>
          </div>
        </div>

        {/* Tool pane */}
        <div className="tool-pane">
          <div className="tool-tabs">
            <button className={`tool-tab${toolTab === "search" ? " active" : ""}`} onClick={() => setToolTab("search")}>
              <Icon d={Icons.search} />
              Search
            </button>
            <button className={`tool-tab${toolTab === "notes" ? " active" : ""}`} onClick={() => setToolTab("notes")}>
              <Icon d={Icons.notes} />
              Notes
            </button>
          </div>

          {/* Search panel */}
          <div className={`tool-panel${toolTab === "search" ? " active" : ""}`}>
            <div className="panel-header">
              <div className="search-bar">
                <Icon d={Icons.search} size={14} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKey}
                  placeholder="Search via SearXNG…"
                />
                <button className="search-go" onClick={runSearch} disabled={searching}>
                  {searching ? "…" : "Go"}
                </button>
              </div>
            </div>
            <div className="search-results">
              {!searching && searchResults.length === 0 && (
                <div className="search-empty">
                  <Icon d={Icons.globe} size={32} />
                  <div>Search the web through your<br />self-hosted SearXNG instance</div>
                </div>
              )}
              {searching && (
                <div className="search-empty">
                  <div className="thinking-dots" style={{ justifyContent: "center" }}>
                    <div className="thinking-dot" />
                    <div className="thinking-dot" />
                    <div className="thinking-dot" />
                  </div>
                  <div>Searching…</div>
                </div>
              )}
              {searchResults.map((r, i) => (
                <a key={i} className="result-card" href={r.url} target="_blank" rel="noreferrer">
                  <div className="result-card-inner">
                    {r.engine && <div className="result-engine">{r.engine}</div>}
                    <div className="result-title">{r.title}</div>
                    {r.snippet && <div className="result-snippet">{r.snippet}</div>}
                    <div className="result-url">{r.url}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Notes panel */}
          <div className={`tool-panel${toolTab === "notes" ? " active" : ""}`}>
            <div className="notes-panel">
              <div className="notes-toolbar">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon d={Icons.notes} size={13} style={{ color: "var(--text-muted)" }} />
                  <span className="notes-meta">session.md</span>
                </div>
                <div className="notes-actions">
                  <span className={`save-indicator${saveState === "saved" ? " show" : ""}`}>
                    <Icon d={Icons.check} size={11} />
                    Saved
                  </span>
                  <button className="notes-btn primary" onClick={() => autoSave(note)} disabled={saveState === "saving"}>
                    <Icon d={Icons.save} size={12} />
                    {saveState === "saving" ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
              <div className="notes-editor">
                <textarea
                  className="notes-textarea"
                  value={note}
                  onChange={handleNoteChange}
                  placeholder="# Your notes\n\nStart writing…"
                  spellCheck
                />
              </div>
              <div className="notes-footer">
                <span>{wordCount} words · {charCount} chars</span>
                <span>Markdown</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Status bar ── */}
      <div className="status-bar">
        <div className="status-item">
          <div className="status-dot" style={{ background: statusColor }} />
          <span>Backend {backendStatus === "ok" ? "connected" : backendStatus === "error" ? "offline" : "connecting…"}</span>
        </div>
        <div className="status-item">
          <div className="status-dot" style={{ background: "var(--ink-600)" }} />
          <span>Ollama local</span>
        </div>
        <div className="status-item">
          <div className="status-dot" style={{ background: "var(--teal-400)" }} />
          <span>SearXNG ready</span>
        </div>
        <div className="status-sep" />
        <div className="status-item">
          <Icon d={Icons.cpu} size={11} />
          <span>{provider.model}</span>
        </div>
        {messages.length > 0 && (
          <div className="status-item">
            <span>{messages.length} messages</span>
          </div>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
