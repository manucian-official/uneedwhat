import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarRange,
  CheckCircle2,
  CircleUserRound,
  Globe2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import "./styles.css";

const hiringSteps = [
  {
    title: "Dang tuyen nhanh",
    text: "Tao job post ro rang, chuan hoa yeu cau va hien thi ngay cho dung nhom ung vien.",
  },
  {
    title: "Loc thong minh",
    text: "Sang ho so theo ky nang, seniority, muc luong va muc do phu hop van hoa.",
  },
  {
    title: "Ket noi gon",
    text: "Len lich phong van, gui phan hoi va giu toan bo pipeline dong nhat trong mot noi.",
  },
];

const audienceCards = [
  {
    icon: Building2,
    title: "Cho HR",
    points: ["Quan ly job post", "Tang chat luong shortlist", "Giam thoi gian phan hoi"],
  },
  {
    icon: Users,
    title: "Cho ung vien",
    points: ["Tim viec phu hop", "Xem thong tin minh bach", "Theo doi ung tuyen"],
  },
  {
    icon: ShieldCheck,
    title: "Cho team tuyen dung",
    points: ["Cong tac nhanh", "Giu du lieu tap trung", "Ra quyet dinh chac hon"],
  },
];

const featuredJobs = [
  {
    title: "Senior Frontend Engineer",
    company: "Northstar Studio",
    location: "Remote",
    salary: "$2,500 - $4,200",
    tags: ["React", "TypeScript", "Design systems"],
  },
  {
    title: "Talent Acquisition Specialist",
    company: "BrightHire Vietnam",
    location: "Ho Chi Minh City",
    salary: "$1,700 - $2,800",
    tags: ["Sourcing", "Interview", "Employer branding"],
  },
  {
    title: "Product Designer",
    company: "Atlas People",
    location: "Hybrid",
    salary: "$2,000 - $3,500",
    tags: ["UX", "Motion", "Research"],
  },
];

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("HR");

  useEffect(() => {
    const savedUser = window.localStorage.getItem("uneedwhat.user");
    if (!savedUser) return;
    try {
      setAuthUser(JSON.parse(savedUser));
    } catch {
      window.localStorage.removeItem("uneedwhat.user");
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      window.localStorage.setItem("uneedwhat.user", JSON.stringify(authUser));
    } else {
      window.localStorage.removeItem("uneedwhat.user");
    }
  }, [authUser]);

  function handleLogin(event) {
    event.preventDefault();
    setAuthUser({
      name: email.split("@")[0] || "Guest",
      email,
      role,
    });
    setIsLoginOpen(false);
  }

  function handleQuickDemo() {
    setAuthUser({
      name: "Demo User",
      email: "demo@uneedwhat.com",
      role: "HR",
    });
    setIsLoginOpen(false);
  }

  return (
    <main className="page-shell">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="grid-glow" />

      {isLoginOpen && (
        <div className="auth-overlay" role="dialog" aria-modal="true" aria-label="Login dialog">
          <form className="auth-card" onSubmit={handleLogin}>
            <div className="auth-head">
              <div>
                <span className="section-kicker">Login</span>
                <h2>Dang nhap de bat dau</h2>
              </div>
              <button type="button" className="ghost-btn" onClick={() => setIsLoginOpen(false)}>
                Dong
              </button>
            </div>

            <label className="field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="hr@company.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                autoComplete="current-password"
                required
              />
            </label>

            <label className="field">
              <span>Vai tro</span>
              <select value={role} onChange={(event) => setRole(event.target.value)}>
                <option>HR</option>
                <option>Candidate</option>
              </select>
            </label>

            <div className="auth-actions">
              <button type="submit" className="primary-btn">
                Login
              </button>
              <button type="button" className="secondary-btn" onClick={handleQuickDemo}>
                Quick demo
              </button>
            </div>
          </form>
        </div>
      )}

      <header className="topbar">
        <div className="brand">
          <Sparkles size={22} />
          <div>
            <strong>UneedWhat I Need U</strong>
            <span>Recruitment platform for HR and job seekers</span>
          </div>
        </div>
        <nav className="nav-links">
          <a href="#hr">Danh cho HR</a>
          <a href="#jobs">Viec lam</a>
          <a href="#flow">Quy trinh</a>
        </nav>
        <div className="topbar-actions">
          {authUser ? (
            <div className="user-chip">
              <CircleUserRound size={16} />
              <span>{authUser.name}</span>
              <button className="ghost-btn" onClick={() => setAuthUser(null)}>
                Logout
              </button>
            </div>
          ) : (
            <button className="primary-btn" onClick={() => setIsLoginOpen(true)}>
              Dang nhap
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          {authUser && (
            <div className="hero-session">
              <BadgeCheck size={14} />
              <span>
                Xin chao {authUser.name}, ban dang o che do {authUser.role.toLowerCase()}.
              </span>
            </div>
          )}
          <div className="hero-badge">
            <BadgeCheck size={14} />
            <span>Nen tang tuyen dung tap trung cho HR va ung vien</span>
          </div>
          <h1>Tuyen dung dung nguoi, tim dung viec, nhanh hon.</h1>
          <p>
            Mot landing page tuyen dung voi background co chieu sau, hero noi bat va layout ro
            rang de HR dang tin, con ung vien thi tim co hoi phu hop ngay tu cai nhin dau tien.
          </p>

          <div className="hero-actions">
            <button className="primary-btn">
              Kham pha viec lam
              <ArrowRight size={16} />
            </button>
            <button className="secondary-btn" onClick={() => setIsLoginOpen(true)}>
              Dang nhap thu
            </button>
          </div>

          <div className="hero-stats">
            <article>
              <strong>1.2k+</strong>
              <span>ung vien hoat dong</span>
            </article>
            <article>
              <strong>180+</strong>
              <span>job post moi thang</span>
            </article>
            <article>
              <strong>95%</strong>
              <span>pipeline ro rang hon</span>
            </article>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-top">
            <div>
              <span className="panel-label">Hiring board</span>
              <h2>Pipeline snapshot</h2>
            </div>
            <div className="panel-pill">
              <Globe2 size={14} />
              Global reach
            </div>
          </div>

          <div className="pipeline">
            <div>
              <span>Moi dang</span>
              <strong>24</strong>
            </div>
            <div>
              <span>Sang loc</span>
              <strong>11</strong>
            </div>
            <div>
              <span>Phong van</span>
              <strong>6</strong>
            </div>
            <div>
              <span>Offer</span>
              <strong>2</strong>
            </div>
          </div>

          <div className="panel-list">
            <div className="panel-row">
              <Briefcase size={16} />
              <div>
                <strong>Senior Frontend Engineer</strong>
                <span>Remote, 3 candidates matched</span>
              </div>
            </div>
            <div className="panel-row">
              <CalendarRange size={16} />
              <div>
                <strong>Interview block</strong>
                <span>4 slots open this week</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-grid" id="hr">
        {audienceCards.map((card) => (
          <article className="feature-card" key={card.title}>
            <div className="feature-top">
              <card.icon size={18} />
              <h3>{card.title}</h3>
            </div>
            <ul>
              {card.points.map((point) => (
                <li key={point}>
                  <CheckCircle2 size={14} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="jobs-section" id="jobs">
        <div className="section-head">
          <div>
            <span className="section-kicker">Featured jobs</span>
            <h2>Co hoi noi bat</h2>
          </div>
          <div className="search-chip">
            <Search size={14} />
            Tim theo ky nang, vi tri, muc luong
          </div>
        </div>

        <div className="job-grid">
          {featuredJobs.map((job) => (
            <article className="job-card" key={job.title}>
              <div className="job-head">
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                </div>
                <Star size={16} />
              </div>
              <div className="job-meta">
                <span>
                  <MapPin size={14} />
                  {job.location}
                </span>
                <span>
                  <Briefcase size={14} />
                  {job.salary}
                </span>
              </div>
              <div className="tag-row">
                {job.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flow-section" id="flow">
        <div className="section-head">
          <div>
            <span className="section-kicker">Workflow</span>
            <h2>Luong tuyen dung</h2>
          </div>
        </div>
        <div className="flow-grid">
          {hiringSteps.map((step, index) => (
            <article className="flow-card" key={step.title}>
              <span className="flow-index">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
