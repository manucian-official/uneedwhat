import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";
import Navbar from "../components/Navbar";
import PricingCards, { PricingComparisonTable } from "../components/PricingCards";
import { api } from "../services/apiClient";
import { useAuth } from "../context/AuthContext";

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [subscribing, setSubscribing] = useState(null);

  useEffect(() => {
    api.plans.list().then(setPlans).catch(() => {});
  }, []);

  async function handleSelect(plan) {
    if (plan.tier === "enterprise") {
      window.location.href = "mailto:sales@uneedwhat.com?subject=Enterprise%20VIP%20Inquiry";
      return;
    }
    if (!isAuthenticated) {
      navigate("/login", { state: { redirect: "/pricing", plan: plan.slug } });
      return;
    }
    setSubscribing(plan.slug);
    try {
      await api.plans.subscribe(plan.slug);
      navigate("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubscribing(null);
    }
  }

  return (
    <div className="page page--pricing">
      <div className="ambient ambient--violet" />
      <div className="ambient ambient--coral" />

      <Navbar />

      <section className="pricing-hero">
        <span className="eyebrow">
          <Crown size={14} />
          Gói dịch vụ · Packages
        </span>
        <h1>Chọn gói phù hợp với quy mô team</h1>
        <p>
          Từ Free cho cá nhân đến Enterprise VIP với API, branding và hỗ trợ ưu tiên.
          Nâng cấp bất cứ lúc nào.
        </p>
      </section>

      <section className="section">
        <PricingCards
          plans={plans}
          highlight="business"
          onSelect={handleSelect}
        />
        {subscribing && <p className="muted center">Đang xử lý gói {subscribing}...</p>}
      </section>

      <section className="section">
        <div className="section-intro">
          <h2>Bảng so sánh chi tiết</h2>
          <p>Feature comparison · Đối chiếu tính năng</p>
        </div>
        <PricingComparisonTable plans={plans} />
      </section>

      <section className="section cta-band glass">
        <h2>Cần tư vấn Enterprise?</h2>
        <p>Liên hệ đội ngũ VIP để được custom branding, SLA và API riêng.</p>
        <div className="hero-cta">
          <a href="mailto:sales@uneedwhat.com" className="primary-btn primary-btn--glow">
            Liên hệ sales
          </a>
          <Link to="/login" className="secondary-btn">
            Đăng nhập để nâng cấp
          </Link>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 UneedWhat · Flexible pricing for every hiring team</p>
      </footer>
    </div>
  );
}
