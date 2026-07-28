import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  Crown,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import PricingCards from "../components/PricingCards";
import { api } from "../services/apiClient";
import { useAuth } from "../context/AuthContext";

const audienceCards = [
  {
    icon: Building2,
    title: "Cho HR",
    titleEn: "For HR",
    points: ["Quản lý job post", "Shortlist chất lượng", "Giảm thời gian phản hồi"],
  },
  {
    icon: Users,
    title: "Cho ứng viên",
    titleEn: "For candidates",
    points: ["Tìm việc phù hợp", "Thông tin minh bạch", "Theo dõi ứng tuyển"],
  },
  {
    icon: ShieldCheck,
    title: "Cho team",
    titleEn: "For teams",
    points: ["Cộng tác nhanh", "Dữ liệu tập trung", "Quyết định chắc chắn"],
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
    tags: ["Sourcing", "Interview", "Branding"],
  },
  {
    title: "Product Designer",
    company: "Atlas People",
    location: "Hybrid",
    salary: "$2,000 - $3,500",
    tags: ["UX", "Motion", "Research"],
  },
];

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.plans.list().then(setPlans).catch(() => {});
  }, []);

  return (
    <div className="page page--landing">
      <div className="ambient ambient--violet" />
      <div className="ambient ambient--coral" />
      <div className="noise" />

      <Navbar />

      <section className="hero hero--asymmetric">
        <div className="hero-content">
          {isAuthenticated && (
            <div className="session-chip animate-in">
              <BadgeCheck size={14} />
              Xin chào {user.firstName}, bạn đã đăng nhập.
            </div>
          )}
          <span className="eyebrow">
            <Zap size={14} />
            Nền tảng tuyển dụng · Privacy-first
          </span>
          <h1>
            Tuyển đúng người.
            <em> Tìm đúng việc.</em>
            <br />
            Nhanh hơn mọi giải pháp HR thông thường.
          </h1>
          <p className="hero-lead">
            UneedWhat kết hợp pipeline thông minh, gói VIP linh hoạt và trải nghiệm
            tối giản cho HR lẫn ứng viên — không còn giao diện corporate nhàm chán.
          </p>
          <div className="hero-cta">
            <Link to="/pricing" className="primary-btn primary-btn--glow">
              Khám phá gói VIP
              <Crown size={16} />
            </Link>
            <Link to="/login" className="secondary-btn">
              Đăng nhập
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-metrics">
            <div>
              <strong>1.2k+</strong>
              <span>Ứng viên hoạt động</span>
            </div>
            <div>
              <strong>180+</strong>
              <span>Job mới / tháng</span>
            </div>
            <div>
              <strong>4 gói</strong>
              <span>Free → Enterprise VIP</span>
            </div>
          </div>
        </div>

        <div className="hero-visual glass">
          <div className="visual-header">
            <span>Pipeline snapshot</span>
            <span className="pill pill--gold">Live</span>
          </div>
          <div className="pipeline-bars">
            <div style={{ "--h": "72%" }}><span>Mới</span><strong>24</strong></div>
            <div style={{ "--h": "48%" }}><span>Lọc</span><strong>11</strong></div>
            <div style={{ "--h": "36%" }}><span>PV</span><strong>6</strong></div>
            <div style={{ "--h": "18%" }}><span>Offer</span><strong>2</strong></div>
          </div>
          <div className="visual-rows">
            <div className="visual-row">
              <Briefcase size={16} />
              <div>
                <strong>Senior Frontend Engineer</strong>
                <span>3 candidates matched</span>
              </div>
            </div>
            <div className="visual-row">
              <Crown size={16} />
              <div>
                <strong>Business plan active</strong>
                <span>Advanced analytics enabled</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="section-intro">
          <span className="eyebrow">Tính năng</span>
          <h2>Thiết kế cho từng vai trò</h2>
        </div>
        <div className="feature-grid">
          {audienceCards.map((card) => (
            <article className="feature-card glass animate-in" key={card.title}>
              <card.icon size={22} className="feature-icon" />
              <h3>{card.title}</h3>
              <span className="feature-sub">{card.titleEn}</span>
              <ul>
                {card.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--pricing-preview" id="pricing">
        <div className="section-intro">
          <span className="eyebrow">Gói VIP</span>
          <h2>Team · Business · Enterprise</h2>
          <p>Scale hiring theo quy mô công ty — từ startup đến enterprise.</p>
        </div>
        <PricingCards plans={plans} highlight="business" />
        <div className="section-cta">
          <Link to="/pricing" className="ghost-btn">
            Xem bảng so sánh đầy đủ
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="section" id="jobs">
        <div className="section-intro section-intro--row">
          <div>
            <span className="eyebrow">Việc làm</span>
            <h2>Cơ hội nổi bật</h2>
          </div>
          <div className="search-pill">
            <Search size={14} />
            Tìm theo kỹ năng, vị trí, mức lương
          </div>
        </div>
        <div className="job-grid">
          {featuredJobs.map((job) => (
            <article className="job-card glass" key={job.title}>
              <div className="job-card-head">
                <div>
                  <h3>{job.title}</h3>
                  <p>{job.company}</p>
                </div>
                <Star size={16} className="star-icon" />
              </div>
              <div className="job-meta">
                <span><MapPin size={14} />{job.location}</span>
                <span><Briefcase size={14} />{job.salary}</span>
              </div>
              <div className="tag-row">
                {job.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 UneedWhat · Tuyển dụng thông minh, bảo mật tối đa</p>
        <Link to="/admin/login" className="footer-admin">
          <ShieldCheck size={14} />
          Admin portal
        </Link>
      </footer>
    </div>
  );
}
