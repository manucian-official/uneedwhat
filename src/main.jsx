import React from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarRange,
  CheckCircle2,
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
    title: "Đăng tuyển nhanh",
    text: "Tạo job post rõ ràng, chuẩn hóa yêu cầu và hiển thị ngay cho đúng nhóm ứng viên.",
  },
  {
    title: "Lọc thông minh",
    text: "Sàng hồ sơ theo kỹ năng, seniority, mức lương và mức độ phù hợp văn hoá.",
  },
  {
    title: "Kết nối gọn",
    text: "Lên lịch phỏng vấn, gửi phản hồi và giữ toàn bộ pipeline đồng nhất trong một nơi.",
  },
];

const audienceCards = [
  {
    icon: Building2,
    title: "Cho HR",
    points: ["Quản lý job post", "Tăng chất lượng shortlist", "Giảm thời gian phản hồi"],
  },
  {
    icon: Users,
    title: "Cho ứng viên",
    points: ["Tìm việc phù hợp", "Xem thông tin minh bạch", "Theo dõi ứng tuyển"],
  },
  {
    icon: ShieldCheck,
    title: "Cho team tuyển dụng",
    points: ["Cộng tác nhanh", "Giữ dữ liệu tập trung", "Ra quyết định chắc hơn"],
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
  return (
    <main className="page-shell">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      <div className="grid-glow" />

      <header className="topbar">
        <div className="brand">
          <Sparkles size={22} />
          <div>
            <strong>UneedWhat I Need U</strong>
            <span>Recruitment platform for HR and job seekers</span>
          </div>
        </div>
        <nav className="nav-links">
          <a href="#hr">Dành cho HR</a>
          <a href="#jobs">Việc làm</a>
          <a href="#flow">Quy trình</a>
        </nav>
        <button className="primary-btn">
          Đăng ký ngay
          <ArrowRight size={16} />
        </button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="hero-badge">
            <BadgeCheck size={14} />
            <span>Nền tảng tuyển dụng tập trung cho HR và ứng viên</span>
          </div>
          <h1>Tuyển đúng người, tìm đúng việc, nhanh hơn.</h1>
          <p>
            Một landing page tuyển dụng với background có chiều sâu, hero nổi bật và layout rõ
            ràng để HR đăng tin, còn ứng viên thì tìm cơ hội phù hợp ngay từ cái nhìn đầu tiên.
          </p>

          <div className="hero-actions">
            <button className="primary-btn">
              Khám phá việc làm
              <ArrowRight size={16} />
            </button>
            <button className="secondary-btn">Dành cho HR</button>
          </div>

          <div className="hero-stats">
            <article>
              <strong>1.2k+</strong>
              <span>ứng viên hoạt động</span>
            </article>
            <article>
              <strong>180+</strong>
              <span>job post mỗi tháng</span>
            </article>
            <article>
              <strong>95%</strong>
              <span>pipeline rõ ràng hơn</span>
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
              <span>Mới đăng</span>
              <strong>24</strong>
            </div>
            <div>
              <span>Sàng lọc</span>
              <strong>11</strong>
            </div>
            <div>
              <span>Phỏng vấn</span>
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
            <h2>Cơ hội nổi bật</h2>
          </div>
          <div className="search-chip">
            <Search size={14} />
            Tìm theo kỹ năng, vị trí, mức lương
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
            <h2>Luồng tuyển dụng</h2>
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
