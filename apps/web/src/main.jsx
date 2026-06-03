import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Bot, Globe, Save, Send, Sparkles } from "lucide-react";
import "./styles.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Local brain online. Ask me something strange but useful." },
  ]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [note, setNote] = useState("# Workspace notes\n\nLocal thoughts stay local.");
  const [busy, setBusy] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const nextMessages = [...messages, { role: "user", content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, provider: "ollama" }),
      });
      const data = await response.json();
      setMessages([...nextMessages, { role: "assistant", content: data.content || data.detail || "No response." }]);
    } finally {
      setBusy(false);
    }
  }

  async function runSearch() {
    if (!searchQuery.trim()) return;
    const response = await fetch(`${apiBaseUrl}/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: searchQuery, limit: 5 }),
    });
    const data = await response.json();
    setSearchResults(data.results || []);
  }

  async function saveNote() {
    await fetch(`${apiBaseUrl}/api/workspace/notes/session.md`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "session.md", content: note }),
    });
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Sparkles size={22} />
          <span>Oddity AI</span>
        </div>
        <button className="nav-button active"><Bot size={18} /> Chat</button>
        <button className="nav-button"><Globe size={18} /> Search</button>
        <button className="nav-button"><Save size={18} /> Notes</button>
      </aside>

      <section className="chat-pane">
        <div className="messages">
          {messages.map((message, index) => (
            <article className={`message ${message.role}`} key={`${message.role}-${index}`}>
              <span>{message.role}</span>
              <p>{message.content}</p>
            </article>
          ))}
        </div>
        <div className="composer">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && sendMessage()}
            placeholder="Ask your local model..."
          />
          <button onClick={sendMessage} disabled={busy} title="Send">
            <Send size={18} />
          </button>
        </div>
      </section>

      <section className="tool-pane">
        <div className="panel">
          <h2>Web search</h2>
          <div className="inline-form">
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search via SearXNG" />
            <button onClick={runSearch} title="Search"><Globe size={18} /></button>
          </div>
          <div className="results">
            {searchResults.map((result) => (
              <a href={result.url} target="_blank" rel="noreferrer" key={result.url}>
                <strong>{result.title}</strong>
                <span>{result.snippet}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="panel notes">
          <h2>Local notes</h2>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} />
          <button className="save-button" onClick={saveNote}><Save size={18} /> Save note</button>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

