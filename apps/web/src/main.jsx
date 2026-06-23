import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Globe,
  LayoutDashboard,
  Save,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
} from "lucide-react";
import "./styles.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const landingStats = [
  { value: "01", label: "nền tảng cho HR và ứng viên", icon: LayoutDashboard },
  { value: "24/7", label: "tìm kiếm cơ hội và nguồn ứng viên", icon: Search },
  { value: "3 bước", label: "để đi từ khám phá đến tuyển dụng", icon: Target },
];

const landingAudience = [
  {
    title: "Cho HR",
    icon: Building2,
    points: ["Đăng JD rõ ràng", "Sàng lọc nhanh", "Chốt lịch phỏng vấn"],
  },
  {
    title: "Cho ứng viên",
    icon: Users,
    points: ["Tìm việc phù hợp", "Lưu ghi chú cá nhân", "Theo dõi tiến trình"],
  },
  {
    title: "Cho team tuyển dụng",
    icon: ShieldCheck,
    points: ["Cộng tác minh bạch", "Tập trung dữ liệu", "Ra quyết định nhanh"],
  },
];

const landingSteps = [
  { title: "Khám phá", text: "Duyệt tin tuyển dụng, skill và tín hiệu phù hợp." },
  { title: "Sàng lọc", text: "So sánh hồ sơ, ghi chú và shortlist trong một nơi." },
  { title: "Kết nối", text: "Chuyển sang phỏng vấn, offer và onboarding mượt hơn." },
];

function App() {
  const [view, setView] = useState("landing");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Nen tang tuyen dung san sang. Hay hoi ve JD, shortlist, phong van hoac chien luoc tim viec.",
    },
  ]);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [note, setNote] = useState(
    "# Pipeline notes\n\n- Goal: hire the right people faster.\n- Focus: clear JD, candidate fit, quick feedback.\n"
  );
  const [busy, setBusy] = useState(false);

  async function sendMessage() {
    const content = input.trim();
    if (!content || busy) return;
    const nextMessages = [...messages, { role: "user", content }];
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
      setMessages([
        ...nextMessages,
        { role: "assistant", content: data.content || data.detail || "No response." },
      ]);
    } catch (error) {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: `Connection error: ${error.message}` },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function runSearch() {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(`${apiBaseUrl}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, limit: 5 }),
      });
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    }
  }

  async function saveNote() {
    await fetch(`${apiBaseUrl}/api/workspace/notes/session.md`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "session.md", content: note }),
    });
  }

  if (view === "landing") {
    return (
      <main className="landing-shell">
        <div className="landing-orb landing-orb-a" />
        <div className="landing-orb landing-orb-b" />

        <header className="landing-header">
          <button className="brand landing-brand" onClick={() => setView("workspace")}>
            <Sparkles size={22} />
            <div>
              <span>UneedWhat</span>
              <small>Recruitment workspace</small>
            </div>
          </button>

          <nav className="landing-links">
            <a href="#for-hr">Cho HR</a>
            <a href="#for-candidates">Cho ung vien</a>
            <a href="#flow">Quy trinh</a>
          </nav>

          <button className="landing-cta secondary" onClick={() => setView("workspace")}>
            Vao workspace
          </button>
        </header>

        <section className="landing-hero">
          <div className="hero-copy">
            <div className="hero-badge">
              <BadgeCheck size={14} />
              <span>Background rieng cho HR va ung vien</span>
            </div>
            <h1>Tuyen dung theo cach ro rang hon.</h1>
            <p>
              Mot khong gian co hero rieng, layout ro rang va background hien dai de HR dang tin,
              sang loc ho so, con ung vien thi kham pha co hoi va theo doi hanh trinh ung tuyen.
            </p>
            <div className="hero-actions">
              <button className="landing-cta" onClick={() => setView("workspace")}>
                Mo workspace
                <ArrowRight size={16} />
              </button>
              <button className="landing-cta ghost" onClick={() => setView("workspace")}>
                Xem giao dien
              </button>
            </div>

            <div className="hero-stats">
              {landingStats.map((stat) => (
                <article className="stat-card" key={stat.label}>
                  <stat.icon size={18} />
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-chip">Live hiring board</div>
            <div className="visual-card visual-primary">
              <div className="visual-card-head">
                <span className="visual-label">Pipeline snapshot</span>
                <span className="visual-status">
                  <Clock3 size={12} />
                  2 min ago
                </span>
              </div>
              <div className="pipeline-columns">
                <div className="pipeline-column">
                  <span>Source</span>
                  <strong>24</strong>
                </div>
                <div className="pipeline-column">
                  <span>Screening</span>
                  <strong>11</strong>
                </div>
                <div className="pipeline-column">
                  <span>Interview</span>
                  <strong>6</strong>
                </div>
                <div className="pipeline-column">
                  <span>Offer</span>
                  <strong>2</strong>
                </div>
              </div>
              <div className="visual-list">
                <div className="visual-row">
                  <FileText size={14} />
                  <div>
                    <strong>Senior Frontend Engineer</strong>
                    <span>Remote, 3 candidates matched</span>
                  </div>
                </div>
                <div className="visual-row">
                  <Users size={14} />
                  <div>
                    <strong>Candidate shortlist</strong>
                    <span>Scorecard and notes synced</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="visual-stack">
              <article className="visual-card compact-card" id="for-hr">
                <div className="compact-top">
                  <Building2 size={16} />
                  <span>For HR</span>
                </div>
                <p>Dang JD, loc ho so va giu team aligned trong mot flow thong nhat.</p>
              </article>
              <article className="visual-card compact-card" id="for-candidates">
                <div className="compact-top">
                  <Briefcase size={16} />
                  <span>For candidates</span>
                </div>
                <p>Tim role phu hop, luu ghi chu va chu dong theo doi co hoi.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="landing-grid" id="flow">
          {landingAudience.map((audience) => (
            <article className="feature-card" key={audience.title}>
              <div className="feature-top">
                <audience.icon size={18} />
                <h3>{audience.title}</h3>
              </div>
              <ul>
                {audience.points.map((point) => (
                  <li key={point}>
                    <CheckCircle2 size={14} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <article className="feature-card flow-card">
            <div className="feature-top">
              <Star size={18} />
              <h3>Flow tuyen dung</h3>
            </div>
            <div className="flow-steps">
              {landingSteps.map((step, index) => (
                <div className="flow-step" key={step.title}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setView("landing")}>
          <Sparkles size={22} />
          <div>
            <span>UneedWhat</span>
            <small>Recruitment OS</small>
          </div>
        </button>
        <button className="nav-button active">
          <Bot size={18} /> Tuyen dung
        </button>
        <button className="nav-button">
          <Globe size={18} /> Tim ung vien
        </button>
        <button className="nav-button">
          <Save size={18} /> Ghi chu
        </button>
      </aside>

      <section className="chat-pane">
        <div className="messages">
          {messages.map((message, index) => (
            <article className={`message ${message.role}`} key={`${message.role}-${index}`}>
              <span>{message.role === "assistant" ? "Tro ly tuyen dung" : "Ban"}</span>
              <p>{message.content}</p>
            </article>
          ))}
        </div>
        <div className="composer">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && sendMessage()}
            placeholder="Hoi ve JD, shortlist, phong van hoac tim viec..."
          />
          <button onClick={sendMessage} disabled={busy} title="Gui">
            <Send size={18} />
          </button>
        </div>
      </section>

      <section className="tool-pane">
        <div className="panel">
          <h2>Tim kiem nguon ung vien</h2>
          <div className="inline-form">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tim tu khoa ky nang, seniority hoac benchmark..."
            />
            <button onClick={runSearch} title="Tim kiem">
              <Search size={18} />
            </button>
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
          <h2>Ghi chu pipeline</h2>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} />
          <button className="save-button" onClick={saveNote}>
            <Save size={18} /> Luu ghi chu
          </button>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
